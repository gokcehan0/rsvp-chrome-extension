function readText(mode) {
  var overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';

  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = mode === 'normal' ? 'rgba(0, 0, 0, 0.8)' : 'transparent';
  overlay.style.color = mode === 'normal' ? '#fff' : '#fff';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.fontSize = '24px';
  overlay.textContent = 'Okunuyor...';


  

  chrome.storage.sync.get('fontSize', function(data) {
    var fontSize = data.fontSize || '1.5em'; // default font size medium
    overlay.style.fontSize = fontSize;
  });
  document.body.appendChild(overlay);

  var textToRead = window.getSelection().toString();
  var words = textToRead.split(/\s+/);

  chrome.storage.sync.get(['speed', 'fontSize'], function(data) {
    var speed = parseFloat(data.speed) || 3;
    if (isNaN(speed) || speed <= 0) {
      speed = 3;
    }
    var intervalTime = 1000 / speed;

    var i = 0;
    window.readInterval = setInterval(function() {
      if (i >= words.length) {
        clearInterval(window.readInterval);
        overlay.parentNode.removeChild(overlay);
        // break
        chrome.runtime.sendMessage({ closeExtension: true });
        return;
      }
      overlay.textContent = words[i++];
    }, intervalTime);
  });

  overlay.addEventListener('click', function() {
    clearInterval(window.readInterval);
    overlay.parentNode.removeChild(overlay);
  });

  if (mode === 'hard') {
    overlay.style.backgroundColor = 'black';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.width = '50%';
    overlay.style.height = '30%';

    overlay.style.transform = 'translate(-50%, -50%)';
  }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.closeExtension) {
    window.close();
  }
});

chrome.contextMenus.create({
  id: "rsvpMenuItem",
  title: "Seçili Metni Oku",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  var mode = 'normal'; 
  chrome.storage.sync.get('mode', function(data) {
    mode = data.mode || mode; 
    if (info.menuItemId === "rsvpMenuItem") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: readText,
        args: [mode],
      });
    }
  });
});

chrome.commands.onCommand.addListener(function(command) {
  var mode = command === "read_selected_text_hard" ? 'hard' : 'normal';
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: readText,
      args: [mode],
    });
  });
});