var dir = require("node-dir");
var fs = require("fs");
var each = require("async/each");
var path = require("path");

var Sources = {

  expand: function(list, basePath) {
    var paths = [];

    return new Promise(function(accept, reject) {
      each(list, function(source_path, finished) {
        source_path = path.resolve(path.join(basePath, source_path));
        fs.stat(source_path, function(err, stats) {
          if (err) return finished(err);

          // If it's a directory, recursively get all children and grandchildren
          // and add them to the list.
          if (stats.isDirectory()) {
            dir.files(source_path, function(err, files) {
              if (err) return finished(err);
              Array.prototype.push.apply(paths, files);
              finished();
            });
          } else if (stats.isFile()) {
            // If it's a file, just add it to the list.
            paths.push(source_path);
            finished();
          } else {
            // In the rare case it's neither a file nor directory, error.
            return finished(new Error("Unknown file type at path " + source_path));
          }
        });
      }, function(err) {
        if (err) return reject(err);
        accept(paths);
      });
    });
  }

};

module.exports = Sources;
