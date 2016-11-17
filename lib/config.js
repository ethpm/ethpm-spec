var fs = require("fs");
var requireNoCache = require("./require-nocache");
var _ = require("lodash");
var path = require("path");

function Config(working_directory, manifest_file) {
  var self = this;

  this._values = {};

  var props = {
    working_directory: function() {
      return working_directory || process.cwd();
    },

    contracts_directory: function() {
      return path.resolve(path.join(self.working_directory, "contracts"));
    },

    manifest_file: function() {
      return manifest_file || path.resolve(path.join(self.working_directory, self.default_manifest_filename))
    },

    base_path: function() {
      return path.dirname(self.manifest_file);
    },

    // Configuration options that rely on other options.
    installed_packages_directory: function() {
      return path.join(self.working_directory, "installed_contracts");
    },

    default_manifest_filename: function() {
      return "epm.json";
    }
  };

  Object.keys(props).forEach(function(prop) {
    self.addProp(prop, props[prop]);
  });
};

Config.prototype.addProp = function(key, obj) {
  Object.defineProperty(this, key, {
    get: obj.get || function() {
      return this._values[key] || obj();
    },
    set: obj.set || function(val) {
      this._values[key] = val;
    },
    configurable: true,
    enumerable: true
  });
};

Config.prototype.with = function(obj) {
  return _.extend(Config.default(), this, obj);
};

Config.prototype.merge = function(obj) {
  return _.extend(this, obj);
};

Config.default = function() {
  return new Config();
};

module.exports = Config;
