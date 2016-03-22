function isGetJSONResponse(entry) {
  return entry.request.method === 'GET'
    && entry.response.content.mimeType === 'application/json'
    && entry.request.url.indexOf('sockjs-node') === -1; // strip webpack devserver GETs
}

module.exports = isGetJSONResponse;