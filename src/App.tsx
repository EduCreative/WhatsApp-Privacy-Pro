import React, { useState, useEffect } from 'react';
import { Shield, Download, Terminal, Settings, Sun, Moon, Info, Github, ExternalLink, AlertTriangle, Keyboard, FileCode, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Popup from './popup/Popup';
import WhatsAppDemo from './components/WhatsAppDemo';
import { downloadExtension, extensionFiles } from './lib/extensionBuilder';

export default function App() {
  const [settings, setSettings] = useState({
    blurMessages: true,
    blurPhotos: true,
    blurNames: true,
    blurPreviews: true,
    blurIntensity: 10,
    panicMode: true,
    privateContacts: ['Secret Client'],
    incognitoRead: true,
  });

  const [activeTab, setActiveTab] = useState<'demo' | 'installation' | 'code'>('demo');
  const [selectedFile, setSelectedFile] = useState<string>(Object.keys(extensionFiles)[0]);
  const [panicActive, setPanicActive] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'q') {
        setPanicActive(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDownload = async () => {
    await downloadExtension(extensionFiles);
  };

  if (panicActive) {
    return (
      <div className="h-screen flex flex-col items-center justify-center font-sans bg-[#f0f2f5] text-[#54656f]">
        <h1 className="text-5xl font-bold mb-4">Work in Progress</h1>
        <p className="text-xl mb-8">The system is currently updating. Please wait...</p>
        <div className="w-64 h-1 bg-zinc-200 rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: [-256, 256] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-1/2 h-full bg-[#00a884]"
          />
        </div>
        <button 
          onClick={() => setPanicActive(false)}
          className="mt-12 flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Simulation
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E4E3E0] dark:bg-[#0a0a0a] text-[#141414] dark:text-[#e4e3e0] font-sans selection:bg-[#141414] dark:selection:bg-[#e4e3e0] selection:text-[#E4E3E0] dark:selection:text-[#141414] transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="border-b border-[#141414] dark:border-[#e4e3e0]/20 px-6 py-4 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#141414] dark:bg-[#e4e3e0] text-[#E4E3E0] dark:text-[#141414] rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight uppercase">WhatsApp Privacy Pro</h1>
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest leading-none">Advanced Privacy Extension // v1.0.0</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('demo')}
            className={`text-xs font-bold uppercase tracking-widest transition-opacity ${activeTab === 'demo' ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
          >
            Live Demo
          </button>
          <button 
            onClick={() => setActiveTab('installation')}
            className={`text-xs font-bold uppercase tracking-widest transition-opacity ${activeTab === 'installation' ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
          >
            Installation
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            className={`text-xs font-bold uppercase tracking-widest transition-opacity ${activeTab === 'code' ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
          >
            Source Code
          </button>
          <div className="h-4 w-px bg-[#141414]/20 dark:bg-[#e4e3e0]/20" />
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-[#141414] dark:hover:bg-[#e4e3e0] hover:text-[#E4E3E0] dark:hover:text-[#141414] transition-colors rounded-sm"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a 
            href="https://github.com/EduCreative/WhatsApp-Privacy-Pro" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 hover:bg-[#141414] dark:hover:bg-[#e4e3e0] hover:text-[#E4E3E0] dark:hover:text-[#141414] transition-colors rounded-sm"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'demo' && (
            <motion.div 
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8"
            >
              {/* Left Column: Extension Popup Preview */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-[#141414] dark:border-[#e4e3e0]/20 p-1 shadow-[4px_4px_0px_0px_#141414] dark:shadow-[4px_4px_0px_0px_#e4e3e0]">
                  <div className="bg-[#141414] dark:bg-[#e4e3e0] text-[#E4E3E0] dark:text-[#141414] px-3 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest">Extension Popup</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="bg-zinc-950">
                    {/* We pass a mock setSettings to the popup for the demo */}
                    <div className="pointer-events-auto">
                      <Popup 
                        demoSettings={settings} 
                        onDemoUpdate={(newSettings) => setSettings(newSettings)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-[#141414] dark:border-[#e4e3e0]/20 p-6 space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Demo Instructions
                  </h3>
                  <p className="text-sm leading-relaxed opacity-70 italic font-serif">
                    "The popup on the left is a live preview of the extension interface. Use the toggles and sliders to see how they affect the mock WhatsApp interface on the right."
                  </p>
                  <ul className="space-y-2 text-xs font-mono">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#141414] dark:bg-[#e4e3e0] rounded-full" />
                      Hover over blurred messages to reveal
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#141414] dark:bg-[#e4e3e0] rounded-full" />
                      Toggle 'Names' to hide identities
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#141414] dark:bg-[#e4e3e0] rounded-full" />
                      Adjust intensity for stronger privacy
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: WhatsApp Simulation */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-[#141414] dark:border-[#e4e3e0]/20 p-1 shadow-[8px_8px_0px_0px_#141414] dark:shadow-[8px_8px_0px_0px_#e4e3e0]">
                  <div className="bg-[#141414] dark:bg-[#e4e3e0] text-[#E4E3E0] dark:text-[#141414] px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4" />
                      <span className="text-[11px] font-mono uppercase tracking-widest">WhatsApp Web Simulation // web.whatsapp.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 bg-emerald-500 text-black text-[9px] font-bold uppercase">Safe</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-zinc-800">
                    <WhatsAppDemo settings={settings} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <FeatureCard 
                    icon={<Keyboard className="w-5 h-5" />}
                    title="Panic Mode"
                    desc="Press Alt + Q to instantly replace the page with a work-safe screen."
                  />
                  <FeatureCard 
                    icon={<Settings className="w-5 h-5" />}
                    title="Selective Blur"
                    desc="Target specific contacts for extra privacy while leaving others visible."
                  />
                  <FeatureCard 
                    icon={<AlertTriangle className="w-5 h-5" />}
                    title="Network Stealth"
                    desc="Blocks read receipts and 'typing' indicators at the network level."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'installation' && (
            <motion.div 
              key="installation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-[#141414] dark:border-[#e4e3e0]/20 p-12 shadow-[12px_12px_0px_0px_#141414] dark:shadow-[12px_12px_0px_0px_#e4e3e0]"
            >
              <h2 className="text-4xl font-bold uppercase tracking-tighter mb-8">Installation Guide</h2>
              <div className="space-y-8">
                <Step number="01" title="Download Package" desc="Click the 'Download Now' button below to get the complete extension source as a ZIP file." />
                <Step number="02" title="Extract Files" desc="Extract the ZIP file to a folder on your computer (e.g., Desktop/whatsapp-privacy-pro)." />
                <Step number="03" title="Enable Developer Mode" desc="Open Chrome and navigate to chrome://extensions. Toggle 'Developer mode' in the top right corner." />
                <Step number="04" title="Load Unpacked" desc="Click 'Load unpacked' and select the folder you just extracted." />
              </div>
              <div className="mt-12 p-6 bg-[#141414] dark:bg-[#e4e3e0] text-[#E4E3E0] dark:text-[#141414] flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">Ready to secure your chats?</p>
                  <p className="font-bold uppercase tracking-tight">Download Extension Package (.zip)</p>
                </div>
                <button 
                  onClick={handleDownload}
                  className="bg-[#E4E3E0] dark:bg-[#141414] text-[#141414] dark:text-[#E4E3E0] px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-white dark:hover:bg-black transition-colors"
                >
                  Download Now
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div 
              key="code"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-[250px_1fr] bg-[#141414] text-[#E4E3E0] rounded-sm overflow-hidden shadow-2xl min-h-[600px]"
            >
              {/* File Sidebar */}
              <div className="border-r border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <FileCode className="w-4 h-4 opacity-50" />
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">Project Files</span>
                </div>
                <div className="space-y-1">
                  {Object.keys(extensionFiles).map((fileName) => (
                    <button
                      key={fileName}
                      onClick={() => setSelectedFile(fileName)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded-sm transition-colors ${
                        selectedFile === fileName ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                      }`}
                    >
                      {fileName}
                      {selectedFile === fileName && <ChevronRight className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Viewer */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    <span className="text-xs uppercase tracking-widest opacity-50 font-mono">{selectedFile}</span>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(extensionFiles[selectedFile as keyof typeof extensionFiles])}
                    className="text-[10px] uppercase tracking-widest border border-white/20 px-2 py-1 hover:bg-white hover:text-black transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
                <div className="flex-1 p-6 overflow-auto custom-scrollbar">
                  <pre className="text-emerald-400 font-mono text-sm leading-relaxed">
                    {extensionFiles[selectedFile as keyof typeof extensionFiles]}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-[#141414] dark:border-[#e4e3e0]/20 p-12 bg-white dark:bg-zinc-900">
        <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6" />
              <h2 className="font-bold text-xl uppercase tracking-tighter">Privacy Pro</h2>
            </div>
            <p className="text-sm opacity-60 leading-relaxed max-w-md mb-4">
              A professional-grade privacy toolkit for WhatsApp Web. Built for security-conscious users who value their digital boundaries.
            </p>
            <div className="space-y-1 text-xs font-mono uppercase tracking-widest opacity-50">
              <p>Designer: <span className="text-[#141414] dark:text-[#e4e3e0] font-bold">Masroor Khan</span></p>
              <p>Suggestions: <a href="https://wa.me/923331306603" className="text-[#00a884] font-bold hover:underline">+92 333 1306603</a></p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-3 text-sm opacity-60">
              <li className="hover:opacity-100 cursor-pointer transition-opacity">Documentation</li>
              <li className="hover:opacity-100 cursor-pointer transition-opacity">Security Audit</li>
              <li className="hover:opacity-100 cursor-pointer transition-opacity">API Reference</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Connect</h4>
            <ul className="space-y-3 text-sm opacity-60">
              <li>
                <a 
                  href="https://github.com/EduCreative/WhatsApp-Privacy-Pro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-100 transition-opacity"
                >
                  <Github className="w-4 h-4" /> GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/923331306603" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" /> WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-[#141414]/10 dark:border-[#e4e3e0]/10 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-40">
          <p>© 2026 Privacy Pro Labs // All Rights Reserved</p>
          <p>Designed for Digital Sovereignty</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#141414] dark:border-[#e4e3e0]/20 p-6 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_#141414] dark:hover:shadow-[4px_4px_0px_0px_#e4e3e0] transition-all cursor-default">
      <div className="mb-4 text-[#141414] dark:text-[#e4e3e0]">{icon}</div>
      <h4 className="font-bold text-xs uppercase tracking-widest mb-2">{title}</h4>
      <p className="text-xs opacity-60 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-8 group">
      <span className="text-5xl font-bold text-[#141414]/10 dark:text-[#e4e3e0]/10 group-hover:text-[#141414] dark:group-hover:text-[#e4e3e0] transition-colors duration-500">{number}</span>
      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest mb-2">{title}</h4>
        <p className="text-sm opacity-60 leading-relaxed max-w-md">{desc}</p>
      </div>
    </div>
  );
}
