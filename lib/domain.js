var t = require('tcomb');

var TestId = t.String;

var Response = t.struct({
  url: t.String,
  status: t.Number,
  payload: t.Any,
  delay: t.Number
});

var Fixture = t.struct({
  id: TestId,
  responses: t.list(Response)
});

var Config = t.struct({
  createdAt: t.maybe(t.String),
  tests: t.dict(TestId, t.list(Response))
}, 'Config');

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
  // Test: Test,
  // Client: Client,
  // Server: Server,
  Response: Response,
  Fixture: Fixture,
  AdditionalRequestError: AdditionalRequestError,
  UnknownRequestError: UnknownRequestError,
  MissingRequestError: MissingRequestError
};