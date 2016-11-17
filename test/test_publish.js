var TestHelper = require('./lib/testhelper');
var EPM = require('../index.js');
var path = require("path");
var assert = require("assert");

describe("Publishing", function() {
  var helper = TestHelper.setup({
    packages: [
      "owned-example",
    ],
    compile: [
      "owned-example"
    ]
  });

  var owned;

  before("setup variables once previous steps are finished", function() {
    owned = helper.packages["owned-example"];
  });

  before("make the publish request", function() {
    this.timeout(10000);

    return EPM.publishPackage(owned.config, owned.contract_metadata);
  });

  it("published the correct lockfile, manifest file and source files", function() {
    var lockfile;

    return helper.registry.getLockfileURI("owned", "1.0.0").then(function(lockfileURI) {
      return helper.host.get(lockfileURI);
    }).then(function(data) {
      lockfile = JSON.parse(data);

      assert.equal(lockfile.version, "1.0.0");
      assert.equal(lockfile.manifest_version, 1);
      assert.deepEqual(lockfile.contracts, owned.contract_metadata);

      return helper.host.get(lockfile.package_manifest);
    }).then(function(data) {
      var manifest = JSON.parse(data);
      var expected_manifest = require(owned.config.manifest_file);

      Object.keys(expected_manifest).forEach(function(key) {
        var expected_value = expected_manifest[key];
        var actual_value = manifest[key];

        assert(actual_value, expected_value);
      });
    }).then(function() {
      var promises = [];

      assert.equal(Object.keys(lockfile.sources).length, 3);

      Object.keys(lockfile.sources).forEach(function(relative_path) {
        var full_path = path.resolve(path.join(owned.config.base_path, relative_path));
        var sourceURI = lockfile.sources[relative_path];

        promises.push(helper.assertHostMatchesFilesystem(sourceURI, full_path));
      });

      return Promise.all(promises);
    });
  });

});
