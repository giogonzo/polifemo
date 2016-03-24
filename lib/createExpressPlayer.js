var t = require('tcomb');
var express = require('express');
var createGenericPlayer = require('./createGenericPlayer');
var debug = require('debug')('polifemo:ExpressPlayer');
var addCORS = require('./addCORS');
var domain = require('./domain');

var blacklist = {
  '/favicon.ico': 1
};

function createExpressPlayer(fixtures, delay) {
  t.assert(t.list(domain.Fixture).is(fixtures), 'bad fixtures');
  t.assert(t.maybe(t.Number).is(delay), 'bad delay');

  var app = addCORS(express());
  var player = createGenericPlayer(fixtures, delay);

  function log(message) {
    debug('[test id: `' + player.getId() + '`] ' + message);
  }

  var GET_FIXTURE_ROUTE = '/__fixtures__';
  debug('INFO: mounting system `GET ' + GET_FIXTURE_ROUTE + '` route');
  app.get(GET_FIXTURE_ROUTE, function (req, res) {
    res.status(200).json(player.getFixtures());
  });

  var GET_ID_ROUTE = '/__id__';
  debug('INFO: mounting system `GET ' + GET_ID_ROUTE + '` route');
  app.get(GET_ID_ROUTE, function (req, res) {
    res.status(200).json({ id: player.getId() });
  });

  var POST_ID_ROUTE = '/__id__/:id';
  debug('INFO: mounting system `POST ' + POST_ID_ROUTE + '` route');
  app.post(POST_ID_ROUTE, function (req, res) {
    player.setId(req.params.id);
    res.status(200).json({});
  });

  var ERRORS_ROUTE = '/__errors__/:id?';
  debug('INFO: mounting system `GET ' + ERRORS_ROUTE + '` route');
  app.get(ERRORS_ROUTE, function (req, res) {
    res.status(200).json(player.getErrors(req.params.id));
  });

  debug('mounting endpoints on `/*`');
  app.get('/*', function (req, res) {
    var url = req.url;
    if (!blacklist.hasOwnProperty(url)) {
      var get = player.get(url);
      if (get) {
        log('`GET ' + url + '`');
        get.then(function (payload) {
          res.status(200).json(payload);
        });
      } else {
        log('additional request to `GET ' + url + '`');
        res.status(404).end();
      }
    } else {
      log('INFO: blacklisted url `GET ' + url + '` requested');
      res.status(404).end();
    }
  });

  // debugging
  app.player = player;

  return app;
}

module.exports = createExpressPlayer;