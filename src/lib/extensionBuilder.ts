import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function downloadExtension(files: { [key: string]: string }) {
  const zip = new JSZip();

  // Generate icons using Canvas
  const sizes = [16, 48, 128];
  for (const size of sizes) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw Shield
      ctx.fillStyle = '#00a884';
      ctx.beginPath();
      ctx.moveTo(size * 0.5, size * 0.1); // Top
      ctx.lineTo(size * 0.9, size * 0.25); // Top Right
      ctx.lineTo(size * 0.9, size * 0.5); // Right
      ctx.quadraticCurveTo(size * 0.9, size * 0.8, size * 0.5, size * 0.95); // Bottom
      ctx.quadraticCurveTo(size * 0.1, size * 0.8, size * 0.1, size * 0.5); // Left
      ctx.lineTo(size * 0.1, size * 0.25); // Top Left
      ctx.closePath();
      ctx.fill();

      // Draw Lock/Keyhole
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.45, size * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(size * 0.46, size * 0.45, size * 0.08, size * 0.2);
    }
    
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
    if (blob) {
      zip.file(`icon${size}.png`, blob);
    }
  }

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'whatsapp-privacy-pro.zip');
}

export const extensionFiles = {
  'manifest.json': `{
  "manifest_version": 3,
  "name": "WhatsApp Privacy Pro",
  "version": "1.0.0",
  "description": "Privacy tools for WhatsApp Web: Blur chats, Panic Mode, and Incognito Read.",
  "permissions": [
    "storage",
    "declarativeNetRequest",
    "tabs",
    "scripting"
  ],
  "host_permissions": [
    "https://web.whatsapp.com/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  },
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["https://web.whatsapp.com/*"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ],
  "commands": {
    "panic-mode": {
      "suggested_key": {
        "default": "Alt+Q"
      },
      "description": "Activate Panic Mode"
    }
  },
  "declarative_net_request": {
    "rule_resources": [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules.json"
    }]
  }
}`,
  'rules.json': `[
  {
    "id": 1,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "read-receipt",
      "resourceTypes": ["xmlhttprequest", "other"]
    }
  },
  {
    "id": 2,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "typing",
      "resourceTypes": ["xmlhttprequest", "other"]
    }
  }
]`,
  'content.css': `/* Base styles for WhatsApp Privacy Pro */
.privacy-pro-blurred {
    filter: blur(10px);
    transition: filter 0.3s ease;
}
.privacy-pro-blurred:hover {
    filter: blur(0) !important;
}`,
  'content.js': `/**
 * WhatsApp Privacy Pro - Content Script
 */
const defaultSettings = {
  blurMessages: true,
  blurPhotos: true,
  blurNames: true,
  blurPreviews: true,
  blurIntensity: 10,
  panicMode: true,
  privateContacts: [],
  incognitoRead: true,
};

let settings = { ...defaultSettings };

function init() {
  chrome.storage.sync.get(defaultSettings, (items) => {
    settings = items;
    applyStyles();
  });

  chrome.storage.onChanged.addListener((changes) => {
    for (let [key, change] of Object.entries(changes)) {
      settings[key] = change.newValue;
    }
    applyStyles();
  });
}

function applyStyles() {
  const styleId = 'whatsapp-privacy-pro-styles';
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  const intensity = settings.blurIntensity || 10;
  let css = '';

  // Message Blurring
  if (settings.blurMessages) {
    css += \`
      [data-testid="msg-container"] .copyable-text, 
      [data-testid="msg-container"] ._ak8j,
      .message-in .copyable-text,
      .message-out .copyable-text { 
        filter: blur(\${intensity}px); 
        transition: filter 0.2s ease; 
      }
      [data-testid="msg-container"]:hover .copyable-text,
      [data-testid="msg-container"]:hover ._ak8j,
      .message-in:hover .copyable-text,
      .message-out:hover .copyable-text { 
        filter: blur(0) !important; 
      }
    \`;
  }

  // Photo Blurring
  if (settings.blurPhotos) {
    css += \`
      img[src*="profile"], 
      [data-testid="default-user"], 
      ._ak8h img,
      .lh9s8v9u img { 
        filter: blur(\${intensity}px); 
        transition: filter 0.2s ease; 
      }
      img[src*="profile"]:hover, 
      [data-testid="default-user"]:hover,
      ._ak8h img:hover { 
        filter: blur(0) !important; 
      }
    \`;
  }

  // Name Blurring
  if (settings.blurNames) {
    css += \`
      [data-testid="cell-frame-title"], 
      ._ak8q,
      .ggj6brxn.gfz4du6o { 
        filter: blur(\${intensity}px); 
        transition: filter 0.2s ease; 
      }
      [data-testid="cell-frame-title"]:hover,
      ._ak8q:hover { 
        filter: blur(0) !important; 
      }
    \`;
  }

  // Preview Blurring
  if (settings.blurPreviews) {
    css += \`
      [data-testid="last-msg-status"], 
      ._ak8k,
      .hy9t9v9u { 
        filter: blur(\${intensity}px); 
        transition: filter 0.2s ease; 
      }
      [data-testid="last-msg-status"]:hover,
      ._ak8k:hover { 
        filter: blur(0) !important; 
      }
    \`;
  }

  styleEl.textContent = css;
}

window.addEventListener('keydown', (e) => {
  if (e.altKey && (e.code === 'KeyQ' || e.key === 'q' || e.key === 'Q') && settings.panicMode) {
    activatePanicMode();
  }
});

function activatePanicMode() {
  if (document.getElementById('privacy-pro-panic-overlay')) return;
  
  const overlay = document.createElement('div');
  overlay.id = 'privacy-pro-panic-overlay';
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #f0f2f5; color: #54656f; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; z-index: 2147483647;';
  
  overlay.innerHTML = '<h1 style="font-size: 48px; font-weight: bold; margin-bottom: 16px;">Work in Progress</h1><p style="font-size: 18px;">The system is currently updating. Please wait...</p><div style="width: 200px; height: 2px; background: #e9edef; margin-top: 30px; position: relative; overflow: hidden;"><div style="position: absolute; width: 100px; height: 100%; background: #00a884; animation: panic-progress 2s infinite linear;"></div></div><style>@keyframes panic-progress { 0% { left: -100px; } 100% { left: 200px; } }</style>';
  
  document.documentElement.appendChild(overlay);
  document.body.style.filter = 'blur(20px)';
}

init();`,
  'background.js': `/**
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
});`,
  'popup.html': `<!DOCTYPE html>
<html>
<head>
    <style>
        body { width: 300px; padding: 15px; font-family: sans-serif; background: #0a0a0a; color: white; }
        .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .label { font-size: 12px; font-weight: bold; color: #ccc; }
        .header { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; }
        .dot { width: 8px; h-8px; border-radius: 50%; background: #00a884; }
        input[type="checkbox"] { cursor: pointer; width: 16px; height: 16px; accent-color: #00a884; }
        input[type="range"] { width: 100%; margin-top: 8px; accent-color: #00a884; }
        .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 10px; margin-top: 15px; }
        button { width: 100%; padding: 10px; margin-top: 15px; background: #1a1a1a; border: 1px solid #333; color: white; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: background 0.2s; }
        button:hover { background: #222; }
        .intensity-val { font-size: 10px; font-family: monospace; color: #00a884; }
    </style>
</head>
<body>
    <div class="header">
        <div class="dot"></div>
        <h3 style="margin: 0; font-size: 14px; letter-spacing: -0.5px;">PRIVACY PRO</h3>
    </div>

    <div class="section-title">Blur Settings</div>
    <div class="row">
        <span class="label">Blur Messages</span>
        <input type="checkbox" id="blurMessages">
    </div>
    <div class="row">
        <span class="label">Blur Photos</span>
        <input type="checkbox" id="blurPhotos">
    </div>
    <div class="row">
        <span class="label">Blur Names</span>
        <input type="checkbox" id="blurNames">
    </div>
    <div class="row">
        <span class="label">Blur Previews</span>
        <input type="checkbox" id="blurPreviews">
    </div>

    <div class="section-title">Advanced</div>
    <div class="row">
        <span class="label">Incognito Read</span>
        <input type="checkbox" id="incognitoRead">
    </div>
    <div class="row">
        <span class="label">Panic Mode (Alt+Q)</span>
        <input type="checkbox" id="panicMode">
    </div>

    <div class="section-title">Intensity: <span id="intensityVal" class="intensity-val">10px</span></div>
    <input type="range" id="blurIntensity" min="2" max="30">

    <div style="display: flex; gap: 8px; margin-top: 15px;">
        <button id="blurAllBtn" style="background: #00a884; border: none;">BLUR ALL</button>
        <button id="clearBtn">CLEAR ALL</button>
    </div>
    <script src="popup.js"></script>
</body>
</html>`,
  'popup.js': `const defaultSettings = {
  blurMessages: true,
  blurPhotos: true,
  blurNames: true,
  blurPreviews: true,
  blurIntensity: 10,
  incognitoRead: true,
  panicMode: true
};

const elements = ['blurMessages', 'blurPhotos', 'blurNames', 'blurPreviews', 'blurIntensity', 'incognitoRead', 'panicMode'];

chrome.storage.sync.get(defaultSettings, (items) => {
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = items[id] ?? defaultSettings[id];
    else {
      el.value = items[id] ?? defaultSettings[id];
      if (id === 'blurIntensity') document.getElementById('intensityVal').textContent = el.value + 'px';
    }
  });
});

elements.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('change', (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : parseInt(e.target.value);
    chrome.storage.sync.set({ [id]: val });
    if (id === 'blurIntensity') document.getElementById('intensityVal').textContent = val + 'px';
    
    // Handle Incognito Read Ruleset
    if (id === 'incognitoRead') {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        [val ? 'enableRulesetIds' : 'disableRulesetIds']: ['ruleset_1']
      });
    }
  });
});

document.getElementById('blurAllBtn').addEventListener('click', () => {
  const allBlurred = { blurMessages: true, blurPhotos: true, blurNames: true, blurPreviews: true };
  chrome.storage.sync.set(allBlurred);
  ['blurMessages', 'blurPhotos', 'blurNames', 'blurPreviews'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = true;
  });
});

document.getElementById('clearBtn').addEventListener('click', () => {
  const cleared = { blurMessages: false, blurPhotos: false, blurNames: false, blurPreviews: false };
  chrome.storage.sync.set(cleared);
  ['blurMessages', 'blurPhotos', 'blurNames', 'blurPreviews'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
});`,
  'icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#00a884" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  <path d="M12 8v4"></path>
  <path d="M12 16h.01"></path>
</svg>`
};
