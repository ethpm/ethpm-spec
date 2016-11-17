var Installer = require("./lib/installer");
var Publisher = require("./lib/publisher");

var EPM = {
  installPackage: function(config) {
    var installer = new Installer(config, config.installed_packages_directory);
    return installer.installDependencies();
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
