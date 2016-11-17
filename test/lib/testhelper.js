var ipfsd = require('ipfsd-ctl')
var Config = require("../../lib/config");
var IPFSHost = require("../../lib/hosts/ipfshost");
var DumbRegistry = require("../../lib/registries/dumbregistry");
var path = require("path");
var promisify = require("promisify-node");
var fs = promisify(require("fs-extra"));
var solc = require("solc");
var dir = require("node-dir");
var each = require("async/each");
var temp = require("temp").track();
var assert = require("assert");

function Helper() {
  this.ipfs_server = null;
  this.host = null;
  this.registry = null;
  this.packages = {};
  this.example_directory = path.resolve(path.join(__dirname, "../", "../", "use-cases"));
};

Helper.prototype.assertHostMatchesFilesystem = function(sourceURI, source_path) {
  var self = this;
  var source_file_contents;

  return fs.readFile(source_path, "utf8").then(function(contents) {
    source_file_contents = contents;
  }).then(function() {
    return self.host.get(sourceURI)
  }).then(function(sourceURI_contents) {
    assert.equal(sourceURI_contents, source_file_contents);
  });
};

Helper.prototype.assertFilesMatch = function(expected, actual) {
  return Promise.all([
    fs.readFile(expected, "utf8"),
    fs.readFile(actual, "utf8")
  ]).then(function(results) {
    assert.equal(results[0], results[1]);
  });
};

var TestHelper = {
  setup: function(packages_to_setup) {
    var package_names = packages_to_setup.packages;
    var compile = packages_to_setup.compile;

    var helper = new Helper();

    before("set up ipfs server and registry", function(done) {
      // This code that sets up the IPFS server has widely varying runtimes...
      this.timeout(20000);

      ipfsd.disposableApi(function (err, ipfs) {
        helper.ipfs_server = ipfs;

        helper.host = new IPFSHost({
          host: helper.ipfs_server.apiHost,
          port: helper.ipfs_server.apiPort
        });

        helper.registry = new DumbRegistry();

        done(err);
      });
    });

    package_names.forEach(function(package_name) {
      var original_package_path = path.resolve(path.join(__dirname, "../", "../", "use-cases", package_name));
      var package_data = {
        config: null,
        contract_metadata: {},
        package_path: ""
      };
      helper.packages[package_name] = package_data;

      before("create temporary directory", function(done) {
        var temp_path = temp.mkdirSync("epm-test-");
        fs.copy(original_package_path, temp_path, {}).then(function() {
          package_data.package_path = temp_path;
          done();
        }).catch(done);
      });

      before("set up config", function() {
        package_data.config = Config.default().with({
          working_directory: path.resolve(package_data.package_path),
          host: helper.host,
          registry: helper.registry
        });
      });

      before("generate contract metadata", function(done) {
        this.timeout(5000);

        if (compile.indexOf(package_name) < 0) return done();

        var sources = {};

        dir.files(package_data.config.contracts_directory, function(err, files) {
          if (err) return done(err);

          each(files, function(file, finished) {
            fs.readFile(file, "utf8").then(function(contents) {
              sources[file] = contents;
              finished();
            }).catch(finished)
          }, function(err) {
            if (err) return done(err);

            var output = solc.compile({sources: sources}, 1);

            Object.keys(output.contracts).forEach(function(contract_name) {
              var contract = output.contracts[contract_name];
              package_data.contract_metadata[contract_name] = {
                abi: JSON.parse(contract.interface),
                bytecode: contract.bytecode,
                runtime_bytecode: contract.runtimeBytecode,
                compiler: {
                  version: solc.version(),
                }
              };
            });

            done();
          });
        });
      });
    });

    return helper;
  }
};

module.exports = TestHelper;
