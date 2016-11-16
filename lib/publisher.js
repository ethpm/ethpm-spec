var Manifest = require("./manifest");
var Sources = require("./sources");
var path = require("path");

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

    accept();
  }).then(function() {
    return self.host.putFile(config.manifest_file);
  }).then(function(manifest_uri) {
    lockfile.version = manifest.version;
    lockfile.manifest_version = manifest.manifest_version;
    lockfile.package_manifest = manifest_uri;

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
