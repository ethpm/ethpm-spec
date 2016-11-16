var Publisher = require("./lib/publisher");

var EPM = {
  // Install a whole package dependencies given a config object that represents a manifest
  installPackageDependencies: function(config) {},

  // Download a specific version of a package given a config object (which includes a list of
  // registires) and a package name and version.
  downloadPackage: function(config, name, version) {},

  // List packages given a config that represents a manifest file
  listInstalledPackages: function(config) {},

  createLockfile: function(config) {
    return new Promise(function(resolve, reject) {

    });
  },

  // Publish a package given a config object that represents a specific manifest file, host and registry.
  // Contract metadata is also required for all contracts listed in the `contracts` portion of the manifest.
  // Returns a Promise.
  publishPackage: function(config, contract_metadata) {
    var publisher = new Publisher(config.registry, config.host, contract_metadata);
    return publisher.publish(config);
  }
};

module.exports = EPM;
