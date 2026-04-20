import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Mic, Volume2, 
  Bot, User, Sparkles, Loader2, Maximize2, 
  Minimize2, VolumeX, BrainCircuit
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRuralMode } from '../context/RuralModeContext';

export default function ArogyaMitra() {
  const { t, i18n } = useTranslation();
  const { isRuralMode } = useRuralMode();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste! I am your Arogya Mitra AI. How can I help you with your health today?', time: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollRef = useRef(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, lang: i18n.language })
      });
      const data = await response.json();
      
      const botMsg = { role: 'assistant', text: data.reply, time: new Date() };
      setMessages(prev => [...prev, botMsg]);
      if (isSpeaking) speak(data.reply);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'I am sorry, I am having trouble connecting right now. Please try again.', time: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const speak = (text) => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === 'en' ? 'en-US' : (i18n.language === 'hi' ? 'hi-IN' : 'en-IN');
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'en' ? 'en-US' : (i18n.language === 'hi' ? 'hi-IN' : 'en-IN');
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* ── CHAT WINDOW ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`glass-card mb-4 flex flex-col overflow-hidden shadow-2xl border-white/10 shadow-primary/10 ${
              isExpanded ? 'w-[calc(100vw-48px)] h-[calc(100vh-120px)] sm:w-[500px] sm:h-[700px]' : 'w-[calc(100vw-32px)] h-[500px] sm:w-[400px] sm:h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center animate-glow">
                  <BrainCircuit className="w-6 h-6 text-dark-900" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                    AROGYA MITRA
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </h3>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Local AI · Healthcare Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="p-2 text-white/40 hover:text-white rounded-lg transition-colors hidden sm:block"
                >
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-white/40 hover:text-red-400 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 medical-grid bg-white/[0.01]"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-primary/20 text-primary'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-indigo-500 text-white font-medium rounded-tr-none shadow-lg shadow-indigo-500/10' 
                        : 'bg-white/5 border border-white/5 text-white/90 rounded-tl-none backdrop-blur-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="text-[10px] opacity-40 mt-2 text-right">
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Mitra is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/[0.03] border-t border-white/5">
              <div className="flex items-center gap-2 bg-dark-900 border border-white/10 rounded-2xl p-2 px-3 focus-within:border-primary/50 transition-all">
                <button 
                  onClick={startListening}
                  className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-white/40 hover:text-primary hover:bg-white/5'}`}
                >
                  <Mic size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isRuralMode ? 'Talk to me...' : "Type your health concern..."}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/20 text-sm font-medium h-10"
                />
                <button 
                  onClick={() => speak(messages[messages.length-1].text)}
                  className={`p-2 rounded-xl transition-all ${isSpeaking ? 'text-primary' : 'text-white/40 hover:text-primary'}`}
                >
                  {isSpeaking ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
                </button>
                <button 
                  onClick={handleSend}
                  className="w-10 h-10 bg-primary text-dark-900 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOGGLE BUTTON ────────────────────────────────── */}
      <motion.button
        layoutId="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shadow-2xl relative group overflow-hidden ${isOpen ? 'rotate-90' : ''}`}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="text-dark-900 w-8 h-8" /> : <BrainCircuit className="text-dark-900 w-8 h-8 font-black" />}
        {!isOpen && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.3 }}
            transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
            className="absolute inset-0 bg-white rounded-2xl"
          />
        )}
      </motion.button>
    </div>
  );
}
