'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const mockStudentProfile = {
  cutoff: 187.5,
  community: 'BC',
  district: 'Chennai',
  branch: 'CSE',
};

export default function AISupportPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch profile
    fetch('/api/student/profile')
      .then(res => res.json())
      .then(data => {
        if (data && data.profile) {
          setStudentProfile({
            cutoff: data.profile.percentage || 190,
            community: data.profile.category || 'BC',
          });
        } else {
          setStudentProfile({ cutoff: 190, community: 'BC' });
        }
      })
      .catch(() => setStudentProfile({ cutoff: 190, community: 'BC' }));
  }, []);

  useEffect(() => {
    if (!studentProfile) return;

    const savedMessages = localStorage.getItem('tnea_ai_chat');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        setInitialGreeting(studentProfile);
      }
    } else {
      setInitialGreeting(studentProfile);
    }
  }, [language, studentProfile]);

  const setInitialGreeting = (profile: any) => {
    setMessages([
      { 
        id: 'init-1', 
        text: language === 'TA' ? `வணக்கம்! நான் உங்கள் TNEA செயற்கை நுண்ணறிவு உதவியாளர். உங்கள் கட்-ஆஃப் ${profile.cutoff} மற்றும் சமூகம் ${profile.community} அடிப்படையில் நான் உங்களுக்கு உதவ முடியும். என்ன உதவி வேண்டும்?` : `Hello! I'm your TNEA AI Assistant. I can help you based on your profile (Cutoff: ${profile.cutoff}, Community: ${profile.community}). How can I assist you today?`, 
        sender: 'bot', 
        timestamp: new Date() 
      }
    ]);
  };

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('tnea_ai_chat', JSON.stringify(messages));
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/student/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, language })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'TA' ? 'சேவையக பிழை. மீண்டும் முயற்சிக்கவும்.' : 'Server error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem('tnea_ai_chat');
    setInitialGreeting(studentProfile || { cutoff: 190, community: 'BC' });
  };

  const suggestions = [
    language === 'TA' ? 'எனது கட்-ஆஃப்க்கு சிறந்த கல்லூரிகள்?' : 'Suggest colleges for my cutoff',
    language === 'TA' ? 'கல்லூரி தேர்வுக்கு உதவுங்கள்' : 'Help with choice filling',
    language === 'TA' ? 'CSE க்கு சிறந்த கல்லூரிகள்' : 'Best colleges for CSE',
    language === 'TA' ? 'குறைந்த கட்டண கல்லூரிகள்' : 'Low fees colleges'
  ];

  return (
    <div className="flex justify-center items-center h-[calc(100vh-140px)] w-full">
      <div className="w-full max-w-3xl glass-panel rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[90%] relative overflow-hidden bg-[#111827]/80 backdrop-blur-2xl">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/20 rounded-xl text-secondary border border-secondary/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {t('AI Support')} <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full border border-secondary/30 uppercase tracking-wider">Beta</span>
              </h2>
              <p className="text-xs text-on-surface-variant">Context-aware TNEA Assistant</p>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-on-surface-variant hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Clear Chat History"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] border-[#7C3AED]/50 text-white' 
                      : 'bg-[#111827] border-white/10 text-secondary'
                  }`}>
                    {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={`p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white rounded-tr-sm shadow-[0_4px_15px_rgba(79,70,229,0.3)]' 
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] mt-2 block ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111827] border border-white/10 text-secondary flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm flex items-center gap-1.5 h-10">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-white/10 bg-black/20 relative z-10">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar mb-4 pb-2">
            {suggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="whitespace-nowrap px-4 py-2 text-xs bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-full transition-colors font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('Ask anything about TNEA counselling...')}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all placeholder:text-gray-600 shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-secondary hover:bg-secondary/90 text-[#070B1A] px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center shadow-[0_0_20px_rgba(251,146,60,0.3)]"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
