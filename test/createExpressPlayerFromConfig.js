var createExpressPlayerFromConfig = require('../lib/createExpressPlayerFromConfig');
var config = require('./fixtures/config.json');
var app = createExpressPlayerFromConfig(config);

app.player.setId('/worklists');

var PORT = 5000;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT); // eslint-disable-line no-console
});

// setTimeout(function () {
//   app.server.setId('/login')
// }, 3000)