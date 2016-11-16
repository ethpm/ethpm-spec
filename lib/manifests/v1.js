var _ = require("lodash");

var V1 = {
  validate: function(json) {
    // TODO: throw errors for data that *must* be there, and validate correct
    // format of data that is there. Perhaps use json spec.
  },
  normalize: function(json) {
    // Add keys with default values if non-existent
    // (don't use this function for validation)
    var defaults = {
      authors: {},
      license: "",
      description: "",
      keywords: [],
      links: {},
      sources: [],
      contracts: [],
      dependencies: {}
    };

    json = _.merge(defaults, json);

    return json;
  }
};

module.exports = V1;
