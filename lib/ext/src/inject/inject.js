/* global chrome */

function sendImage(image) {
  var http = new XMLHttpRequest();
  var url = 'http://localhost:5000/__screenshot__';
  var params = JSON.stringify({image: image});
  http.open('POST', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");

  http.send(params);
}

function debounce(func, threshold) {
  var timeout;
  return function debounced () {
    var obj = this, args = arguments;
    function delayed() {
      func.apply(obj, args);
      timeout = null;
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(delayed, threshold || 100);
  };
}

var port = chrome.runtime.connect({name: "images"});

function onDOMSubtreeModified() {
  // console.log('DOMSubtreeModified');
  port.postMessage({type: 'SCREENSHOT_REQUESTED'});
}

document.body.addEventListener('DOMSubtreeModified', debounce(onDOMSubtreeModified, 100));

port.onMessage.addListener(function(message) {
  if (message.type === 'SCREENSHOT') {
    sendImage(message.image);
  }
});

var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === 'complete') {
    clearInterval(readyStateCheckInterval);

    // ----------------------------------------------------------
    // This part of the script triggers when page is done loading
    // ----------------------------------------------------------
    // console.log('ready');
    port.postMessage({type: 'SCREENSHOT_REQUESTED'});

  }
}, 10);

