var URL = require("url");

function URIResolver(config) {
  this.config = config;
};

URIResolver.resolve = function(uri_string, callback) {
  var url = URL.parse(uri_string);

  switch (url.protocol) {
    case "ipfs":
      this.resolveIPFS(url, callback);
      break;
    default:
      return callback(new Error("Unable to handle URI protocol '" + url.protocol + "'"));
  }
};

URIResolver.resolveIPFS = function(url, callback) {
  var base = url.hostname;
  var pathname = "" + url.pathname;

  var content = "";

  config.ipfs.files.get(multihashStr, function (err, stream) {
    if (err) return callback(err);

    stream.on('data', function(file) {
      // write the file's path and contents to standard out
      console.log(file.path)
      file.content.pipe(process.stdout)

      callback(null, "");
    })
  });

};

module.exports = URIResolver;
