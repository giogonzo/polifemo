var fs = require('fs');

function writeJSON(json, file) {
  fs.writeFileSync(file, JSON.stringify(json), { encoding: 'utf-8' });
}

module.exports = writeJSON;