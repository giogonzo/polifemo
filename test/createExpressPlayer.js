/* eslint-disable */
var createExpressPlayer = require('../lib/createExpressPlayer');
var responses = require('./getResponsesFromHAR');
var app = createExpressPlayer([
  {
    id: '/orders',
    responses: responses
  },
  {
    id: '/login',
    responses: []
  }
], 0);

var PORT = 4000;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT)
});

// setTimeout(function () {
//   app.server.setId('/login')
// }, 3000)