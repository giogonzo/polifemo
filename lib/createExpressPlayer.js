var express = require('express');
var createGenericServer = require('./createGenericServer');
var debug = require('debug')('polifemo:ExpressServer');

var blacklist = {
  '/favicon.ico': 1
};

function createExpressPlayer(fixtures, delay) {
  var server = createGenericServer(fixtures, delay);
  var app = express();

  // CORS
  app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
    next();
  });

  app.get('/__id__', function (req, res) {
    res.status(200).json({ id: server.getId() });
  });

  app.get('/__fixtures__', function (req, res) {
    res.status(200).json(server.getFixtures());
  });

  app.post('/__id__/:id', function (req, res) {
    server.setId(req.params.id);
    res.status(200).json({});
  });

  app.get('/__errors__/:id?', function (req, res) {
    res.status(200).json(server.getErrors(req.params.id));
  });

  app.get('/*', function (req, res) {
    var url = req.url;
    if (!blacklist.hasOwnProperty(url)) {
      var get = server.get(url);
      if (get) {
        debug('`GET ' + url + '`');
        get.then(function (payload) {
          res.status(200).json(payload);
        });
      } else {
        debug('url not found `' + url + '`');
        res.status(404).end();
      }
    } else {
      res.status(404).end();
    }
  });

  app.server = server;
  return app;
}

module.exports = createExpressPlayer;