var promisify = require("promisify-node");
var fs = promisify(require("fs-extra"));
var path = require("path");
var Manifest = require("./manifest");

function Installer(config, destination) {
  this.config = config;
  this.registry = config.registry;
  this.host = config.host;
  this.destination = destination;
};

Installer.prototype.installDependencies = function() {
  var self = this;

  // Start a promise chain to ensure errors are caught.
  return new Promise(function(accept, reject) {
    accept();
  }).then(function() {

    // TODO: Do this recursively.
    var promises = [];
    var manifest = Manifest.read(self.config.manifest_file);

    Object.keys(manifest.dependencies).forEach(function(package_name) {
      var version_range = manifest.dependencies[package_name];
      promises.push(self.installPackage(package_name, version_range));
    });

    return Promise.all(promises);
  });
};

Installer.prototype.installPackage = function(package_name, version_range) {
  var self = this;
  var lockfile;
  var version;

  return self.registry.resolveVersion(package_name, version_range).then(function(v) {
    version = v;
    return self.registry.getLockfileURI(package_name, version_range);
  }).then(function(lockfileURI) {
    return self.host.get(lockfileURI);
  }).then(function(data) {
    lockfile = JSON.parse(data);

    var folder_name = package_name + "-" + version;
    var package_location = path.resolve(path.join(self.destination, folder_name));
    var manifest_location = path.resolve(path.join(package_location, self.config.default_manifest_filename));

    var file_promises = [];

    // Add the sources
    Object.keys(lockfile.sources).forEach(function(relative_source_path) {
      var source_path = path.resolve(path.join(package_location, relative_source_path));
      var uri = lockfile.sources[relative_source_path];

      file_promises.push(self.saveURI(uri, source_path));
    });

    // Add the manifest
    file_promises.push(self.saveURI(lockfile.package_manifest, manifest_location));

    return Promise.all(file_promises);
  });
};

Installer.prototype.saveURI = function(uri, destination_path) {
  return this.host.get(uri).then(function(contents) {
    return fs.outputFile(destination_path, contents);
  });
};

module.exports = Installer;
