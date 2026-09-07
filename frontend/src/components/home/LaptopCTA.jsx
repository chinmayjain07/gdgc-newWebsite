import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowFillButton } from '@/components/ui/ArrowFillButton';
import {
  Sparkles,
  Terminal,
  Gift,
  Cpu,
  Users,
  Trophy,
  Copy,
  Check,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useContactForm, SUBJECT_OPTIONS } from '@/hooks/useContactForm';
import './LaptopCTA.css';

const TOTAL_FRAMES = 125;

const getFrameSrc = (index) => {
  const num = (index + 1).toString().padStart(4, '0');
  return `/laptop-frames/frame_${num}.avif`;
};

const PERKS = [
  {
    icon: Cpu,
    title: 'Google Cloud & AI Labs',
    desc: 'Hands-on credits & workshops with Gemini API, Vertex AI, and Google Cloud Platform.',
    color: '#4285F4',
  },
  {
    icon: Trophy,
    title: 'Flagship Hackathons',
    desc: 'Direct entry to national hackathons, mentorship from winners, and project incubators.',
    color: '#EA4335',
  },
  {
    icon: Users,
    title: 'Tech Mentorship Network',
    desc: '1-on-1 guidance from Google Developer Experts (GDEs), alumni, and senior engineers.',
    color: '#34A853',
  },
  {
    icon: Gift,
    title: 'Official Google Swag',
    desc: 'Earn exclusive GDG hoodies, dev kits, certificate credentials, and conference passes.',
    color: '#FBBC04',
  },
];

const LEADERSHIP_TEAM = [
  {
    name: 'Mayur Kharat',
    role: 'Chapter Lead',
    initials: 'MK',
    color: '#4285F4',
  },
  {
    name: 'Soumil Chandra',
    role: 'Co-Lead Organizer',
    initials: 'SC',
    color: '#EA4335',
  },
  {
    name: 'Sharvari Bangar',
    role: 'Co-Lead Organizer',
    initials: 'SB',
    color: '#34A853',
  },
];

const INITIAL_LOGS = [
  { id: 1, type: 'success', text: '✓ [SYSTEM] Connected to Google Developer Groups • PCCOE Chapter' },
  { id: 2, type: 'info', text: 'ℹ Platform: Linux / Node.js 20+ • Google Cloud SDK Active' },
  { id: 3, type: 'accent', text: '★ Status: Open for all engineering students & tech enthusiasts' },
];

