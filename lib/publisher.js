var Manifest = require("./manifest");
var Sources = require("./sources");
var path = require("path");

function Publisher(registry, host, contract_metadata) {
  this.registry = registry;
  this.host = host;
  this.contract_metadata = contract_metadata || {};
};

Publisher.prototype.publish = function(config) {
  var self = this;

  var lockfile = {};
  var lockfileURI;
  var manifest;

  return new Promise(function(accept, reject) {
    // Place this in a promise so errors will be sent down the promise chain.
    manifest = Manifest.read(config.manifest_file);

    for (var i = 0; i < manifest.contracts.length; i++) {
      // TODO: I'm sure we can do more validation of contract metadata here.
      var contract_name = manifest.contracts[i];
      if (self.contract_metadata[contract_name] == null) {
        return reject(new Error("No metadata for contract '" + contract_name + "' but it is listed in the package manifest."));
      }
    }

    accept();
  }).then(function() {
    return self.host.putFile(config.manifest_file);
  }).then(function(manifest_uri) {
    lockfile.version = manifest.version;
    lockfile.manifest_version = manifest.manifest_version;
    lockfile.package_manifest = manifest_uri;
    lockfile.contracts = self.contract_metadata;

    return Sources.expand(manifest.sources, config.base_path);
  }).then(function(source_paths) {
    var promises = [];

    source_paths.forEach(function(source_path) {
      var promise = new Promise(function(accept, reject) {
        self.host.putFile(source_path).then(function(sourceURI) {
          var relative = "." + path.sep + path.relative(config.base_path, source_path);
          var obj = {};
          obj[relative] = sourceURI;
          accept(obj);
        }).catch(reject);
      });

      promises.push(promise);
    });

    return Promise.all(promises);
  }).then(function(source_objects) {

    lockfile.sources = source_objects.reduce(function(merged_obj, source_obj) {
      Object.keys(source_obj).forEach(function(key) {
        merged_obj[key] = source_obj[key];
      });
      return merged_obj;
    }, {});

    return self.host.putContents(JSON.stringify(lockfile));
  }).then(function(lockfileURI) {
    return self.registry.register(manifest.package_name, manifest.version, lockfileURI);
  });
}



module.exports = Publisher;
