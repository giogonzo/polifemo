var debug = require('debug')('polifemo:GenericResponsePlayer');

function getDelay(delay, override) {
  return typeof override === 'number' ? override : delay;
}

function createGenericResponsePlayer(responses, delay) {
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
      order: response.order,
      payload: response.payload,
      delay: response.delay
    });
  });

  // mi assicuro che le risposte siano ordinate anche se
  // provenendo da un file har lo dovrebbero già essere
  Object.keys(gets).forEach(function (url) {
    gets[url].sort(function (a, b) {
      return a.order <= b.order;
    });
  });

  // funzione di mock che sostituisce la vera GET
  function get(url) {
    var responses = gets[url];
    if (responses) {
      if (responses.length > 0) {
        debug('Ok: request to `' + url + '`');
        var response = responses.shift();
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve(response.payload);
          }, getDelay(response.delay, delay)); // se specificato, override del delay
        });
      } else {
        var additionalMessage = 'Error: additional request to `' + url + '`';
        debug(additionalMessage);
        errors.push(additionalMessage);
      }
    } else {
      var unknownMessage = 'Error: unknown request to `' + url + '`';
      debug(unknownMessage);
      errors.push(unknownMessage);
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
        missingErrors.push('Error: missing ' + len + ' request(s) for `' + url + '`');
      }
    });
    return errors.concat(missingErrors);
  }

  function resetErrors() {
    debug('resetting errors');
    errors = [];
  }

  return {
    get: get,
    getErrors: getErrors,
    resetErrors: resetErrors
  };
}

module.exports = createGenericResponsePlayer;