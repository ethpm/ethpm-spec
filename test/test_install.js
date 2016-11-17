var TestHelper = require("./lib/testhelper");
var path = require("path");
var EPM = require('../index.js');
var dir = require("node-dir");
var assert = require("assert");
var fs = require("fs-extra");

describe("Install", function() {
  var helper = TestHelper.setup({
    packages: [
      "owned-example",
      "eth-usd-oracle-example"
    ],
    compile: [
      "owned-example"
    ]
  });

  var owned;
  var eth_usd;

  before("setup variables once previous steps are finished", function() {
    owned = helper.packages["owned-example"];
    eth_usd = helper.packages["eth-usd-oracle-example"];
  });

  before("published owned for use as a dependency", function() {
    this.timeout(10000);

    return EPM.publishPackage(owned.config, owned.contract_metadata);
  });

  it("installs eth-usd correctly with owned as a dependency", function() {
    var dependency_path = path.resolve(path.join(eth_usd.config.installed_packages_directory, "owned-1.0.0"));

    return EPM.installPackage(eth_usd.config).then(function() {
      return new Promise(function(accept, reject) {
        dir.files(dependency_path, function(err, files) {
          if (err) return reject(err);
          accept(files);
        });
      });
    }).then(function(files) {
      var assertions = [];

      assert.equal(files.length, 4); // three contracts and their epm.json

      files.forEach(function(file) {
        var relative_file_path = path.relative(dependency_path, file);
        var expected_example_path = path.join(owned.config.working_directory, relative_file_path);

        assertions.push(helper.assertFilesMatch(expected_example_path, file));
      });

      return Promise.all(assertions);
    });
  });


});
