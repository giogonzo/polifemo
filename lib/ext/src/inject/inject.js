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

var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);

    // ----------------------------------------------------------
    // This part of the script triggers when page is done loading
    // ----------------------------------------------------------

    document.addEventListener('DOMSubtreeModified', function () {
      // console.log('DOM changed');
    });

    var port = chrome.runtime.connect({name: "images"});
    port.onMessage.addListener(function(message) {
      if (message.type === 'SCREENSHOT') {
        sendImage(message.image);
        // var img = document.createElement('img');
        // img.src = message.image;
        // document.body.appendChild(img);
      }
    });
    setTimeout(function () {
      port.postMessage({type: 'SCREENSHOT_REQUESTED'});
    }, 3000);

  }
}, 10);

