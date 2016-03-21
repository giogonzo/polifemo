/* eslint-disable */
var createMockExpress = require('../lib/createMockExpress');
var responses = require('./getResponsesFromHAR');
var app = createMockExpress([
  {
    id: 'myid',
    responses: responses
  }
]);

var PORT = 4000;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT)
});