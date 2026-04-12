import React, { useState } from 'react';
import { Search, MoreVertical, MessageSquare, Phone, Video, Paperclip, Smile, Mic, Send, User, CheckCheck } from 'lucide-react';

interface WhatsAppDemoProps {
  settings: {
    blurMessages: boolean;
    blurPhotos: boolean;
    blurNames: boolean;
    blurPreviews: boolean;
    blurIntensity: number;
    privateContacts: string[];
    incognitoRead: boolean;
  };
}

export default function WhatsAppDemo({ settings }: WhatsAppDemoProps) {
  const [activeChat, setActiveChat] = useState(0);

  const chats = [
    { id: 0, name: 'John Doe', lastMsg: 'Hey, did you see the report?', time: '10:45 AM', photo: 'https://picsum.photos/seed/john/100/100', private: false },
    { id: 1, name: 'Secret Client', lastMsg: 'The contract is ready for signing.', time: '09:12 AM', photo: 'https://picsum.photos/seed/secret/100/100', private: true },
    { id: 2, name: 'Family Group', lastMsg: 'Mom: Dinner at 7?', time: 'Yesterday', photo: 'https://picsum.photos/seed/family/100/100', private: false },
    { id: 3, name: 'Project X', lastMsg: 'Alice: We need to push the update.', time: 'Yesterday', photo: 'https://picsum.photos/seed/project/100/100', private: false },
  ];

  const messages = [
    { id: 1, text: 'Hello! How are you?', time: '10:40 AM', sent: false },
    { id: 2, text: 'I am doing great, thanks for asking!', time: '10:41 AM', sent: true },
    { id: 3, text: 'Did you finish the privacy extension?', time: '10:42 AM', sent: false },
    { id: 4, text: 'Yes, it is almost ready. Just testing the blur features.', time: '10:43 AM', sent: true },
    { id: 5, text: 'Great! Can you show me a preview?', time: '10:44 AM', sent: false },
  ];

  const blurStyle = { '--blur-intensity': `${settings.blurIntensity}px` } as React.CSSProperties;

  return (
    <div className="flex h-[600px] w-full max-w-5xl bg-[#f0f2f5] rounded-xl overflow-hidden shadow-2xl border border-zinc-200" style={blurStyle}>
      {/* Sidebar */}
      <div className="w-[350px] bg-white border-r border-zinc-200 flex flex-col">
        <header className="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-zinc-200">
          <div className="w-10 h-10 rounded-full bg-zinc-300 overflow-hidden">
            <img src="https://picsum.photos/seed/me/100/100" alt="Me" referrerPolicy="no-referrer" />
          </div>
          <div className="flex gap-4 text-zinc-500">
            <MessageSquare className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </header>

        <div className="p-2">
          <div className="bg-[#f0f2f5] rounded-lg flex items-center px-3 py-1.5 gap-4">
            <Search className="w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search or start new chat" className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-center px-3 py-3 gap-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors ${activeChat === chat.id ? 'bg-[#f0f2f5]' : ''}`}
            >
              <div className="relative">
                <div 
                  className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-300 ${settings.blurPhotos || (chat.private && settings.privateContacts.includes(chat.name)) ? 'blur-dynamic' : ''}`}
                >
                  <img src={chat.photo} alt={chat.name} referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="flex-1 border-b border-zinc-100 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 
                    className={`font-medium text-sm transition-all duration-300 ${settings.blurNames || (chat.private && settings.privateContacts.includes(chat.name)) ? 'blur-dynamic' : ''}`}
                  >
                    {chat.name}
                  </h3>
                  <span className="text-[10px] text-zinc-500">{chat.time}</span>
                </div>
                <p 
                  className={`text-xs text-zinc-500 truncate transition-all duration-300 ${settings.blurPreviews ? 'blur-dynamic' : ''}`}
                >
                  {chat.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#efeae2] relative">
        {/* Chat Background Pattern */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("https://wweb.dev/assets/whatsapp-chat-bg.png")' }} />

        <header className="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-zinc-200 z-10">
          <div className="flex items-center gap-3">
            <div 
              className={`w-10 h-10 rounded-full overflow-hidden ${settings.blurPhotos ? 'blur-dynamic' : ''}`}
            >
              <img src={chats[activeChat].photo} alt={chats[activeChat].name} referrerPolicy="no-referrer" />
            </div>
            <div>
              <h3 
                className={`font-medium text-sm ${settings.blurNames ? 'blur-dynamic' : ''}`}
              >
                {chats[activeChat].name}
              </h3>
              <p className="text-[10px] text-zinc-500">online</p>
            </div>
          </div>
          <div className="flex gap-6 text-zinc-500">
            <Video className="w-5 h-5" />
            <Phone className="w-5 h-5" />
            <Search className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[60%] p-2 rounded-lg shadow-sm relative group transition-all duration-300 ${msg.sent ? 'bg-[#d9fdd3]' : 'bg-white'}`}
              >
                <p 
                  className={`text-sm text-zinc-800 mb-1 transition-all duration-300 group-hover:filter-none ${settings.blurMessages ? 'blur-dynamic' : ''}`}
                >
                  {msg.text}
                </p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[9px] text-zinc-500">{msg.time}</span>
                  {msg.sent && (
                    <CheckCheck 
                      className={`w-3 h-3 transition-colors ${settings.incognitoRead ? 'text-zinc-400' : 'text-[#53bdeb]'}`} 
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="h-[60px] bg-[#f0f2f5] px-4 flex items-center gap-4 z-10">
          <Smile className="w-6 h-6 text-zinc-500" />
          <Paperclip className="w-6 h-6 text-zinc-500" />
          <div className="flex-1 bg-white rounded-lg px-4 py-2">
            <input type="text" placeholder="Type a message" className="w-full text-sm outline-none" />
          </div>
          <Mic className="w-6 h-6 text-zinc-500" />
        </footer>
      </div>
    </div>
  );
}
