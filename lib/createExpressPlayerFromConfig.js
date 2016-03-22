/*

  Data una configurazione:

  [
    {
      "id": "/orders",
      "file": "1.har"
    },
    {
      "id": "/login",
      "file": "2.har"
    }
  ]

  restituisce un'applicazione express compatibile con createExpressPlayer()

*/

var fs = require('fs');
var path = require('path');
var getResponsesFromHAR = require('./getResponsesFromHAR');
var createExpressPlayer = require('./createExpressPlayer');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file).toString());
}

function createExpressPlayerFromConfig(configPath, apiRoot) {
  var catalog = readJSON(path.join(configPath, 'config.json'));
  var fixtures = catalog.map(function (fixture) {
    var har = readJSON(path.join(configPath, fixture.file));
    return {
      id: fixture.id,
      responses: getResponsesFromHAR(har, apiRoot)
    };
  });
  return createExpressPlayer(fixtures);
}

module.exports = createExpressPlayerFromConfig;