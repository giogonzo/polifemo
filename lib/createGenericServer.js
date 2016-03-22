var createGenericResponsePlayer = require('./createGenericResponsePlayer');
var NAME = 'polifemo:GenericServer';
var debug = require('debug')(NAME);

function createGenericServer(fixtures, delay) {
  var players = {};
  var id = fixtures[0].id;

  fixtures.forEach(function (fixture) {
    var id = fixture.id;
    debug('new response player for id `' + fixture.id + '`');
    if (players.hasOwnProperty(id)) {
      throw new Error(NAME + ': Duplicated fixture id `' + id + '`');
    }
    players[id] = createGenericResponsePlayer(fixture.responses, delay);
  });

  function getFixtures() {
    return fixtures;
  }

  function getId() {
    return id;
  }

  function checkId(id) {
    if (!players.hasOwnProperty(id)) {
      throw new Error(NAME + ': Unknown id `' + id + '`');
    }
  }

  function setId(newId) {
    checkId(newId);
    id = newId;
    players[id].resetErrors();
    debug('new current test id `' + newId + '`');
  }

  function getErrors(id) {
    id = id || getId();
    checkId(id);
    return players[id].getErrors();
  }

  function get(url) {
    return players[getId()].get(url);
  }

  debug('current test id `' + id + '`');

  return {
    getFixtures: getFixtures,
    getId: getId,
    setId: setId,
    get: get,
    getErrors: getErrors
  };
}

module.exports = createGenericServer;