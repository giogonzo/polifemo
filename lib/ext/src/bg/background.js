/* global chrome */

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(message) {
    if (message.type === 'SCREENSHOT_REQUESTED') {
      chrome.tabs.captureVisibleTab(null, {}, function (image) {
        if (image) {
          port.postMessage({type: "SCREENSHOT", image: image});
        }
      });
    }
  });
});
