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
  // Returns a Promise.
  publishPackage: function(config) {
    var publisher = new Publisher(config.registry, config.host);
    return publisher.publish(config);
  }
};

module.exports = EPM;
