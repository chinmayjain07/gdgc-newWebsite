import { useRef, useState, useEffect, useCallback } from 'react';
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
  TerminalSquare,
  Send,
  Loader2,
} from 'lucide-react';
import './LaptopCTA.css';
import { EasterEggManager } from '@/components/easteregg/EasterEggManager';
import { PixelDino, MatrixRain, useKonami } from '@/components/easteregg/TerminalEggs';
import '@/components/easteregg/terminalEggs.css';

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

const INITIAL_LOGS = [
  { id: 1, type: 'success', text: '✓ [SYSTEM] Connected to Google Developer Groups • PCCOE Chapter' },
  { id: 2, type: 'info', text: 'ℹ Platform: Linux / Node.js 20+ • Google Cloud SDK Active' },
  { id: 3, type: 'accent', text: '★ Status: Open for all engineering students & tech enthusiasts' },
];

// ── Built-in offline terminal commands (no AI needed) ───────────────────
const BUILTIN_COMMANDS = {
  help: [
    '──────────────────────────────────────────',
    'GDGC DEV TERMINAL — Available Commands:',
    '  help      → Show this menu',
    '  status    → System & network status',
    '  whoami    → Who is running this terminal?',
    '  connect   → Connect to GDGC peer network',
    '  domains   → List all technical domains',
    '  perks     → List member perks',
    '  clear     → Clear terminal output',
    '',
    'Or type any natural-language question:',
    '  "what is gdgc?" / "who is the design lead?"',
    '──────────────────────────────────────────',
  ],
  status: [
    '$ gdgc status --verbose',
    '  NODE_STATUS    : ACTIVE ✓',
    '  UPTIME         : 1250+ days',
    '  MEMBERS        : 1,250+',
    '  EVENTS_HOSTED  : 120+',
    '  HACKATHON_WINS : 12',
    '  NETWORK        : CONNECTED',
    '  SDK            : Google Cloud v4.x ✓',
  ],
  whoami: [
    '$ whoami',
    '  You are a developer visiting GDGC PCCOE.',
    '  Role: GUEST | Access Level: COMMUNITY',
    '  Tip: Join GDGC to become an INSIDER.',
  ],
  connect: [
    '$ gdgc connect --peer-network',
    '  Scanning for GDGC nodes...',
    '  [█████████████████████] 100%',
    '  ✓ NODE CONNECTED: gdgc-pccoe.dev',
    '  ✓ GDGC MESH: 1250 peers online',
  ],
  domains: [
    '$ gdgc domains --list',
    '  → WebDev • Cloud • AI/ML • UI/UX',
    '  → CP • AR/VR • IoT • Flutter',
    '  → Management • PR & Outreach',
  ],
  perks: [
    '$ gdgc perks --member',
    '  → Google Cloud & Vertex AI Credits',
    '  → National Hackathon Invites',
    '  → GDE Mentorship (1-on-1)',
    '  → Official Google Swag & Certs',
  ],
};

// ── Secret command detectors (NEVER shown in help / UI) ─────────────────
const EASTER_EGG_PHRASES = [
  'enter a game',
  'enter game',
  'launch game',
  'launch a game',
  'start game',
  'start a game',
  'open game',
  'play game',
  'play a game',
];

const BLACKOUT_PHRASES = [
  'launch blackout',
  'start blackout',
  'initiate blackout',
  'begin blackout',
  'run blackout',
  'blackout protocol',
];

function detectSecretCommand(input) {
  const normalized = input.toLowerCase().trim();
  return EASTER_EGG_PHRASES.some((phrase) => normalized === phrase || normalized.includes(phrase));
}

function detectBlackoutCommand(input) {
  const normalized = input.toLowerCase().trim();
  if (normalized === 'blackout') return true;
  return BLACKOUT_PHRASES.some((phrase) => normalized === phrase || normalized.includes(phrase));
}

// ── Harmless terminal Easter eggs (never listed in help) ────────────────
const TERMINAL_EGGS = {
  'sudo gdgc': [
    { type: 'output', text: '$ sudo gdgc --auth' },
    { type: 'success', text: '  ACCESS LEVEL: STUDENT' },
    { type: 'accent', text: '  Nice try.' },
  ],
  'sudo make coffee': [
    { type: 'output', text: '$ sudo make coffee' },
    { type: 'error', text: '  Access denied.' },
    { type: 'output', text: '  Reason:' },
    { type: 'accent', text: '  The developers already drank it.' },
  ],
  'sudo coffee': [
    { type: 'output', text: '$ sudo coffee' },
    { type: 'error', text: '  Access denied.' },
    { type: 'output', text: '  Reason:' },
    { type: 'accent', text: '  The developers already drank it.' },
  ],
  'make coffee': [
    { type: 'output', text: '$ make coffee' },
    { type: 'error', text: '  Access denied.' },
    { type: 'output', text: '  Reason:' },
    { type: 'accent', text: '  The developers already drank it.' },
  ],
};

