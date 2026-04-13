import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Camera, User, MessageSquare, Zap, Settings2, Trash2, Ghost } from 'lucide-react';
import { motion } from 'motion/react';

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

interface PopupProps {
  demoSettings?: PrivacySettings;
  onDemoUpdate?: (settings: PrivacySettings) => void;
}

export default function Popup({ demoSettings, onDemoUpdate }: PopupProps) {
  const [internalSettings, setInternalSettings] = useState<PrivacySettings>(defaultSettings);

  const settings = demoSettings || internalSettings;

  useEffect(() => {
    if (!demoSettings && typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(defaultSettings as any, (items) => {
        setInternalSettings(items as unknown as PrivacySettings);
      });
    }
  }, [demoSettings]);

  const updateSetting = (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    
    if (demoSettings && onDemoUpdate) {
      onDemoUpdate(newSettings);
    } else {
      setInternalSettings(newSettings);
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(newSettings);
      }
    }
  };

  const blurAll = () => {
    const allBlurred = {
      ...settings,
      blurMessages: true,
      blurPhotos: true,
      blurNames: true,
      blurPreviews: true,
    };
    
    if (demoSettings && onDemoUpdate) {
      onDemoUpdate(allBlurred);
    } else {
      setInternalSettings(allBlurred);
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(allBlurred);
      }
    }
  };

  const clearAllBlur = () => {
    const cleared = {
      ...settings,
      blurMessages: false,
      blurPhotos: false,
      blurNames: false,
      blurPreviews: false,
    };
    
    if (demoSettings && onDemoUpdate) {
      onDemoUpdate(cleared);
    } else {
      setInternalSettings(cleared);
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(cleared);
      }
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl transition-colors duration-300">
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight uppercase leading-none">Privacy Pro</h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">v1.0.0</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active</span>
        </div>
      </header>

      <div className="space-y-4">
        {/* Toggle Section */}
        <div className="grid grid-cols-2 gap-2">
          <ToggleButton 
            icon={<MessageSquare className="w-4 h-4" />} 
            label="Chats" 
            active={settings.blurMessages} 
            onClick={() => updateSetting('blurMessages', !settings.blurMessages)} 
          />
          <ToggleButton 
            icon={<Camera className="w-4 h-4" />} 
            label="Photos" 
            active={settings.blurPhotos} 
            onClick={() => updateSetting('blurPhotos', !settings.blurPhotos)} 
          />
          <ToggleButton 
            icon={<User className="w-4 h-4" />} 
            label="Names" 
            active={settings.blurNames} 
            onClick={() => updateSetting('blurNames', !settings.blurNames)} 
          />
          <ToggleButton 
            icon={<EyeOff className="w-4 h-4" />} 
            label="Previews" 
            active={settings.blurPreviews} 
            onClick={() => updateSetting('blurPreviews', !settings.blurPreviews)} 
          />
          <ToggleButton 
            icon={<Ghost className="w-4 h-4" />} 
            label="Incognito" 
            active={settings.incognitoRead} 
            onClick={() => updateSetting('incognitoRead', !settings.incognitoRead)} 
          />
          <ToggleButton 
            icon={<Zap className="w-4 h-4" />} 
            label="Panic" 
            active={settings.panicMode} 
            onClick={() => updateSetting('panicMode', !settings.panicMode)} 
          />
        </div>

        {/* Intensity Slider */}
        <div className="p-3 bg-zinc-100 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Blur Intensity</label>
            <span className="text-[10px] font-mono text-emerald-500">{settings.blurIntensity}px</span>
          </div>
          <input 
            type="range" 
            min="2" 
            max="30" 
            value={settings.blurIntensity} 
            onChange={(e) => updateSetting('blurIntensity', parseInt(e.target.value))}
            className="w-full h-1 bg-zinc-300 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 flex gap-2">
          <button 
            onClick={blurAll}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 rounded-md text-[11px] font-bold text-white transition-colors"
          >
            Blur All
          </button>
          <button 
            onClick={clearAllBlur}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md text-[11px] font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <footer className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 text-center">
        <p className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">
          v1.0.0 // Secure Connection Established
        </p>
      </footer>
    </div>
  );
}

function ToggleButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
        active 
          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
          : 'bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
    </button>
  );
}

function FeatureRow({ icon, label, description, active, onClick, disabled = false }: { icon: React.ReactNode, label: string, description: string, active: boolean, onClick: () => void, disabled?: boolean }) {
  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${
        active 
          ? 'bg-emerald-500/5 border-emerald-500/20' 
          : 'bg-zinc-50 dark:bg-zinc-900/30 border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-md ${active ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-bold tracking-tight uppercase">{label}</p>
          <p className="text-[9px] text-zinc-500">{description}</p>
        </div>
      </div>
      {!disabled && (
        <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${active ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
          <motion.div 
            animate={{ x: active ? 16 : 0 }}
            className="w-3 h-3 bg-white rounded-full shadow-sm" 
          />
        </div>
      )}
    </div>
  );
}
