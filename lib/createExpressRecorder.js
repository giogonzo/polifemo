var t = require('tcomb');
var express = require('express');
var bodyParser = require('body-parser');
var proxy = require('express-http-proxy');
var path = require('path');
var writeJSON = require('./writeJSON');
var NAME = 'polifemo:ExpressRecorder';
var debug = require('debug')(NAME);
var addCORS = require('./addCORS');
var fs = require('fs');

var SET_ID_ROUTE = '/__id__/:id';
var SAVE_CONFIG_ROUTE = '/__config__';
var SAVE_SCREENSHOT_ROUTE = '/__screenshot__';

function isRecordable(req) {
  return req.method === 'GET'
    && req.url.indexOf('favicon.ico') === -1
    && req.url.indexOf('sockjs-node') === -1;
}

function createExpressRecorder(target, fixtureDir) {
  t.assert(t.String.is(target), 'bad target');
  t.assert(t.String.is(fixtureDir), 'bad fixtureDir');

  var app = addCORS(express());
  app.use(bodyParser.json());

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

  function saveConfig(fixtureDir, prettyPrint) {
    debug('INFO: dumping config');
    var configPath = path.join(fixtureDir, 'config.json');
    writeJSON(config, configPath, prettyPrint);
    var pathsPath = path.join(fixtureDir, 'index.json');
    var paths = Object.keys(config.tests);
    writeJSON(paths, pathsPath, true);
  }

  var imageCounter = 0;
  function saveScreenshot(fixtureDir, image) {
    var imagePath = path.join(fixtureDir, 'images', imageCounter + '.txt');
    imageCounter = imageCounter + 1;
    fs.writeFileSync(imagePath, image);
  }

  app.use(proxy(target, {
    filter: function(req) {
      debug('processing `' + req.method + ' ' + req.url + '`');
      start = new Date().getTime();
      var skip = req.url.indexOf('/__id__') === -1
        && req.url.indexOf(SAVE_CONFIG_ROUTE) === -1
        && req.url.indexOf(SAVE_SCREENSHOT_ROUTE) === -1;
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
            status: res.statusCode,
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

  debug('INFO: mounting system `POST ' + SET_ID_ROUTE + '` route');
  app.post(SET_ID_ROUTE, function (req, res) {
    setId(req.params.id);
    res.status(200).json({});
  });

  debug('INFO: mounting system `POST ' + SAVE_CONFIG_ROUTE + '` route');
  app.post(SAVE_CONFIG_ROUTE, function (req, res) {
    saveConfig(fixtureDir);
    res.status(200).json({});
  });

  debug('INFO: mounting system `POST ' + SAVE_SCREENSHOT_ROUTE + '` route');
  app.post(SAVE_SCREENSHOT_ROUTE, function (req, res) {
    debug('INFO: saving screenshot...');
    saveScreenshot(fixtureDir, req.body.image);
    res.status(200).json({});
  });

  // debugging
  app.setId = setId;
  app.saveConfig = saveConfig;
  app.saveScreenshot = saveScreenshot;

  return app;
}

module.exports = createExpressRecorder;