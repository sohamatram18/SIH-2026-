import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { jagoAPI } from '../services/api.js';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowUpRight, 
  CornerDownLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

export const JagoChatDrawer = ({ isOpen, onClose }) => {
  const { currentLanguage, t } = useLanguage();
  const { student } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: t('jagoGreeting'),
      actionButtons: [
        { label: 'Check All Schemes', action: '/schemes', type: 'NAVIGATE' },
        { label: 'Document Wallet', action: '/wallet', type: 'NAVIGATE' },
        { label: 'DBT Payment Status', action: '/payments', type: 'NAVIGATE' },
      ],
      suggestedFollowUps: [
        'What are the 5 MoTA scholarship schemes?',
        'How does the One-Scholarship rule work?',
        'What is the income limit for Top Class scholarship?',
      ],
      timestamp: new Date(),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load starter suggestions
  useEffect(() => {
    if (isOpen) {
      jagoAPI.getSuggestions().then((res) => {
        if (res.data?.success && res.data.suggestions) {
          setSuggestions(res.data.suggestions);
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  // Handle Speech-to-Text (STT)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      const langMap = {
        en: 'en-IN',
        hi: 'hi-IN',
        or: 'or-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        te: 'te-IN',
      };
      recognition.lang = langMap[currentLanguage] || 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLanguage]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('STT Start Error:', err);
      }
    }
  };

  // Handle Text-to-Speech (TTS) Readout
  const handleSpeakText = (msgId, text) => {
    if (!window.speechSynthesis) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#•`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      te: 'te-IN',
      or: 'hi-IN',
    };
    utterance.lang = langMap[currentLanguage] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend = null) => {
    const query = textToSend || inputVal;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const res = await jagoAPI.query({
        message: query,
        language: currentLanguage,
      });

      if (res.data.success) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: res.data.response,
          actionButtons: res.data.actionButtons || [],
          suggestedFollowUps: res.data.suggestedFollowUps || [],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I encountered an issue connecting to the MoTA AI server. Please try again or check your network connection.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionButton = (btn) => {
    if (btn.type === 'NAVIGATE') {
      onClose();
      navigate(btn.action);
    } else if (btn.type === 'LINK') {
      window.location.href = btn.action;
    } else if (btn.action === 'OPEN_ELIGIBILITY_CHECKER') {
      onClose();
      navigate('/');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gov-navy to-slate-900 text-white p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-gov-navy flex items-center justify-center font-black shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">JAGO (जागो) AI Assistant</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </span>
              </div>
              <p className="text-[11px] text-amber-300">
                Ministry of Tribal Affairs • Jan Jatiya Sahayak
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Prompt Chips */}
        {suggestions.length > 0 && messages.length <= 2 && (
          <div className="bg-slate-50 border-b border-slate-200 p-2.5 overflow-x-auto flex gap-1.5 no-scrollbar">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition flex-shrink-0 shadow-2xs"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-4 shadow-xs space-y-2.5 ${
                  m.sender === 'user'
                    ? 'bg-gov-navy text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                }`}
              >
                {/* Message Header / Icon */}
                <div className="flex items-center justify-between gap-2 text-[10px] opacity-70">
                  <span className="font-bold uppercase tracking-wider">
                    {m.sender === 'user' ? (student?.name || 'You') : 'JAGO Assistant'}
                  </span>
                  {m.sender === 'bot' && (
                    <button
                      onClick={() => handleSpeakText(m.id, m.text)}
                      className={`p-1 rounded-md transition ${
                        speakingId === m.id
                          ? 'text-amber-600 bg-amber-50 animate-pulse'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title={speakingId === m.id ? 'Stop Speaking' : 'Read Aloud'}
                    >
                      {speakingId === m.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* Message Text with simple markdown formatting */}
                <div className="text-xs leading-relaxed whitespace-pre-line">
                  {m.text}
                </div>

                {/* Interactive Action Buttons */}
                {m.actionButtons && m.actionButtons.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {m.actionButtons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={() => handleActionButton(btn)}
                        className="bg-gov-blue hover:bg-gov-navy text-white text-[11px] font-bold px-2.5 py-1 rounded-xl transition flex items-center gap-1 shadow-xs"
                      >
                        <span>{btn.label}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-up Question Chips */}
              {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                <div className="mt-2 ml-1 flex flex-wrap gap-1">
                  {m.suggestedFollowUps.map((fu, fuIdx) => (
                    <button
                      key={fuIdx}
                      onClick={() => handleSendMessage(fu)}
                      className="bg-white hover:bg-slate-100 text-gov-blue text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-200 transition"
                    >
                      💡 {fu}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
              <span>JAGO is searching MoTA rules...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Listening Banner */}
        {isListening && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-slate-950" />
              <span>{t('speakNow')}</span>
            </div>
            <button
              onClick={toggleVoiceInput}
              className="text-[11px] bg-slate-950 text-white px-2 py-0.5 rounded-md"
            >
              Stop
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={t('typePlaceholder')}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-gov-blue"
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1 rounded-xl transition ${
                  isListening
                    ? 'text-amber-600 bg-amber-100 animate-pulse'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Voice Input (STT)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className="bg-gov-navy hover:bg-slate-800 text-white p-2.5 rounded-2xl transition disabled:opacity-40 shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="text-[10px] text-center text-slate-400">
            Powered by MoTA Knowledge Engine • Voice & Multilingual Ready
          </div>
        </div>
      </div>
    </div>
  );
};

export default JagoChatDrawer;
