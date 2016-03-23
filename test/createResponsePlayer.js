var createResponsePlayer = require('../lib/createResponsePlayer');
var getResponsesFromHAR = require('../lib/getResponsesFromHAR');
var readJSON = require('../lib/readJSON');
var domain = require('../lib/domain');
var t = require('tcomb');

var har = readJSON('./fixtures/slash-worklists.har');
var responses = t.list(domain.Response)(getResponsesFromHAR(har, 'http://localhost:8080'));
var player = createResponsePlayer(responses);
Promise.all([
  player.get('/worklists').then(console.log.bind(console)), // eslint-disable-line no-console,
  player.get('/users/me').then(console.log.bind(console)) // eslint-disable-line no-console
]).then(function () {
  console.log(player.getErrors()); // eslint-disable-line no-console
});