function detectTerminalEgg(input) {
  const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
  if (normalized === '404') return '404';
  if (normalized === 'matrix') return 'matrix';
  return TERMINAL_EGGS[normalized] || null;
}

// ── Backend AI Chat helper ───────────────────────────────────────────────
async function queryAI(message) {
  try {
    const url = import.meta.env.DEV
      ? 'http://localhost:5000/api/ai/chat'
      : '/api/ai/chat';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { reply: err.reply || 'AI is temporarily unavailable.', action: null };
    }

    return await res.json();
  } catch {
    return { reply: 'AI is offline. Try again later.', action: null };
  }
}

// ── Navigate to website section based on AI action ─────────────────────
function executeNavAction(action) {
  if (!action) return;

  const routeMap = {
    home: '/',
    about: '/about',
    events: '/events',
    community: '/about',
    team: '/team',
    join: '/contact',
    contact: '/contact',
  };

  if (action.type === 'navigate' && routeMap[action.target]) {
    // Use history.pushState to navigate without reload
    window.history.pushState({}, '', routeMap[action.target]);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

let msgId = 100;
function makeLog(type, text) {
  return { id: ++msgId, type, text };
}

export function LaptopCTA() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('welcome');
  const [copied, setCopied] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState(INITIAL_LOGS);
  const [inputValue, setInputValue] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [easterEggMode, setEasterEggMode] = useState('fps');
  const [dinoActive, setDinoActive] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);
  const [postGameMode, setPostGameMode] = useState(null); // 'fps' | 'blackout'

  // Sticky Scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

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

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.38, 0.58, 0.88, 1.0],
    [0, 0, 1, 1, 1]
  );

  const lidLogoOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.20],
    [1, 1, 0]
  );

  const currentFrameRef = useRef(0);

  // Canvas Frame Rendering
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

    const frame0 = new Image();
    frame0.decoding = 'async';
    frame0.src = getFrameSrc(0);
    frame0.onload = () => {
      if (!isMounted) return;
      images[0] = frame0;
      drawFrame(0);

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

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalLogs, isAIThinking]);

  // After game returns, inject farewell messages
  useEffect(() => {
    if (postGameMode === 'fps') {
      setTerminalLogs((prev) => [
        ...prev,
        makeLog('info', ''),
        makeLog('success', '> connection terminated'),
        makeLog('accent', '> welcome back, developer.'),
        makeLog('info', '─────────────────────────────────────────'),
        makeLog('output', 'System nominal. GDGC terminal operational.'),
      ]);
      setPostGameMode(null);
      setIsAIThinking(false);
    }
    if (postGameMode === 'blackout') {
      setTerminalLogs((prev) => [
        ...prev,
        makeLog('info', ''),
        makeLog('success', '> connection terminated'),
        makeLog('success', '> protocol terminated'),
        makeLog('success', '> system restored'),
        makeLog('accent', '> welcome back, developer.'),
        makeLog('info', '─────────────────────────────────────────'),
        makeLog('output', 'System nominal. GDGC terminal operational.'),
      ]);
      setPostGameMode(null);
      setIsAIThinking(false);
    }
  }, [postGameMode]);

  const handleKonamiUnlock = useCallback(() => {
    setKonamiActive(true);
    setTerminalLogs((prev) => [
      ...prev,
      makeLog('override', '> SYSTEM OVERRIDE'),
      makeLog('info', '  Visual kernel patched. Do not tell anyone.'),
    ]);
    setTimeout(() => setKonamiActive(false), 8000);
  }, []);

  // Konami sequence inside the terminal → SYSTEM OVERRIDE
  useKonami(activeTab === 'terminal' && !easterEggActive, handleKonamiUnlock);

  const handleCopyCommand = () => {
    navigator.clipboard?.writeText('npx gdgc-pccoe join');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Main Terminal Command Processor ─────────────────────────────────
  const processCommand = useCallback(async (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Add user command line to logs
    setTerminalLogs((prev) => [
      ...prev,
      makeLog('command', `> ${trimmed}`),
    ]);
    setInputValue('');

    // ── 1. Detect secret Easter egg commands (client-side, deterministic) ─
    // FPS secret
    if (detectSecretCommand(trimmed)) {
      setTerminalLogs((prev) => [
        ...prev,
        makeLog('info', ''),
        makeLog('success', '> Command recognized.'),
        makeLog('accent', '> Initializing...'),
        makeLog('info', ''),
      ]);
      setIsAIThinking(true);
      setTimeout(() => {
        setEasterEggMode('fps');
        setEasterEggActive(true);
      }, 900);
      return;
    }

    // Blackout secret
    if (detectBlackoutCommand(trimmed)) {
      setTerminalLogs((prev) => [
        ...prev,
        makeLog('error', '> BLACKOUT PROTOCOL INITIALIZED'),
        makeLog('accent', '> SYSTEM OVERRIDE DETECTED'),
        makeLog('info', '> Connection unstable...'),
        makeLog('info', ''),
      ]);
      setIsAIThinking(true);
      setTimeout(() => {
        setEasterEggMode('blackout');
        setEasterEggActive(true);
      }, 900);
      return;
    }

    // ── 1b. Harmless terminal Easter eggs ───────────────────────────────
    const egg = detectTerminalEgg(trimmed);
    if (egg === '404') {
      setTerminalLogs((prev) => [
        ...prev,
        makeLog('output', '$ search --query "404"'),
        makeLog('info', '  Searching...'),
        makeLog('error', '  404: Page not found.'),
        makeLog('info', ''),
        makeLog('accent', '  But somehow... you found this.'),
      ]);
      setDinoActive(true);
      setTimeout(() => setDinoActive(false), 3800);
      return;
    }
    if (egg === 'matrix') {
      setMatrixActive(true);
      setTerminalLogs((prev) => [
        ...prev,
        makeLog('output', '$ wake_up neo'),
        makeLog('success', '  Follow the white rabbit.'),
      ]);
      setTimeout(() => {
        setMatrixActive(false);
        setTerminalLogs((prev) => [
          ...prev,
          makeLog('info', '  ...knock, knock.'),
        ]);
      }, 4200);
      return;
    }
    if (Array.isArray(egg)) {
      setTerminalLogs((prev) => [
        ...prev,
        ...egg.map((l) => makeLog(l.type, l.text)),
      ]);
      return;
    }

    // ── 2. Handle built-in commands offline ─────────────────────────────
    const key = trimmed.toLowerCase().replace(/^[\$\s]+/, '').split(' ')[0];
    if (key === 'clear') {
      setTerminalLogs(INITIAL_LOGS);
      return;
    }

    if (BUILTIN_COMMANDS[key]) {
      const lines = BUILTIN_COMMANDS[key];
      setTerminalLogs((prev) => [
        ...prev,
        ...lines.map((line) =>
          line.startsWith('$')
            ? makeLog('command', line)
            : line.startsWith('✓')
            ? makeLog('success', line)
            : line === ''
            ? makeLog('info', '')
            : makeLog('output', line)
        ),
      ]);
      return;
    }

    // ── 3. Forward to AI assistant backend ──────────────────────────────
    setIsAIThinking(true);

    const { reply, action } = await queryAI(trimmed);

    setIsAIThinking(false);

    setTerminalLogs((prev) => [
      ...prev,
      makeLog('ai', `AI → ${reply}`),
    ]);

    // Execute navigation if action returned (navigate to website sections)
    if (action && action.type !== 'register' && action.type !== 'launch_easter_egg') {
      setTimeout(() => executeNavAction(action), 400);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isAIThinking) {
          processCommand(inputValue);
        }
      }
    },
    [inputValue, isAIThinking, processCommand]
  );

  const handleSendClick = useCallback(() => {
    if (!isAIThinking) {
      processCommand(inputValue);
    }
  }, [inputValue, isAIThinking, processCommand]);

  const handleQuickCmd = useCallback(
    (cmd) => {
      if (!isAIThinking) processCommand(cmd);
    },
    [isAIThinking, processCommand]
  );

  // When player returns from game
  const handleEasterEggClose = useCallback(() => {
    const mode = easterEggMode;
    setEasterEggActive(false);
    setPostGameMode(mode);
    // Switch to terminal tab so user sees the farewell messages
    setActiveTab('terminal');
  }, [easterEggMode]);

  return (
    <>
      {/* ── Hidden Experiences Overlay (lazy-loaded, secrets) ─────────── */}
      <EasterEggManager
        isActive={easterEggActive}
        mode={easterEggMode}
        onClose={handleEasterEggClose}
      />

      <section
        ref={containerRef}
        id="cta-section"
        className="acm-laptop-section relative w-full h-[300vh]"
        aria-labelledby="cta-title"
      >
        {/* Sticky Viewport Container */}
        <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="acm-ambient-glow" aria-hidden="true" />

          {/* 16:9 Laptop Canvas Stage */}
          <div className="acm-laptop-stage">
            <canvas
              ref={canvasRef}
              className="acm-laptop-canvas"
              aria-label="3D Animated Laptop"
            />

            {/* Closed-Lid GDGC Badge */}
            <motion.div
              style={{ opacity: lidLogoOpacity }}
              className="closed-lid-gdgc-badge"
              aria-hidden="true"
            >
              <div className="lid-badge-surface">
                <svg
                  viewBox="0 0 48 48"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 20 13 L 9 24" stroke="#4285F4" />
                    <path d="M 9 24 L 20 35" stroke="#EA4335" />
                    <path d="M 28 13 L 39 24" stroke="#FBBC04" />
                    <path d="M 39 24 L 28 35" stroke="#34A853" />
                  </g>
                </svg>
              </div>
            </motion.div>

            {/* Screen Overlay */}
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="acm-screen-overlay"
            >
              <div className="acm-screen-inner">
                <div className="screen-reflection" aria-hidden="true" />

                {/* OS Window Header */}
                <div className="screen-os-header">
                  <div className="window-dots" aria-hidden="true">
                    <span className="dot dot-close" />
                    <span className="dot dot-minimize" />
                    <span className="dot dot-expand" />
                  </div>

                  <div className="window-tabs-container">
                    <button
                      type="button"
                      onClick={() => setActiveTab('welcome')}
                      className={`screen-tab-btn ${activeTab === 'welcome' ? 'screen-tab-btn--active' : ''}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FBBC04]" />
                      <span>Welcome.tsx</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('terminal')}
                      className={`screen-tab-btn ${activeTab === 'terminal' ? 'screen-tab-btn--active' : ''}`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#4285F4]" />
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

                  <div className="window-status">
                    <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                    <span className="hidden sm:inline">Connected</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="screen-content">
                  <div className="screen-blobs" aria-hidden="true">
                    <span className="screen-blob blob-blue" />
                    <span className="screen-blob blob-red" />
                    <span className="screen-blob blob-green" />
                    <span className="screen-blob blob-yellow" />
                  </div>

                  <AnimatePresence mode="wait">
                    {/* ── Tab 1: Welcome ─────────────────────────────── */}
                    {activeTab === 'welcome' && (
                      <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="laptop-cta-card"
                      >
                        <span className="laptop-badge">
                          <Sparkles className="w-3.5 h-3.5 text-[#FBBC04]" />
                          <span>Build With Next-Gen Devs</span>
                        </span>

                        <h3 className="laptop-inner-title">
                          Build The Future With{' '}
                          <span className="title-gradient-accent">GDGC</span>
                        </h3>

                        <p className="laptop-desc">
                          Join passionate student developers at PCCOE. Collaborate on
                          real-world projects, master Google technologies, and launch your engineering career.
                        </p>

                        <div className="laptop-actions">
                          <ArrowFillButton
                            to="/contact"
                            btnText="Join GDGC Today"
                            size="sm"
                            bgColor="#4285F4"
                            textColor="#ffffff"
                            fillBgColor="#ffffff"
                            fillTextColor="#1a73e8"
                            arrowColor="#4285F4"
                            hoverArrowColor="#1a73e8"
                          />
                          <ArrowFillButton
                            to="/events"
                            btnText="Explore Events"
                            size="sm"
                            transparent={true}
                          />
                        </div>

                        <div className="laptop-stats-pills">
                          <span className="stat-pill">
                            <Users className="w-3 h-3 text-[#4285F4]" />
                            <span>Collaborative Community</span>
                          </span>
                          <span className="stat-pill">
                            <Trophy className="w-3 h-3 text-[#EA4335]" />
                            <span>25+ Hackathons</span>
                          </span>
                          <span className="stat-pill">
                            <Cpu className="w-3 h-3 text-[#34A853]" />
                            <span>12 Tech Domains</span>
                          </span>
                        </div>

                        <div className="laptop-quick-tab-links">
                          <button
                            type="button"
                            onClick={() => setActiveTab('terminal')}
                            className="quick-tab-link"
                            title="Open interactive DevTerminal"
                          >
                            <Terminal className="w-3 h-3 text-[#4285F4]" />
                            <span>DevTerminal.sh</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab('perks')}
                            className="quick-tab-link"
                            title="Explore official member perks"
                          >
                            <Gift className="w-3 h-3 text-[#34A853]" />
                            <span>MemberPerks.json</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Tab 2: GDGC AI Dev Terminal ────────────────── */}
                    {activeTab === 'terminal' && (
                      <motion.div
                        key="terminal"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className={`terminal-workspace gdgc-ai-terminal ${
                          konamiActive ? 'terminal-override egg-overlay' : ''
                        } ${dinoActive || matrixActive ? 'egg-overlay' : ''}`}
                      >
                        {dinoActive && <PixelDino />}
                        {matrixActive && <MatrixRain />}
                        {/* Terminal Header */}
                        <div className="gdgc-terminal-header">
                          <div className="gdgc-terminal-title-row">
                            <span className="gdgc-terminal-title">GDGC DEV TERMINAL</span>
                            <span className="gdgc-terminal-version">v2.6 • PCCOE</span>
                          </div>
                          <div className="gdgc-terminal-sep">────────────────────────────</div>
                          <div className="gdgc-terminal-status-row">
                            <span className="gdgc-terminal-connected">✓ SYSTEM STATUS: CONNECTED</span>
                            <span className="gdgc-terminal-connected-net">✓ GDGC NETWORK: ONLINE</span>
                          </div>
                          <div className="gdgc-terminal-sep">────────────────────────────</div>
                        </div>

                        {/* Log Output */}
                        <div
                          ref={terminalBodyRef}
                          className="gdgc-terminal-body"
                        >
                          {terminalLogs.map((log) => (
                            <div
                              key={log.id}
                              className={`gdgc-log-line ${log.type}`}
                            >
                              {log.text}
                            </div>
                          ))}
                          {isAIThinking && (
                            <div className="gdgc-log-line thinking">
                              <Loader2 className="w-2.5 h-2.5 animate-spin inline mr-1" />
                              AI processing...
                            </div>
                          )}
                        </div>

                        {/* Input Row */}
                        <div className="gdgc-terminal-input-row">
                          <span className="gdgc-terminal-prompt-prefix">
                            <span className="text-[#4285F4]">gdgc</span>
                            <span className="text-slate-400">@</span>
                            <span className="text-[#34A853]">pccoe</span>
                            <span className="text-slate-400"> $</span>
                          </span>
                          <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a command..."
                            disabled={isAIThinking}
                            className="gdgc-terminal-input"
                            autoComplete="off"
                            spellCheck="false"
                            maxLength={200}
                            aria-label="GDGC Terminal input"
                          />
                          <button
                            type="button"
                            onClick={handleSendClick}
                            disabled={isAIThinking || !inputValue.trim()}
                            className="gdgc-terminal-send-btn"
                            aria-label="Run command"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Quick Command Chips */}
                        <div className="gdgc-terminal-chips">
                          {['help', 'status', 'whoami', 'domains', 'clear'].map((cmd) => (
                            <button
                              key={cmd}
                              type="button"
                              onClick={() => handleQuickCmd(cmd)}
                              disabled={isAIThinking}
                              className="terminal-chip-btn"
                            >
                              {cmd}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ── Tab 3: Member Perks ────────────────────────── */}
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

                        <div className="perks-footer-cta flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveTab('welcome')}
                            className="quick-tab-link"
                          >
                            <span>← Back to Welcome</span>
                          </button>
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

                  {/* Bottom Terminal Strip */}
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'terminal' ? 'welcome' : 'terminal')}
                    className="screen-terminal-strip"
                    title={activeTab === 'terminal' ? 'Return to Welcome view' : 'Launch DevTerminal'}
                  >
                    <TerminalSquare className="w-3 h-3 text-[#4285F4]" />
                    <span>$ gdgc connect --peer-network</span>
                    <span className="terminal-accent">✓ [OK: NODE CONNECTED]</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LaptopCTA;
