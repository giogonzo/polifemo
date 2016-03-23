var express = require('express');

var app = express();

// CORS
app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
  next();
});

app.get('/api/orders', function (req, res) {
  setTimeout(function () {
    res.status(200).json([
      {
        id: 'ord1',
        product: 'iPad',
        amount: 400
      }
    ]);
  }, 600);
});

app.get('/api/user', function (req, res) {
  setTimeout(function () {
    res.status(200).json({ email: 'user@domain.com' });
  }, 300);
});

var PORT = 4000;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT); // eslint-disable-line no-console
});