var domain = require('../lib/domain');
var createExpressPlayer = require('../lib/createExpressPlayer');
var fixtures = [
  {
    id: 'myid',
    responses: [
      {
        "url": "/api/user",
        "payload": {
          "email": "user@domain.com"
        },
        "delay": 305.5489999242127
      },
      {
        "url": "/api/orders",
        "payload": [
          {
            "id": "ord1",
            "product": "iPad",
            "amount": 400
          }
        ],
        "delay": 604.124000063166
      }
    ]
  }
];
var app = createExpressPlayer(fixtures.map(domain.Fixture), 0);

app.player.setId('myid');

var PORT = 5002;
app.listen(PORT, function () {
  console.log('express server listening on http://localhost:%s/', PORT); // eslint-disable-line no-console
});

// setTimeout(function () {
//   app.server.setId('/login')
// }, 3000)