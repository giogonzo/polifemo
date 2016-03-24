var createGenericPlayer = require('./createGenericPlayer');
var domain = require('./domain');

function createGenericPlayerFromConfig(config, delay) {
  config = new domain.Config(config);
  var fixtures = Object.keys(config.tests).map(function (id) {
    return domain.Fixture({
      id: id,
      responses: config.tests[id]
    });
  });
  return createGenericPlayer(fixtures, delay);
}

module.exports = createGenericPlayerFromConfig;