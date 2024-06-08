document.addEventListener('DOMContentLoaded', function() {
    var toggleIFrame = document.getElementById('toggleIFrame');
    var toggleCode = document.getElementById('toggleCode');
    
    toggleIFrame.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleIFrame'});
      });
    });
    toggleCode.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleCode'});
        });
    });
  });