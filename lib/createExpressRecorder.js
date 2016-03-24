var t = require('tcomb');
var express = require('express');
var proxy = require('express-http-proxy');
var path = require('path');
var writeJSON = require('./writeJSON');
var NAME = 'polifemo:ExpressRecorder';
var debug = require('debug')(NAME);
var addCORS = require('./addCORS');

var GET_CONFIG_ROUTE = '/__config__';
var GET_ID_ROUTE = '/__id__';
var CHANGE_ID_ROUTE = '/__id__/:id';
var DUMP_CONFIG_ROUTE = '/__config__';

function isRecordable(req) {
  return req.method === 'GET'
    && req.url.indexOf('/__id__') === -1
    && req.url.indexOf('/__config__') === -1
    && req.url.indexOf('sockjs-node') === -1;
}

function createExpressRecorder(target, fixtureDir) {
  t.assert(t.String.is(target), 'bad target');
  t.assert(t.String.is(fixtureDir), 'bad fixtureDir');

  var app = addCORS(express());

  debug('INFO: new recorder for target `' + target + '`');
  debug('INFO: fixtureDir `' + fixtureDir + '`');

  var config = {
    createdAt: new Date().toISOString(),
    tests: {}
  };
  var currentId = null;
  var start = null;

  function setId(newId) {
    if (config.tests.hasOwnProperty(newId)) {
      throw new Error(NAME + ': duplicated test id `' + currentId + '`');
    }
    currentId = newId;
    config.tests[currentId] = [];
    debug('INFO: new current test id is now `' + newId + '`');
  }

  function dump(fixtureDir, prettyPrint) {
    debug('INFO: dumping config');
    var configPath = path.join(fixtureDir, 'config.json');
    writeJSON(config, configPath, prettyPrint);
    var pathsPath = path.join(fixtureDir, 'paths.json');
    var paths = Object.keys(config.tests);
    writeJSON(paths, pathsPath, prettyPrint);
  }

  app.use(proxy(target, {
    filter: function(req) {
      debug('processing `' + req.method + ' ' + req.url + '`');
      start = new Date().getTime();
      var skip = req.url.indexOf('/__id__') === -1
        && req.url.indexOf('/__config__') === -1;
      return skip;
    },
    intercept: function(proxyRes, data, req, res, next) {
      if (isRecordable(req)) {
        if (data.length) {
          debug('INFO: recording `' + req.url + '`');
          if (!currentId) {
            throw new Error(NAME + ': you may not record, there is no current test id');
          }
          var text = data.toString('utf8');
          var payload = JSON.parse(text);
          config.tests[currentId] = config.tests[currentId] || [];
          config.tests[currentId].push({
            url: req.url,
            payload: payload,
            delay: new Date().getTime() - start
          });
          next(null, data);
        } else {
          debug('WARNING: cached `' + req.url + '`');
          next(null, data);
        }
      } else {
        debug('ignoring `' + req.method + ' ' + req.url + '`');
        next(null, data);
      }
    },
    decorateRequest: function (req) {
      // faccio in modo che il server non risponda mai con un 304 not modified
      // altrimenti il body della risposta non contiene nulla e non posso registrare
      // il payload
      req.headers['Cache-Control'] = 'no-cache';
      delete req.headers['accept-encoding'];
      return req;
    }
  }));

  debug('INFO: mounting system `GET ' + GET_ID_ROUTE + '` route');
  app.get(GET_ID_ROUTE, function (req, res) {
    res.status(200).json({ id: currentId });
  });

  debug('INFO: mounting system `POST ' + CHANGE_ID_ROUTE + '` route');
  app.post(CHANGE_ID_ROUTE, function (req, res) {
    setId(req.params.id);
    res.status(200).json({});
  });

  debug('INFO: mounting system `GET ' + GET_CONFIG_ROUTE + '` route');
  app.get(GET_CONFIG_ROUTE, function (req, res) {
    res.status(200).json(config);
  });

  debug('INFO: mounting system `POST ' + DUMP_CONFIG_ROUTE + '` route');
  app.post(DUMP_CONFIG_ROUTE, function (req, res) {
    dump(fixtureDir);
    res.status(404).json({ok: true});
  });

  // debugging
  app.setId = setId;
  app.dump = dump;

  return app;
}

module.exports = createExpressRecorder;