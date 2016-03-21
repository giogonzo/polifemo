/* eslint-disable */

/*

  Data una lista di fixture

  {
    id: string,
    responses: Array<Response>
  }

  restituisce un'applicazione express con i seguenti endpoint:

  1) GET /__id__

  Restituisce l'id del test corrente

  2) POST /__id__/:id

  Imposta l'id del test corrente

  3) GET /__errors__

  Restituisce la lista degli errori per il test corrente

  4) GET <apiRoot>/*

  Monta gli endpoint mock

*/

var express = require('express');
var createMock = require('./createMock');
var debug = require('debug')('polifemo:express');

function createMockExpress(fixtures, apiRoot) {
  apiRoot = apiRoot || '';
  var mocks = {};
  var id = fixtures[0].id;
  fixtures.forEach(function (fixture) {
    debug('new mock for id ' + fixture.id);
    mocks[fixture.id] = createMock(fixture.responses);
  });
  var app = express();
  app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
    next();
  });
  app.get('/__id__', function (req, res) {
    res.status(200).json({ id: id });
  })
  app.post('/__id__/:id', function (req, res) {
    id = req.params.id;
    debug('new current test id ' + id)
    res.status(200).json({});
  })
  app.get('/__errors__', function (req, res) {
    res.status(200).json(mocks[id].getErrors())
  })
  app.get(apiRoot + '/*', function (req, res) {
    var url = req.url.replace(apiRoot, '');
    var get = mocks[id].get(url);
    if (get) {
      get.then(function (payload) {
        res.status(200).json(payload);
      });
    } else {
      res.status(404).end();
    }
  })
  debug('current test id ' + id)
  return app;
}

module.exports = createMockExpress;