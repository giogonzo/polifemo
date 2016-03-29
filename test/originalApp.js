var express = require('express');
var compression = require('compression');
var addCORS = require('../lib/addCORS');

var app = addCORS(express());

app.use(compression());

app.get('/api/orders', function (req, res) {
  setTimeout(function () {
    res.status(200).json([
      {
        id: 'ord1',
        product: 'iPad',
        amount: 400,
        updatedAt: new Date().toISOString()
      }
    ]);
  }, 600);
});

app.get('/api/user', function (req, res) {
  setTimeout(function () {
    res.status(200).json({ email: 'user@domain.com' });
  }, 300);
});

// catch 404 and forward to error handler
app.use(function(req, res) {
  res.status(404).json({error: 'not found'});
});

var PORT = 4000;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT); // eslint-disable-line no-console
});