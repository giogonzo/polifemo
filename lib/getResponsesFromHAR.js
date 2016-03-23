var isGetJSONResponse = require('./isGetJSONResponse');

function stripApiRoot(url, apiRoot) {
  if (typeof apiRoot === 'string') {
    return url.replace(apiRoot, '');
  }
  return url;
}

function getPayload(entry) {
  return JSON.parse(entry.response.content.text);
}

function getDelay(entry) {
  return entry.time;
}

function getResponsesFromHAR(har, apiRoot) {

  function toResponse(entry) {
    var url = stripApiRoot(entry.request.url, apiRoot);
    return {
      url: url,
      payload: getPayload(entry),
      delay: getDelay(entry)
    };
  }

  return har.log.entries
    .filter(isGetJSONResponse)
    .map(toResponse);
}

module.exports = getResponsesFromHAR;