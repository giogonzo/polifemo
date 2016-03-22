/* eslint-disable */
var createGenericResponsePlayer = require('../lib/createGenericResponsePlayer');
var responses = require('./getResponsesFromHAR');
var player = createGenericResponsePlayer(responses);
player.get('/unknown')
console.log(player.get('/api/user').then(console.log.bind(console)))
console.log(player.getErrors())