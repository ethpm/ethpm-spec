var semver = require("semver");

function DumbRegistry() {
  this.packages = {};
};

DumbRegistry.prototype.getAllVersions = function(package_name, callback) {
  var self = this;
  return new Promise(function(accept, reject) {
    if (!self.packages[package_name]) {
      return accept([]);
    }
    accept(Object.keys(self.packages[package_name]).sort());
  });
}

DumbRegistry.prototype.resolveVersion = function(package_name, version_range) {
  return this.getAllVersions(package_name).then(function(versions) {
    // This can be optimized.
    var max = null;

    versions.forEach(function(version) {
      if (semver.satisfies(version, version_range)) {
        if (max == null || semver.gte(version, max)) {
          max = version;
        }
      }
    });

    return max;
  });
};

DumbRegistry.prototype.getLockfileURI = function(package_name, version_range, callback) {
  var self = this;
  return this.resolveVersion(package_name, version_range).then(function(version) {
    return self.packages[package_name][version];
  });
};

DumbRegistry.prototype.register = function(package_name, version, lockfileURI) {
  var self = this;
  return new Promise(function(accept, reject) {
    if (self.packages[package_name] && self.packages[package_name][version]) {
      return reject(new Error("Version " + version + " already exists for package " + package_name));
    }

    if (!self.packages[package_name]) {
      self.packages[package_name] = [];
    }

    self.packages[package_name][version] = lockfileURI;
    accept();
  });
};

module.exports = DumbRegistry;
