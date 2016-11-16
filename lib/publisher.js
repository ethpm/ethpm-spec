var Manifest = require("./manifest");

function Publisher(registry, host) {
  this.registry = registry;
  this.host = host;
};

Publisher.prototype.publish = function(config) {
  var self = this;

  var lockfile = {};
  var lockfileURI;
  var manifest;

  // Place this in a promise so errors will be sent down the promise chain.
  return new Promise(function(accept, reject) {
    try {
      manifest = Manifest.read(config.manifest_file);
    } catch (e) {
      return reject(e);
    }

    lockfile.version = manifest.version;
    lockfile.manifest_version = manifest.manifest_version;

    accept();
  }).then(function() {
    return self.host.putFile(config.manifest_file);
  }).then(function(manifest_uri) {
    lockfile.package_manifest = manifest_uri;

    return self.host.putContents(JSON.stringify(lockfile));
  }).then(function(lockfileURI) {
    return self.registry.register(manifest.package_name, manifest.version, lockfileURI);
  });
}



module.exports = Publisher;
