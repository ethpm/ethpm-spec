var ipfsd = require('ipfsd-ctl')
var Config = require("../lib/config");
var IPFSHost = require("../lib/hosts/ipfshost");
var DumbRegistry = require("../lib/registries/dumbregistry");
var EPM = require('../index.js');
var path = require("path");
var assert = require("assert");

describe("Publishing", function() {
  var ipfs_server;
  var host;
  var registry;
  var config;

  before("set up ipfs server", function(done) {
    this.timeout(5000);

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

  before("make the publish request", function() {
    return EPM.publishPackage(config);
  });

  it("published the correct lockfile", function() {
    return registry.getLockfileURI("owned", "1.0.0").then(function(lockfileURI) {
      return host.get(lockfileURI);
    }).then(function(data) {
      var lockfile = JSON.parse(data);

      assert.equal(lockfile.version, "1.0.0");

      return host.get(lockfile.package_manifest);
    }).then(function(data) {
      var manifest = JSON.parse(data);
      var expected_manifest = require(config.manifest_file);

      Object.keys(expected_manifest).forEach(function(key) {
        var expected_value = expected_manifest[key];
        var actual_value = manifest[key];

        assert(actual_value, expected_value);
      })
    });
  });

});
