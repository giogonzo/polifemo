var t = require('tcomb');
var createResponsePlayer = require('./createResponsePlayer');
var NAME = 'polifemo:GenericPlayer';
var debug = require('debug')(NAME);
var domain = require('./domain');

function createGenericPlayer(fixtures, delay) {
  t.assert(t.list(domain.Fixture).is(fixtures), 'bad fixtures');
  t.assert(t.maybe(t.Number).is(delay), 'bad delay');

  var players = {};
  var currentId = null;

  fixtures.forEach(function (fixture) {
    var id = fixture.id;
    debug('INFO: new player for test id `' + fixture.id + '`');
    if (players.hasOwnProperty(id)) {
      throw new Error(NAME + ': Duplicated test id `' + id + '`');
    }
    players[id] = createResponsePlayer(fixture.responses, delay);
  });

  function getFixtures() {
    return fixtures;
  }

  function getDelay() {
    return delay;
  }

  function getId() {
    return currentId;
  }

  function getIds() {
    return Object.keys(players);
  }

  function setId(newId) {
    if (!players.hasOwnProperty(newId)) {
      throw new Error(NAME + ': you are trying to set an invalid test id: `' + newId + '`');
    }
    currentId = newId;
    debug('INFO: new current test id is now `' + newId + '`');
  }

  function getErrors() {
    return players[currentId].getErrors();
  }

  function get(url) {
    if (!currentId) {
      throw new Error(NAME + ': you may not call get(), there is no current test id');
    }
    var player = players[currentId];
    if (!player) {
      throw new Error(NAME + ': there is no player for the current test id `' + currentId + '`');
    }
    return player.get(url);
  }

  return {
    getFixtures: getFixtures,
    getDelay: getDelay,
    getIds: getIds,
    getId: getId,
    setId: setId,
    get: get,
    getErrors: getErrors
  };
}

module.exports = createGenericPlayer;