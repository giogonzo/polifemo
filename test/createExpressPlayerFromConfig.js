/* eslint-disable */
var path = require('path');
var createExpressPlayerFromConfig = require('../lib/createExpressPlayerFromConfig');

var app = createExpressPlayerFromConfig(path.join(__dirname, '../fixtures'), 'http://localhost:5000');

var PORT = 4000;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT)
});