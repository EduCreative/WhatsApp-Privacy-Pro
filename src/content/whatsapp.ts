/**
 * WhatsApp Privacy Pro - Content Script
 * This script runs on web.whatsapp.com
 */

interface PrivacySettings {
  blurMessages: boolean;
  blurPhotos: boolean;
  blurNames: boolean;
  blurPreviews: boolean;
  blurIntensity: number;
  panicMode: boolean;
  privateContacts: string[];
  incognitoRead: boolean;
}

const defaultSettings: PrivacySettings = {
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

// Initialize settings from storage
function init() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get(defaultSettings as any, (items) => {
      settings = items as unknown as PrivacySettings;
      applyStyles();
    });

    chrome.storage.onChanged.addListener((changes) => {
      for (let [key, change] of Object.entries(changes)) {
        (settings as any)[key] = change.newValue;
      }
      applyStyles();
    });
  } else {
    // For demo purposes in the web app
    applyStyles();
  }
}

function applyStyles() {
  const styleId = 'whatsapp-privacy-pro-styles';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement;
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  const intensity = settings.blurIntensity || 10;
  
  let css = '';

  // Blur Messages
  if (settings.blurMessages) {
    css += `
      [data-testid="msg-container"] .copyable-text {
        filter: blur(${intensity}px);
        transition: filter 0.3s ease;
      }
      [data-testid="msg-container"]:hover .copyable-text {
        filter: blur(0);
      }
    `;
  }

  // Blur Photos
  if (settings.blurPhotos) {
    css += `
      img[src*="profile"], [data-testid="default-user"], ._ak8h img {
        filter: blur(${intensity}px);
        transition: filter 0.3s ease;
      }
      img[src*="profile"]:hover, [data-testid="default-user"]:hover {
        filter: blur(0);
      }
    `;
  }

  // Blur Names
  if (settings.blurNames) {
    css += `
      [data-testid="cell-frame-title"], ._ak8q {
        filter: blur(${intensity}px);
        transition: filter 0.3s ease;
      }
      [data-testid="cell-frame-title"]:hover {
        filter: blur(0);
      }
    `;
  }

  // Blur Previews (Sidebar)
  if (settings.blurPreviews) {
    css += `
      [data-testid="last-msg-status"], ._ak8k {
        filter: blur(${intensity}px);
        transition: filter 0.3s ease;
      }
      [data-testid="last-msg-status"]:hover {
        filter: blur(0);
      }
    `;
  }

  // Selective Contact Blur
  if (settings.privateContacts.length > 0) {
    settings.privateContacts.forEach(contact => {
      // This is a simplified selector; real WhatsApp DOM is complex
      css += `
        [title*="${contact}"] {
          filter: blur(${intensity}px) !important;
        }
        [title*="${contact}"]:hover {
          filter: blur(0) !important;
        }
      `;
    });
  }

  styleEl.textContent = css;
}

// Panic Mode Listener
window.addEventListener('keydown', (e) => {
  if (e.altKey && (e.code === 'KeyQ' || e.key === 'q' || e.key === 'Q') && settings.panicMode) {
    activatePanicMode();
  }
});

function activatePanicMode() {
  if (document.getElementById('privacy-pro-panic-overlay')) return;
  
  const overlay = document.createElement('div');
  overlay.id = 'privacy-pro-panic-overlay';
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #f0f2f5; color: #54656f; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; z-index: 2147483647;';
  
  overlay.innerHTML = `
    <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 16px;">Work in Progress</h1>
    <p style="font-size: 18px;">The system is currently updating. Please wait...</p>
    <div style="margin-top: 32px; width: 200px; height: 4px; background: #e9edef; border-radius: 2px; overflow: hidden;">
      <div style="width: 40%; height: 100%; background: #00a884; animation: loading 2s infinite linear;"></div>
    </div>
    <style>
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(250%); }
      }
    </style>
  `;
  
  document.documentElement.appendChild(overlay);
  document.body.style.filter = 'blur(20px)';
}

init();
