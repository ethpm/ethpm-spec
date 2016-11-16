var requireNoCache = require("./require-nocache");
var V1 = require("./manifests/v1");

var Manifest = {
  read: function(file) {
    var json = requireNoCache(file);
    var interpreter = V1;

    // This could be slightly more clever by tacking on a "V" onto the version and
    // requiring that file (and catching the error if the require fails). Will do that
    // if this gets too unruly.
    switch (json.manifest_version) {
      case 1:
        interpreter = V1;
        break;
      default:
        if (json.manifest_version == null) {
          // do nothing; use default
        } else {
          throw new Error("Unknown manifest version " + json.manifest_version);
        }
        break;
    }

    interpreter.validate(json);
    interpreter.normalize(json);

    return json;
  }
};

module.exports = Manifest;
