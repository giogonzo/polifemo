var path = require('path');
var createExpressPlayerFromConfig = require('../lib/createExpressPlayerFromConfig');

var fixtureDir = path.join(__dirname, './readonly_fixtures');
var app = createExpressPlayerFromConfig(fixtureDir, 'http://localhost:8080');

app.player.setId('/orders');

var PORT = 5002;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT); // eslint-disable-line no-console
});