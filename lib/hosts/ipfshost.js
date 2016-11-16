var ipfsAPI = require('ipfs-api')
var Readable = require('stream').Readable;
var URL = require("url");

function IPFSHost(host, port) {
  this.ipfs = ipfsAPI(host, port);
}

IPFSHost.prototype.putContents = function(contents) {
  var self = this;

  return new Promise(function(accept, reject) {
    var stream = new Readable();
    stream.push(contents);
    stream.push(null);

    self.ipfs.util.addFromStream(stream, function(err, result) {
      if (err) return reject(err);
      accept("ipfs://" + result[0].hash);
    })
  });
}

IPFSHost.prototype.putFile = function(file) {
  var self = this;
  return new Promise(function(accept, reject) {
    self.ipfs.util.addFromFs(file, {recursive: false}, function(err, result) {
      if (err) return reject(err);
      accept("ipfs://" + result[0].hash);
    });
  })
};

IPFSHost.prototype.get = function(uri) {
  var self = this;
  return new Promise(function(accept, reject) {
    if (uri.indexOf("ipfs://") != 0) {
      return reject(new Error("Don't know how to resolve URI " + uri));
    }

    var hash = uri.replace("ipfs://", "");
    var multihash = hash;

    self.ipfs.files.get(multihash, function(err, stream) {
      if (err) return reject(err);

      stream.on('data', function(file) {
        file.contents = "";

        // write the file's path and contents to standard out
        file.content.on('data', function(chunk) {
          file.contents += chunk.toString();
        });

        file.content.on('end', function() {
          accept(file.contents);
        });
      });
    });
  });


};

module.exports = IPFSHost;
