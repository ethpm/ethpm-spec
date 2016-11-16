var ipfsd = require('ipfsd-ctl')
var Config = require("../lib/config");
var IPFSHost = require("../lib/hosts/ipfshost");
var DumbRegistry = require("../lib/registries/dumbregistry");
var EPM = require('../index.js');
var path = require("path");
var assert = require("assert");
var fs = require("fs");
var solc = require("solc");
var dir = require("node-dir");
var each = require("async/each");
var fs = require("fs");

describe("Publishing", function() {
  var ipfs_server;
  var host;
  var registry;
  var config;
  var contract_metadata = {};

  function checkHostMatchesFilesystem(sourceURI, source_path) {
    var source_file_contents;

    return new Promise(function(accept, reject) {
      fs.readFile(source_path, "utf8", function(err, contents) {
        if (err) return reject(err);
        source_file_contents = contents;
        accept();
      });
    }).then(function() {
      return host.get(sourceURI)
    }).then(function(sourceURI_contents) {
      assert.equal(sourceURI_contents, source_file_contents);
    });
  };

  before("set up ipfs server", function(done) {
    // This code that sets up the IPFS server has widely varying runtimes...
    this.timeout(20000);

    ipfsd.disposableApi(function (err, ipfs) {
      ipfs_server = ipfs;
      done(err);
    });
  });

  before("set up config", function() {
    host = new IPFSHost({
      host: ipfs_server.apiHost,
      port: ipfs_server.apiPort
    });
    registry = new DumbRegistry();
    config = Config.default().with({
      working_directory: path.resolve(path.join(__dirname, "../use-cases/owned-example/")),
      host: host,
      registry: registry
    });
  });

  before("generate contract metadata", function(done) {
    this.timeout(5000);

    var sources = {};

    dir.files(config.contracts_directory, function(err, files) {
      if (err) return done(err);

      each(files, function(file, finished) {
        fs.readFile(file, "utf8", function(err, contents) {
          if (err) return finished(err);

          sources[file] = contents;
          finished();
        })
      }, function(err) {
        if (err) return done(err);

        var output = solc.compile({sources: sources}, 1);

        Object.keys(output.contracts).forEach(function(contract_name) {
          var contract = output.contracts[contract_name];
          contract_metadata[contract_name] = {
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

  before("make the publish request", function() {
    this.timeout(10000);

    return EPM.publishPackage(config, contract_metadata);
  });

  it("published the correct lockfile", function() {
    var lockfile;

    return registry.getLockfileURI("owned", "1.0.0").then(function(lockfileURI) {
      return host.get(lockfileURI);
    }).then(function(data) {
      lockfile = JSON.parse(data);

      assert.equal(lockfile.version, "1.0.0");
      assert.equal(lockfile.manifest_version, 1);
      assert.deepEqual(lockfile.contracts, contract_metadata);

      return host.get(lockfile.package_manifest);
    }).then(function(data) {
      var manifest = JSON.parse(data);
      var expected_manifest = require(config.manifest_file);

      Object.keys(expected_manifest).forEach(function(key) {
        var expected_value = expected_manifest[key];
        var actual_value = manifest[key];

        assert(actual_value, expected_value);
      });
    }).then(function() {
      var promises = [];

      assert.equal(Object.keys(lockfile.sources).length, 3);

      Object.keys(lockfile.sources).forEach(function(relative_path) {
        var full_path = path.resolve(path.join(config.base_path, relative_path));
        var sourceURI = lockfile.sources[relative_path];

        promises.push(checkHostMatchesFilesystem(sourceURI, full_path));
      });

      return Promise.all(promises);
    });
  });

});
