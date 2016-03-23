var fs = require('fs');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file).toString());
}

module.exports = readJSON;