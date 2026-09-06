import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Compass,
  CheckCircle2,
  Ticket,
  Calendar,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { useAIChat } from '@/hooks/useAIChat';
import './AIAssistant.css';

// ── Suggested commands ──────────────────────────────────────────────────
const SUGGESTIONS = [
  { label: '🎙️ Voice Register', message: 'Register me for BLACKOUT Hackathon' },
  { label: 'Open Events', message: 'Open Events' },
  { label: 'Meet the Team', message: 'Meet the Team' },
  { label: 'Join GDGC', message: 'Take me to Join GDGC' },
];

// ── Status labels ───────────────────────────────────────────────────────
const STATUS_LABELS = {
  idle: 'Online',
  thinking: 'Thinking…',
  executing: 'Navigating…',
  success: 'Ready',
  error: 'Reconnecting…',
};

// ── Animation variants ──────────────────────────────────────────────────
const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 28,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    filter: 'blur(8px)',
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

const buttonVariants = {
  idle: {
    y: [0, -3, 0],
    transition: {
      y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
    },
  },
  hover: {
    scale: 1.1,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
  tap: {
    scale: 0.93,
    transition: { type: 'spring', stiffness: 500, damping: 20 },
  },
};

// ── Speech Recognition Helper ───────────────────────────────────────────
const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// ── Component ───────────────────────────────────────────────────────────

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, status, sendMessage, clearMessages } = useAIChat();
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceNotice, setVoiceNotice] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, status, liveTranscript]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle send message
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInputValue('');
    setLiveTranscript('');
  }, [inputValue, sendMessage]);

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // Handle suggestion click
  const handleSuggestion = useCallback(
    (msg) => {
      sendMessage(msg);
    },
    [sendMessage]
  );

  // Stop voice recognition on unmount or close
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // ── Voice Input Handler ───────────────────────────────────────────────
  const toggleListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setVoiceNotice('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      setTimeout(() => setVoiceNotice(null), 5000);
      return;
    }

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
        setVoiceNotice(null);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        const currentText = final || interim;
        setLiveTranscript(currentText);
        setInputValue(currentText);

        // Auto-send when final speech transcript completes
        if (final && final.trim()) {
          setTimeout(() => {
            sendMessage(final.trim());
            setInputValue('');
            setLiveTranscript('');
            setIsListening(false);
          }, 600);
        }
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err.error);
        setIsListening(false);
        if (err.error === 'not-allowed') {
          setVoiceNotice('Microphone permission was denied. Please allow microphone access in your browser.');
        } else if (err.error !== 'no-speech') {
          setVoiceNotice('Voice recognition encountered an error. Please try again.');
        }
        setTimeout(() => setVoiceNotice(null), 5000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setVoiceNotice('Unable to start voice recognition.');
      setTimeout(() => setVoiceNotice(null), 4000);
    }
  }, [isListening, sendMessage]);

  const isProcessing = status === 'thinking' || status === 'executing';
  const statusDotClass =
    status === 'thinking' || status === 'executing'
      ? 'thinking'
      : status === 'error'
      ? 'error'
      : '';

  return (
    <>
      {/* ── Floating AI Button ─────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="gdgc-ai-btn"
            variants={buttonVariants}
            initial="idle"
            animate="idle"
            whileHover="hover"
            whileTap="tap"
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
            onClick={() => setIsOpen(true)}
            aria-label="Open GDGC AI Assistant"
            title="GDGC AI Assistant"
          >
            <Sparkles />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Assistant Panel ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            className="gdgc-ai-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label="GDGC AI Navigation Assistant"
            aria-modal="false"
          >
            {/* Header */}
            <div className="gdgc-ai-header">
              <div className="gdgc-ai-header-left">
                <div className="gdgc-ai-logo" aria-hidden="true">
                  <Sparkles />
                </div>
                <div>
                  <div className="gdgc-ai-title">GDGC AI</div>
                  <div className="gdgc-ai-subtitle">
                    <span
                      className={`gdgc-ai-status-dot ${statusDotClass}`}
                      aria-hidden="true"
                    />
                    <span>{STATUS_LABELS[status]}</span>
                  </div>
                </div>
              </div>
              <button
                className="gdgc-ai-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="gdgc-ai-messages" role="log" aria-live="polite">
              {messages.length === 0 ? (
                <WelcomeState onSuggestion={handleSuggestion} />
              ) : (
                <>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`gdgc-ai-msg ${msg.role}`}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="gdgc-ai-msg-avatar" aria-hidden="true">
                        {msg.role === 'user' ? <User /> : <Bot />}
                      </div>
                      <div className="gdgc-ai-msg-content-wrapper">
                        <div className="gdgc-ai-msg-bubble">{msg.content}</div>

                        {/* Registration Ticket Preview */}
                        {msg.registration && (
                          <motion.div
                            className="gdgc-ai-ticket-card"
                            initial={{ opacity: 0, scale: 0.95, y: 6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="gdgc-ai-ticket-top">
                              <div className="gdgc-ai-ticket-badge">
                                <Ticket size={14} />
                                <span>Confirmed Ticket</span>
                              </div>
                              <span className="gdgc-ai-ticket-status">
                                <CheckCircle2 size={13} className="text-emerald-500" />
                                Auto-Registered
                              </span>
                            </div>

                            <div className="gdgc-ai-ticket-title">
                              {msg.registration.eventName || 'GDGC Flagship Event'}
                            </div>

                            <div className="gdgc-ai-ticket-details">
                              {msg.registration.name && (
                                <div className="gdgc-ai-ticket-field">
                                  <User size={13} />
                                  <span>{msg.registration.name}</span>
                                </div>
                              )}
                              {msg.registration.email && (
                                <div className="gdgc-ai-ticket-field">
                                  <Mail size={13} />
                                  <span>{msg.registration.email}</span>
                                </div>
                              )}
                              <div className="gdgc-ai-ticket-field">
                                <Calendar size={13} />
                                <span>Official GDGC Calendar</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isProcessing && (
                    <motion.div
                      className="gdgc-ai-typing"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      aria-label={STATUS_LABELS[status]}
                    >
                      <span className="gdgc-ai-typing-dot" />
                      <span className="gdgc-ai-typing-dot" />
                      <span className="gdgc-ai-typing-dot" />
                    </motion.div>
                  )}

                  {/* Quick suggestions after messages */}
                  {!isProcessing && messages.length > 0 && messages.length < 6 && (
                    <motion.div
                      className="gdgc-ai-suggestions"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {SUGGESTIONS.slice(0, 3).map((s) => (
                        <button
                          key={s.label}
                          className="gdgc-ai-suggestion"
                          onClick={() => handleSuggestion(s.message)}
                          disabled={isProcessing}
                        >
                          {s.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Notice (e.g. mic permission warning) */}
            {voiceNotice && (
              <motion.div
                className="gdgc-ai-voice-notice"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
              >
                <AlertCircle size={14} />
                <span>{voiceNotice}</span>
              </motion.div>
            )}

            {/* Live Voice Transcript Indicator */}
            {isListening && (
              <motion.div
                className="gdgc-ai-live-transcript-bar"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="gdgc-ai-voice-equalizer">
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                </div>
                <div className="gdgc-ai-transcript-text">
                  <span className="label">Live Voice Transcript: </span>
                  <span className="text">
                    {liveTranscript || 'Listening for event & credentials…'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="gdgc-ai-input-area">
              <div className="gdgc-ai-input-row">
                <input
                  ref={inputRef}
                  className="gdgc-ai-input"
                  type="text"
                  placeholder={
                    isListening
                      ? 'Listening to your voice…'
                      : 'Ask to navigate or voice register…'
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing}
                  aria-label="Type or speak a message for GDGC AI"
                  autoComplete="off"
                  maxLength={500}
                />

                {/* Microphone / Voice Recognition Button */}
                <button
                  className={`gdgc-ai-mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={toggleListening}
                  aria-label={isListening ? 'Stop voice listening' : 'Start voice transcript input'}
                  title={isListening ? 'Stop listening' : 'Speak to register or navigate'}
                  type="button"
                >
                  {isListening ? <MicOff /> : <Mic />}
                </button>

                {/* Send Button */}
                <button
                  className="gdgc-ai-input-btn"
                  onClick={handleSend}
                  disabled={isProcessing || !inputValue.trim()}
                  aria-label="Send message"
                  type="button"
                >
                  <Send />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Welcome sub-component ───────────────────────────────────────────────

function WelcomeState({ onSuggestion }) {
  return (
    <div className="gdgc-ai-welcome">
      <motion.div
        className="gdgc-ai-welcome-icon"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
      >
        <Compass />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        GDGC Navigation & Voice Agent
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Navigate anywhere on the website or tap the 🎙️ mic to auto-register for events via live voice transcript!
      </motion.p>
      <motion.div
        className="gdgc-ai-welcome-suggestions"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            className="gdgc-ai-suggestion"
            onClick={() => onSuggestion(s.message)}
          >
            {s.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
