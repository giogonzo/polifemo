var t = require('tcomb');
var debug = require('debug')('polifemo:ResponsePlayer');
var domain = require('./domain');

function getDelay(delay, override) {
  return typeof override === 'number' ? override : delay;
}

function createResponsePlayer(responses, delay) {
  t.assert(t.list(domain.Response).is(responses), 'bad responses');
  t.assert(t.maybe(t.Number).is(delay), 'bad delay');

  var gets = {};
  var errors = [];

  // censisco tutti gli url contenuti nelle response
  responses.forEach(function (response) {
    var url = response.url;
    if (!gets.hasOwnProperty(url)) {
      debug('new mock for `GET ' + url + '`');
      gets[url] = [];
    }
    gets[url].push({
      status: response.status,
      payload: response.payload,
      delay: response.delay
    });
  });

  // funzione di mock che sostituisce la vera GET
  function get(url) {
    var responses = gets[url];
    if (responses) {
      if (responses.length > 0) {
        debug('`GET ' + url + '`');
        var response = responses.shift();
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve({
              status: response.status,
              payload: response.payload
            });
          }, getDelay(response.delay, delay)); // se specificato, override del delay
        });
      } else {
        debug('additional request to `GET ' + url + '`');
        errors.push(domain.AdditionalRequestError({ url: url }));
      }
    } else {
      debug('unknown request to `GET ' + url + '`');
      errors.push(domain.UnknownRequestError({ url: url }));
    }
  }

  // restituisce la lista di errori accumulata durante l'esecuzione
  // gli errori relativi alla chiamate mancate sono calcolate al momento
  function getErrors() {
    var missingErrors = [];
    // controllo che per ogni url siano state esaurite tutte le response
    Object.keys(gets).forEach(function (url) {
      var len = gets[url].length;
      if (len > 0) {
        missingErrors.push(domain.MissingRequestError({ url: url, length: len }));
      }
    });
    return errors.concat(missingErrors);
  }

  return {
    get: get,
    getErrors: getErrors
  };
}

module.exports = createResponsePlayer;