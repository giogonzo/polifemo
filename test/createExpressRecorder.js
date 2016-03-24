var path = require('path');
var createExpressRecorder = require('../lib/createExpressRecorder');
var target = '10.0.0.144:8080'; // escalapio
// var target = 'localhost:4000'; // test
var fixtureDir = path.join(__dirname, './fixtures');
var app = createExpressRecorder(target, fixtureDir);

// app.setId('/worklists');

// setTimeout(function () {
//   app.dump(fixtureDir, true);
// }, 10000);

var PORT = 5000;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT); // eslint-disable-line no-console
});
