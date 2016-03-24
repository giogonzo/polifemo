var fs = require('fs');

function writeJSON(json, file, prettyPrint) {
  var data = prettyPrint ? JSON.stringify(json, null, 2) : JSON.stringify(json);
  fs.writeFileSync(file, data, { encoding: 'utf-8' });
}

module.exports = writeJSON;