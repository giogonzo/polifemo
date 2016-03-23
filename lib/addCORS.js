function addCORS(app) {
  app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
    next();
  });
  return app;
}

module.exports = addCORS;