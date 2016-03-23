var path = require('path');
var readJSON = require('../lib/readJSON');
var getResponsesFromHAR = require('../lib/getResponsesFromHAR');
// var har = readJSON(path.join(__dirname, './readonly_fixtures/slash-worklists.har'));
var har = readJSON(path.join(__dirname, './readonly_fixtures/1.har'));
var responses = getResponsesFromHAR(har, 'http://localhost:5000');
console.log(JSON.stringify(responses, null, 2)); // eslint-disable-line no-console
