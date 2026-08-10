import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Send, Trash2, BookOpen, Lightbulb, HelpCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import tutorService from '../../services/tutorService';
import { Button } from '../common/Button';

export const TutorChatPanel = ({ isOpen, onClose, onMinimize }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('adaptiveAI_tutor_history');
    return saved ? JSON.parse(saved) : [{
      id: 'welcome',
      role: 'ai',
      content: "Hi! 👋 I'm your AdaptiveAI Tutor.\n\nAsk me any academic or CSE-related doubt and I'll explain it clearly with examples.",
      timestamp: new Date().toISOString()
    }];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('adaptiveAI_tutor_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (text = input, role = 'user') => {
    if (!text.trim() || isLoading) return;
    
    const userMessage = { id: Date.now().toString(), role, content: text, timestamp: new Date().toISOString() };
    const newHistory = [...messages, userMessage];
    
    if (role === 'user') {
      setMessages(newHistory);
      setInput('');
    }

    setIsLoading(true);
    
    try {
      // Format history for backend
      const backendHistory = newHistory
        .filter(m => m.id !== 'welcome') // Remove welcome message from context
        .map(m => ({ role: m.role === 'ai' ? 'model' : 'user', content: m.content }));
        
      const response = await tutorService.askDoubt(backendHistory);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.answer,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "⚠️ Sorry, I couldn't process that right now. Please try again.",
        isError: true,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear this conversation?")) {
      setMessages([{
        id: 'welcome',
        role: 'ai',
        content: "Hi! 👋 I'm your AdaptiveAI Tutor.\n\nAsk me any academic or CSE-related doubt and I'll explain it clearly with examples.",
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleAction = (actionType) => {
    let prompt = '';
    switch(actionType) {
      case 'simpler': prompt = "Can you explain that again in a much simpler, beginner-friendly way using an analogy?"; break;
      case 'example': prompt = "Can you give me a practical, simple example of this?"; break;
      case 'quiz': prompt = "Can you give me a quick multiple-choice quiz question to test my understanding of this?"; break;
      default: return;
    }
    handleSend(prompt, 'user');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-32px)] h-[550px] max-h-[calc(100vh-120px)] bg-white dark:bg-[#0f141e] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col z-[100] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a2234]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-mint/20 flex items-center justify-center border border-mint/30">
              <span className="text-sm">✨</span>
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 dark:border-[#1a2234] border-gray-50"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AdaptiveAI Tutor</h3>
            <span className="text-[10px] text-primary-600 dark:text-primary-300 font-medium">● Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <button onClick={clearChat} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors" title="Clear Chat">
            <Trash2 size={16} />
          </button>
          <button onClick={onMinimize} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors" title="Minimize">
            <Minus size={16} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400 rounded-md transition-colors" title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
            >
              <div className={`p-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-sm' 
                  : msg.isError 
                    ? 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-200 border border-red-200 dark:border-red-500/30 rounded-tl-sm'
                    : 'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-tl-sm'
              }`}>
                {msg.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="text-sm prose prose-sm prose-slate dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-800 dark:prose-pre:bg-[#1a2234] prose-pre:border prose-pre:border-gray-700 dark:prose-pre:border-white/10 max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
              
              {/* Quick Actions (only show on last AI message if not loading) */}
              {msg.role === 'ai' && !msg.isError && i === messages.length - 1 && !isLoading && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={() => handleAction('simpler')} className="text-[11px] bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-2 py-1 rounded-full text-primary-600 dark:text-primary-300 flex items-center gap-1 transition-colors">
                    <BookOpen size={12} /> Explain Simpler
                  </button>
                  <button onClick={() => handleAction('example')} className="text-[11px] bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-2 py-1 rounded-full text-teal-600 dark:text-mint flex items-center gap-1 transition-colors">
                    <Lightbulb size={12} /> Give Example
                  </button>
                  <button onClick={() => handleAction('quiz')} className="text-[11px] bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-2 py-1 rounded-full text-purple-600 dark:text-purple-300 flex items-center gap-1 transition-colors">
                    <HelpCircle size={12} /> Quiz Me
                  </button>
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary-600 dark:text-mint animate-spin" />
              <span className="text-xs text-gray-500 dark:text-gray-400">AdaptiveAI is thinking...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#13192b]">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your doubt..."
            disabled={isLoading}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all disabled:opacity-50 shadow-sm dark:shadow-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
