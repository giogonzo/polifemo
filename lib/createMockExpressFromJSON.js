/* eslint-disable */

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

  restituisce un'applicazione express compatibile con createMockExpress()

*/

var fs = require('fs');
var path = require('path');
var getResponsesFromHAR = require('./getResponsesFromHAR');
var createMockExpress = require('./createMockExpress');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file).toString());
}

function createMockExpressFromJSON(configPath, apiRoot) {
  var catalog = readJSON(path.join(configPath, 'fixtures.json'));
  var fixtures = catalog.map(function (fixture) {
    var har = readJSON(path.join(configPath, fixture.file));
    return {
      id: fixture.id,
      responses: getResponsesFromHAR(har, apiRoot)
    };
  });
  return createMockExpress(fixtures);
}

module.exports = createMockExpressFromJSON;