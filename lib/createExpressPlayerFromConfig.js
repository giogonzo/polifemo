var t = require('tcomb');
var getResponsesFromHAR = require('./getResponsesFromHAR');
var readJSON = require('./readJSON');
var path = require('path');
var createExpressPlayer = require('./createExpressPlayer');
var domain = require('./domain');

var CONFIG_FILENAME = 'config.json';

function getFixtures(tests, fixtureDir, apiRoot) {
  t.assert(t.String.is(fixtureDir), 'missing fixtureDir');
  t.assert(t.String.is(apiRoot), 'missing apiRoot');
  return Object.keys(tests).map(function (id) {
    var har = readJSON(path.join(fixtureDir, tests[id].server.file));
    return domain.Fixture({
      id: id,
      responses: getResponsesFromHAR(har, apiRoot)
    });
  });
}

function createExpressPlayerFromConfig(fixtureDir, apiRoot) {
  var json = readJSON(path.join(fixtureDir, CONFIG_FILENAME));
  var config = new domain.Config(json);
  var fixtures = getFixtures(config.tests, fixtureDir, apiRoot);
  return createExpressPlayer(fixtures);
}

module.exports = createExpressPlayerFromConfig;