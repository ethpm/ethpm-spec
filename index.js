var parse = require('json-schema-to-markdown')
const fs = require('fs');
const path = require('path');

fs.readdir("./spec/", (err, files) => {
  files.forEach(file => {
    let jsonFile = fs.readFileSync(path.join('spec',file), "utf8");
    let json = JSON.parse(jsonFile);
    let filename = file.split('.')[0] + '-s.md';
    let md = parse(json);
    fs.writeFileSync(filename, md);
  });
})
