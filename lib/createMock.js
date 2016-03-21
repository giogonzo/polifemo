/* eslint-disable */

/*

  Data una lista di response:

  {
    url: string,
    order: integer,
    payload: any,
    delay: number
  }

  restituisce un mock:

    {
      get(url): Promise<Payload>,
      getErrors(): Array<Error>
    }

*/

var debug = require('debug')('polifemo:mock');

function sortResponses(gets) {
  Object.keys(gets).forEach(function (url) {
    gets[url].sort(function (a, b) {
      return a.order <= b.order;
    });
  });
}

function createMock(responses) {
  var gets = {};
  var errors = [];

  responses.forEach(function (response) {
    var url = response.url;
    if (!gets.hasOwnProperty(url)) {
      debug('new mock for url `' + url + '`');
      gets[url] = [];
    }
    gets[url].push({
      order: response.order,
      payload: response.payload,
      delay: response.delay
    });
  })

  sortResponses(gets);

  function get(url) {
    var responses = gets[url];
    if (responses) {
      if (responses.length > 0) {
        debug('legit request to `' + url + '`');
        var response = responses.shift();
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve({
              data: response.payload
            });
          }, response.delay);
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

  function getErrors() {
    var missingErrors = [];
    // controllo che per ogni url siano state esaurite tutte le response
    Object.keys(gets).forEach(function (url) {
      var len = gets[url].length;
      if (len > 0) {
        missingErrors.push('Missing ' + len + ' request(s) for `' + url + '`');
      }
    });
    return errors.concat(missingErrors);
  }

  return {
    get: get,
    getErrors: getErrors
  }
}

module.exports = createMock;