import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Send, Trash2, BookOpen, Lightbulb, HelpCircle, Loader2, Mic, Volume2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import tutorService from '../../services/tutorService';
import { Button } from '../common/Button';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSettings } from '../../hooks/useSettings';

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
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState(null);
  const [wasVoiceInitiated, setWasVoiceInitiated] = useState(false);
  const messagesEndRef = useRef(null);

  const { settings } = useSettings();
  const voiceSettings = settings?.voice || { inputEnabled: true, responsesEnabled: true, language: 'en-US' };

  const { speak, stop: stopSpeech, isSpeaking } = useSpeechSynthesis();

  const handleSpeechResult = ({ transcript, isFinal }) => {
    if (isFinal) {
      setInput(transcript);
      setWasVoiceInitiated(true);
      // Automatically send if it's a final result
      setTimeout(() => {
        handleSend(transcript, 'user', true);
      }, 300);
    } else {
      setInput(transcript);
    }
  };

  const { isListening, isSupported: isSpeechSupported, startListening, stopListening } = useSpeechRecognition({
    language: voiceSettings.language,
    onResult: handleSpeechResult
  });

  useEffect(() => {
    if (!isSpeaking) {
      setActiveSpeechMsgId(null);
    }
  }, [isSpeaking]);

  useEffect(() => {
    localStorage.setItem('adaptiveAI_tutor_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeech();
    };
  }, [stopListening, stopSpeech]);

  const handleSend = async (text = input, role = 'user', fromVoice = false) => {
    if (!text.trim() || isLoading) return;
    
    // Stop any ongoing speech when sending a new message
    stopSpeech();

    const userMessage = { id: Date.now().toString(), role, content: text, timestamp: new Date().toISOString() };
    const newHistory = [...messages, userMessage];
    
    if (role === 'user') {
      setMessages(newHistory);
      setInput('');
      if (!fromVoice) {
         setWasVoiceInitiated(false);
      }
    }

    setIsLoading(true);
    
    try {
      // Format history for backend
      const backendHistory = newHistory
        .filter(m => m.id !== 'welcome') // Remove welcome message from context
        .map(m => ({ role: m.role === 'ai' ? 'model' : 'user', content: m.content }));
        
      const response = await tutorService.askDoubt(backendHistory);
      
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'ai',
        content: response.answer,
        timestamp: new Date().toISOString()
      }]);

      // Auto-speak if it was voice initiated or if responses are always enabled
      if (voiceSettings.responsesEnabled && (fromVoice || wasVoiceInitiated)) {
        setTimeout(() => {
           speak(response.answer, voiceSettings.language);
           setActiveSpeechMsgId(aiMsgId);
        }, 100);
      }
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
      className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-32px)] h-[550px] max-h-[calc(100vh-120px)] bg-black border border-gray-800 rounded-2xl shadow-2xl flex flex-col z-[100] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-mint/20 flex items-center justify-center border border-mint/30">
              <span className="text-sm">✨</span>
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 dark:border-[#1a2234] border-gray-50"></div>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">AdaptiveAI Tutor</h3>
            <span className="text-[10px] text-primary-600 dark:text-primary-300 font-medium">● Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <button onClick={clearChat} className="p-1.5 hover:bg-white/10 rounded-md transition-colors" title="Clear Chat">
            <Trash2 size={16} />
          </button>
          <button onClick={onMinimize} className="p-1.5 hover:bg-white/10 rounded-md transition-colors" title="Minimize">
            <Minus size={16} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors" title="Close">
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
                    ? 'bg-red-900/30 text-red-200 border border-red-500/30 rounded-tl-sm'
                    : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm'
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
              {msg.role === 'ai' && !msg.isError && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {i === messages.length - 1 && !isLoading && (
                      <>
                        <button onClick={() => handleAction('simpler')} className="text-[11px] bg-gray-900 hover:bg-gray-800 border border-gray-800 px-2 py-1 rounded-full text-primary-400 flex items-center gap-1 transition-colors">
                          <BookOpen size={12} /> Explain Simpler
                        </button>
                        <button onClick={() => handleAction('example')} className="text-[11px] bg-gray-900 hover:bg-gray-800 border border-gray-800 px-2 py-1 rounded-full text-mint flex items-center gap-1 transition-colors">
                          <Lightbulb size={12} /> Give Example
                        </button>
                        <button onClick={() => handleAction('quiz')} className="text-[11px] bg-gray-900 hover:bg-gray-800 border border-gray-800 px-2 py-1 rounded-full text-purple-400 flex items-center gap-1 transition-colors">
                          <HelpCircle size={12} /> Quiz Me
                        </button>
                      </>
                    )}
                    
                    {/* Speaker Button */}
                    <button 
                      onClick={() => {
                        if (activeSpeechMsgId === msg.id && isSpeaking) {
                          stopSpeech();
                          setActiveSpeechMsgId(null);
                        } else {
                          speak(msg.content, voiceSettings.language);
                          setActiveSpeechMsgId(msg.id);
                        }
                      }}
                      className={`text-[11px] border px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${
                        activeSpeechMsgId === msg.id && isSpeaking 
                          ? 'bg-red-900/30 border-red-500/30 text-red-400 hover:bg-red-900/50' 
                          : 'bg-gray-900 hover:bg-gray-800 border-gray-800 text-gray-400 hover:text-white'
                      }`}
                      aria-label={activeSpeechMsgId === msg.id && isSpeaking ? "Stop speech" : "Read answer aloud"}
                    >
                      {activeSpeechMsgId === msg.id && isSpeaking ? (
                         <><Square size={10} className="fill-current" /> Stop Speaking</>
                      ) : (
                         <><Volume2 size={12} /> Speak</>
                      )}
                    </button>
                  </div>
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
      <div className="p-3 border-t border-gray-800 bg-black flex flex-col gap-2">
        {isListening && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-red-400 text-xs px-2"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            Listening...
          </motion.div>
        )}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your doubt..."
              disabled={isLoading || isListening}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isListening}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          
          {voiceSettings.inputEnabled && isSpeechSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : () => startListening(voiceSettings.language)}
              disabled={isLoading}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800'
              } disabled:opacity-50`}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
            >
              <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
            </button>
          )}
        </form>
      </div>
    </motion.div>
  );
};
