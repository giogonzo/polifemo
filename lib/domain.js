var t = require('tcomb');

var TestId = t.String;

var Client = t.struct({
  path: t.String
}, 'Client');

var Server = t.struct({
  file: t.String
}, 'Server');

var Test = t.struct({
  id: TestId,
  client: Client,
  server: t.maybe(Server),
  description: t.maybe(t.String),
  author: t.maybe(t.String)
}, 'Test');

var Config = t.struct({
  createdAt: t.maybe(t.String),
  tests: t.dict(TestId, Test)
}, 'Config');

var Response = t.struct({
  url: t.String,
  payload: t.Any,
  delay: t.Number
});

var Fixture = t.struct({
  id: TestId,
  responses: t.list(Response)
});

var AdditionalRequestError = t.struct({
  url: t.String
});

AdditionalRequestError.prototype.toJSON = function() {
  return {
    type: 'AdditionalRequestError',
    url: this.url
  };
};

var UnknownRequestError = t.struct({
  url: t.String
});

UnknownRequestError.prototype.toJSON = function() {
  return {
    type: 'UnknownRequestError',
    url: this.url
  };
};

var MissingRequestError = t.struct({
  url: t.String,
  length: t.Number
});

MissingRequestError.prototype.toJSON = function() {
  return {
    type: 'MissingRequestError',
    url: this.url,
    length: this.length
  };
};

module.exports = {
  Config: Config,
  Test: Test,
  Client: Client,
  Server: Server,
  Response: Response,
  Fixture: Fixture,
  AdditionalRequestError: AdditionalRequestError,
  UnknownRequestError: UnknownRequestError,
  MissingRequestError: MissingRequestError
};