document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get('speed', function(data) {
      var speed = parseFloat(data.speed) || 3;
      document.getElementById('speedInput').value = speed;
      document.getElementById('speedInput').addEventListener('change', function() {
          var speed = parseFloat(this.value);
          chrome.storage.sync.set({ speed: speed }, function() {
              console.log('Hız kaydedildi:', speed);
          });
          chrome.runtime.sendMessage({ speed: speed });
      });
  });

  chrome.storage.sync.get('fontSize', function(data) {
      var fontSize = data.fontSize || '1em'; // default font size medium
      document.getElementById('fontSizeInput').value = fontSize;
      // Font size save
      document.getElementById('fontSizeInput').addEventListener('change', function() {
          var fontSize = this.value;
          chrome.storage.sync.set({ fontSize: fontSize }, function() {
              console.log('Font büyüklüğü kaydedildi:', fontSize);
          });
      });
  });

  // mode save
  chrome.storage.sync.get('mode', function(data) {
      var mode = data.mode || 'normal'; // default normal mode
      document.getElementById('modeInput').value = mode;
      
      document.getElementById('modeInput').addEventListener('change', function() {
          var mode = this.value;
          chrome.storage.sync.set({ mode: mode }, function() {
              console.log('Mod kaydedildi:', mode);
          });
      });
  });
});
