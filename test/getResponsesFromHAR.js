/* eslint-disable */
var fs = require('fs');
var getResponsesFromHAR = require('../lib/getResponsesFromHAR');
var har = JSON.parse(fs.readFileSync('./fixtures/1.har').toString());
var responses = getResponsesFromHAR(har, 'http://localhost:5000');
// console.log(JSON.stringify(responses, null, 2))
module.exports = responses;