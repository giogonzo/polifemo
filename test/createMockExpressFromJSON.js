/* eslint-disable */
var path = require('path');
var createMockExpressFromJSON = require('../lib/createMockExpressFromJSON');

var app = createMockExpressFromJSON(path.join(__dirname, '../fixtures'), 'http://localhost:5000');

var PORT = 4000;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT)
});