var createExpressPlayer = require('./createExpressPlayer');
var domain = require('./domain');

function createExpressPlayerFromConfig(config, delay) {
  config = new domain.Config(config);
  var fixtures = Object.keys(config.tests).map(function (id) {
    return domain.Fixture({
      id: id,
      responses: config.tests[id]
    });
  });
  return createExpressPlayer(fixtures, delay);
}

module.exports = createExpressPlayerFromConfig;