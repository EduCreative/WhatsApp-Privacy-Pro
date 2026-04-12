/**
 * WhatsApp Privacy Pro - Background Script
 */

chrome.commands.onCommand.addListener((command) => {
  if (command === "panic-mode") {
    chrome.storage.sync.get({ panicMode: true }, (items) => {
      if (!items.panicMode) return;
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              if (document.getElementById('privacy-pro-panic-overlay')) return;
              const overlay = document.createElement('div');
              overlay.id = 'privacy-pro-panic-overlay';
              overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#f0f2f5;color:#54656f;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;z-index:2147483647;';
              overlay.innerHTML = '<h1 style="font-size:48px;margin-bottom:16px;">Work in Progress</h1><p style="font-size:18px;">The system is currently updating. Please wait...</p>';
              document.documentElement.appendChild(overlay);
              document.body.style.filter = 'blur(20px)';
            }
          });
        }
      });
    });
  }
});

// Handle Incognito Read (Network Level)
// This is handled by rules.json in manifest v3, but we can add more logic here if needed.
