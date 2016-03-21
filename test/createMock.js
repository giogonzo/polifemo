/* eslint-disable */
var createMock = require('../lib/createMock');
var responses = require('./getResponsesFromHAR');
var mock = createMock(responses);
mock.get('/unknown')
console.log(mock.get('/api/user').then(console.log.bind(console)))
console.log(mock.getErrors())