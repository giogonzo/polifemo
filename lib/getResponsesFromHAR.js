/* eslint-disable */

/*

  Dato un file har, restituisce la lista di response relative
  a richieste in GET che hanno risposto in JSON

*/

function isGetJSONResponse(entry) {
  return entry.request.method === 'GET' && entry.response.content.mimeType === 'application/json';
}

function getResponsesFromHAR(har, apiRoot) {
  var responses = {};

  function stripApiRoot(url) {
    if (typeof apiRoot === 'string') {
      return url.replace(apiRoot, '');
    }
    return url;
  }

  function mapToResponse(entry) {
    var url = stripApiRoot(entry.request.url, apiRoot);
    if (!responses.hasOwnProperty(url)) {
      responses[url] = 0;
    }
    responses[url] = responses[url] + 1;
    return {
      type: 'RESPONSE',
      url: url,
      order: responses[url] - 1,
      payload: JSON.parse(entry.response.content.text),
      delay: entry.time
    }
  }

  return har.log.entries
    .filter(isGetJSONResponse)
    .map(mapToResponse);
}

module.exports = getResponsesFromHAR;