export function LaptopCTA() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' | 'team' | 'terminal' | 'perks'
  const [copied, setCopied] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState(INITIAL_LOGS);
  const { formData, submitStatus, errorMessage, handleChange, handleSubmit } = useContactForm();

  // Sticky Scroll: Pins section to viewport while scroll scrubs through the 125 laptop frames
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Easter Egg Listener: Logo 3x spin redirects here, opens laptop, and switches to DevTerminal.sh
  useEffect(() => {
    const handleOpenTerminal = () => {
      setActiveTab('terminal');
      setTerminalLogs((prev) => {
        if (prev.some((l) => l.text.includes('DevTerminal.sh Unlocked'))) return prev;
        return [
          ...prev,
          {
            id: Date.now(),
            type: 'accent',
            text: '⚡ [EASTER EGG] 3x Logo Spin Triggered! DevTerminal.sh Unlocked.',
          },
          {
            id: Date.now() + 1,
            type: 'success',
            text: '✓ Connected to GDGC Developer Workstation. Ready for commands.',
          },
        ];
      });

      const container = containerRef.current || document.getElementById('cta-section');
      if (container) {
        const rect = container.getBoundingClientRect();
        const containerTop = window.scrollY + rect.top;
        const scrollableDistance = container.offsetHeight - window.innerHeight;
        const targetScrollY = containerTop + Math.max(0, scrollableDistance * 0.65);
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth',
        });
      }
    };

    window.addEventListener('gdgc:open-laptop-terminal', handleOpenTerminal);
    return () => window.removeEventListener('gdgc:open-laptop-terminal', handleOpenTerminal);
  }, []);

  // Map scroll progress to laptop frame progress (0.0 to 1.0)
  // - 0.00 -> 0.08: Resting closed (Photo 1)
  // - 0.08 -> 0.60: Smoothly scrubs frames 0 -> 124 (opening lid to 90 degrees)
  // - 0.60 -> 0.88: Fully open (Photo 2) for reading & tab interaction
  // - 0.88 -> 1.00: Unpins and smoothly scrolls down
  const rawFrameProgress = useTransform(
    scrollYProgress,
    [0, 0.08, 0.60, 0.88, 1.0],
    [0, 0, 1, 1, 1]
  );

  const frameProgress = useSpring(rawFrameProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });

  // Crossfade opacity for the screen display overlay
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.38, 0.58, 0.88, 1.0],
    [0, 0, 1, 1, 1]
  );

  // Closed laptop lid GDGC logo badge opacity
  // Fully visible when closed (0 -> 0.08), smoothly fades out as lid opens (0.08 -> 0.20)
  const lidLogoOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.20],
    [1, 1, 0]
  );

  const currentFrameRef = useRef(0);

  // Canvas Frame Rendering Engine
  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const images = new Array(TOTAL_FRAMES);

    const getNearestLoadedFrame = (targetIdx) => {
      if (images[targetIdx]?.complete) return images[targetIdx];
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const left = targetIdx - offset;
        if (left >= 0 && images[left]?.complete) return images[left];
        const right = targetIdx + offset;
        if (right < TOTAL_FRAMES && images[right]?.complete) return images[right];
      }
      return null;
    };

    const drawFrame = (index) => {
      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(index)));
      const img = getNearestLoadedFrame(idx);
      if (img && img.complete) {
        ctx.clearRect(0, 0, 1920, 1080);
        ctx.drawImage(img, 0, 0, 1920, 1080);
      }
    };

    // Preload frame 0 immediately for instant closed laptop render
    const frame0 = new Image();
    frame0.decoding = 'async';
    frame0.src = getFrameSrc(0);
    frame0.onload = () => {
      if (!isMounted) return;
      images[0] = frame0;
      drawFrame(0);

      // Preload remaining frames in background
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.src = getFrameSrc(i);
        img.onload = () => {
          if (!isMounted) return;
          images[i] = img;
          if (Math.round(currentFrameRef.current) === i) {
            drawFrame(i);
          }
        };
      }
    };

    // Subscribe to spring-animated frame progress on scroll
    const unsubscribe = frameProgress.on('change', (progress) => {
      const targetFrame = progress * (TOTAL_FRAMES - 1);
      currentFrameRef.current = targetFrame;
      drawFrame(targetFrame);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [frameProgress]);

  const handleCopyCommand = () => {
    navigator.clipboard?.writeText('npx gdgc-pccoe join');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCommand = (cmd) => {
    const timestamp = Date.now();
    if (cmd === 'domains') {
      setTerminalLogs((prev) => [
        ...prev.slice(-4),
        { id: timestamp, type: 'command', text: '$ gdgc domains' },
        {
          id: timestamp + 1,
          type: 'output',
          text: '→ WebDev • Cloud • AI/ML • UI/UX • CP • AR/VR • IoT • Flutter • Management • PR',
        },
      ]);
    } else if (cmd === 'events') {
      setTerminalLogs((prev) => [
        ...prev.slice(-4),
        { id: timestamp, type: 'command', text: '$ gdgc events' },
        {
          id: timestamp + 1,
          type: 'output',
          text: '→ Upcoming: BLACKOUT Flagship • DevFest 2024 • Cloud Study Jams • Hackathons',
        },
      ]);
    } else if (cmd === 'perks') {
      setTerminalLogs((prev) => [
        ...prev.slice(-4),
        { id: timestamp, type: 'command', text: '$ gdgc perks' },
        {
          id: timestamp + 1,
          type: 'output',
          text: '→ Google Cloud & Vertex AI credits • National Hackathons • Mentorship • Official Swag',
        },
      ]);
    } else if (cmd === 'clear') {
      setTerminalLogs(INITIAL_LOGS);
    }
  };

  return (
    <section
      ref={containerRef}
      id="cta-section"
      className="acm-laptop-section relative w-full h-[300vh]"
      aria-labelledby="cta-title"
    >
      {/* Sticky Viewport Container (Fixed at top-0 while scrolling with navbar clearance) */}
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden pt-16 lg:pt-20">
        {/* Soft Ambient Background Glow */}
        <div className="acm-ambient-glow" aria-hidden="true" />

        {/* 16:9 Laptop Canvas Stage */}
        <div className="acm-laptop-stage">
          {/* Photorealistic 3D Laptop Canvas (125 Frame Sequence) */}
          <canvas
            ref={canvasRef}
            className="acm-laptop-canvas"
            aria-label="3D Animated Laptop"
          />

          {/* GDGC Lid Logo Badge (replaces Apple logo when laptop is closed) */}
          <motion.div
            style={{ opacity: lidLogoOpacity }}
            className="closed-lid-gdgc-badge"
            aria-hidden="true"
          >
            <div className="lid-badge-surface">
              <img
                src="/GDGC-dark.png"
                alt="GDGC Logo"
                className="h-full w-auto object-contain pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Interactive Screen Display Overlay (Sits directly over the open laptop screen) */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="acm-screen-overlay"
          >
            {/* Screen Window Display */}
            <div className="acm-screen-inner">
              <div className="screen-reflection" aria-hidden="true" />

              {/* OS Window Header & Tabs */}
              <div className="screen-os-header">
                <div className="window-dots" aria-hidden="true">
                  <span className="dot dot-close" />
                  <span className="dot dot-minimize" />
                  <span className="dot dot-expand" />
                </div>

                {/* Workspace Tabs */}
                <div className="window-tabs-container">
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className={`screen-tab-btn ${activeTab === 'contact' ? 'screen-tab-btn--active' : ''}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
                    <span>contact.html</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('team')}
                    className={`screen-tab-btn ${activeTab === 'team' ? 'screen-tab-btn--active' : ''}`}
                  >
                    <Users className="w-3.5 h-3.5 text-[#4285F4]" />
                    <span>team.json</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('terminal')}
                    className={`screen-tab-btn ${activeTab === 'terminal' ? 'screen-tab-btn--active' : ''}`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#FBBC04]" />
                    <span>DevTerminal.sh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('perks')}
                    className={`screen-tab-btn ${activeTab === 'perks' ? 'screen-tab-btn--active' : ''}`}
                  >
                    <Gift className="w-3.5 h-3.5 text-[#34A853]" />
                    <span>MemberPerks.json</span>
                  </button>
                </div>

                {/* Live Online Status */}
                <div className="window-status">
                  <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                  <span className="hidden sm:inline">Connected</span>
                </div>
              </div>

              {/* Inside Screen Content */}
              <div className="screen-content">
                {/* Subtle Google Color Blobs */}
                <div className="screen-blobs" aria-hidden="true">
                  <span className="screen-blob blob-blue" />
                  <span className="screen-blob blob-red" />
                  <span className="screen-blob blob-green" />
                  <span className="screen-blob blob-yellow" />
                </div>

                {/* Tab 1: Condensed Contact Form (Default) */}
                <AnimatePresence mode="wait">
                  {activeTab === 'contact' && (
                    <motion.div
                      key="contact"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="laptop-contact-card"
                    >
                      <div className="laptop-contact-header">
                        <span className="laptop-badge">
                          <Sparkles className="w-3 h-3 text-[#EA4335]" />
                          <span>Get in Touch • PCCOE Chapter</span>
                        </span>
                        <h3 className="laptop-inner-title">
                          Send Us a <span className="title-gradient-accent">Message</span>
                        </h3>
                      </div>

                      <form onSubmit={handleSubmit} className="laptop-form">
                        <div className="laptop-form-grid">
                          <div className="laptop-input-wrap">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Full Name *"
                              className="laptop-input-field"
                              disabled={submitStatus === 'loading'}
                              required
                            />
                          </div>
                          <div className="laptop-input-wrap">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Email Address *"
                              className="laptop-input-field"
                              disabled={submitStatus === 'loading'}
                              required
                            />
                          </div>
                        </div>

                        <div className="laptop-form-grid">
                          <div className="laptop-input-wrap">
                            <select
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              className="laptop-input-field laptop-select-field"
                              disabled={submitStatus === 'loading'}
                            >
                              {SUBJECT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="laptop-input-wrap">
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="How can we help you? *"
                              rows={2}
                              className="laptop-input-field laptop-textarea-field"
                              disabled={submitStatus === 'loading'}
                              required
                            />
                          </div>
                        </div>

                        {/* Submission Feedback Alert */}
                        {submitStatus === 'error' && (
                          <div className="laptop-status-msg laptop-status-msg--error">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errorMessage || 'Please fill in all required fields.'}</span>
                          </div>
                        )}
                        {submitStatus === 'success' && (
                          <div className="laptop-status-msg laptop-status-msg--success">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Thank you! Your message has been sent.</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="laptop-form-actions">
                          <button
                            type="submit"
                            disabled={submitStatus === 'loading'}
                            className="laptop-submit-btn"
                          >
                            {submitStatus === 'loading' ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : submitStatus === 'success' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Sent!</span>
                              </>
                            ) : (
                              <>
                                <Mail className="w-3.5 h-3.5" />
                                <span>Submit Message</span>
                              </>
                            )}
                          </button>

                          <ArrowFillButton
                            to="/contact"
                            btnText="Open Full Contact Page"
                            size="sm"
                            transparent={true}
                          />
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Tab 2: Leadership Team */}
                  {activeTab === 'team' && (
                    <motion.div
                      key="team"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="team-workspace"
                    >
                      <div className="team-header-mini">
                        <span className="laptop-badge">
                          <Users className="w-3 h-3 text-[#4285F4]" />
                          <span>GDGC Chapter Leadership</span>
                        </span>
                        <h3 className="laptop-inner-title">
                          Core <span className="title-gradient-accent">Team</span>
                        </h3>
                      </div>

                      <div className="team-cards-grid">
                        {LEADERSHIP_TEAM.map((lead, idx) => (
                          <div key={idx} className="team-lead-card">
                            <div
                              className="team-avatar-badge"
                              style={{
                                backgroundColor: `${lead.color}18`,
                                borderColor: `${lead.color}40`,
                                color: lead.color,
                              }}
                            >
                              <span>{lead.initials}</span>
                            </div>
                            <div className="team-lead-info">
                              <h4 className="team-lead-name">{lead.name}</h4>
                              <span
                                className="team-lead-role"
                                style={{ color: lead.color }}
                              >
                                {lead.role}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                                <div className="team-footer-cta">
                        <ArrowFillButton
                          to="/team"
                          btnText="View Full Team"
                          size="sm"
                          bgColor="#4285F4"
                          textColor="#ffffff"
                          fillBgColor="#ffffff"
                          fillTextColor="#1a73e8"
                          arrowColor="#4285F4"
                          hoverArrowColor="#1a73e8"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 2: Interactive Developer Terminal (No members count, interactive commands) */}
                  {activeTab === 'terminal' && (
                    <motion.div
                      key="terminal"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="terminal-workspace"
                    >
                      <div className="terminal-header-mini">
                        <div className="terminal-prompt">
                          <span className="text-[#4285F4]">gdgc@pccoe</span>
                          <span className="text-muted-foreground">:</span>
                          <span className="text-[#34A853]">~</span>
                          <span className="text-muted-foreground">$</span>
                          <span className="font-mono text-foreground font-semibold">
                            npx gdgc-pccoe join
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyCommand}
                          className="terminal-copy-btn"
                          title="Copy command"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3 text-[#34A853]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="terminal-log-body">
                        {terminalLogs.map((log) => (
                          <div
                            key={log.id}
                            className={`log-line ${
                              log.type === 'success'
                                ? 'text-[#34A853]'
                                : log.type === 'accent'
                                ? 'text-[#FBBC04]'
                                : log.type === 'command'
                                ? 'text-[#4285F4] font-semibold'
                                : log.type === 'output'
                                ? 'text-foreground/90 font-mono text-[10px] pl-2'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {log.text}
                          </div>
                        ))}
                      </div>

                      {/* Interactive Command Runner Bar */}
                      <div className="terminal-actions-bar">
                        <div className="terminal-chips-group">
                          <span className="text-[10px] text-muted-foreground hidden sm:inline mr-1">
                            Run:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRunCommand('domains')}
                            className="terminal-chip-btn"
                            title="Print all technical domains"
                          >
                            <span>gdgc domains</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRunCommand('events')}
                            className="terminal-chip-btn"
                            title="Print upcoming events"
                          >
                            <span>gdgc events</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRunCommand('perks')}
                            className="terminal-chip-btn"
                            title="Print member perks"
                          >
                            <span>gdgc perks</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRunCommand('clear')}
                            className="terminal-chip-btn text-muted-foreground hover:text-foreground"
                            title="Clear output"
                          >
                            <span>clear</span>
                          </button>
                        </div>

                        <ArrowFillButton
                          to="/contact"
                          btnText="Join Community"
                          size="sm"
                          bgColor="#4285F4"
                          textColor="#ffffff"
                          fillBgColor="#ffffff"
                          fillTextColor="#1a73e8"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 3: Member Perks Grid */}
                  {activeTab === 'perks' && (
                    <motion.div
                      key="perks"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="perks-workspace"
                    >
                      <div className="perks-grid">
                        {PERKS.map((perk, idx) => {
                          const Icon = perk.icon;
                          return (
                            <div key={idx} className="perk-card">
                              <div
                                className="perk-icon-wrap"
                                style={{
                                  backgroundColor: `${perk.color}15`,
                                  borderColor: `${perk.color}35`,
                                  color: perk.color,
                                }}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="perk-info">
                                <h4 className="perk-title">{perk.title}</h4>
                                <p className="perk-desc">{perk.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="perks-footer-cta flex items-center justify-center">
                        <ArrowFillButton
                          to="/contact"
                          btnText="Unlock All Member Perks"
                          size="sm"
                          bgColor="#4285F4"
                          textColor="#ffffff"
                          fillBgColor="#ffffff"
                          fillTextColor="#1a73e8"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default LaptopCTA;
