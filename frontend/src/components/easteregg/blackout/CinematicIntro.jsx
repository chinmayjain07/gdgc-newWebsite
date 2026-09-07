import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blackoutAudio } from './Ambience';

/**
 * BLACKOUT cinematic intro — 7 shots, ~40s.
 * Renders a procedurally generated cinematic (CSS + canvas film effects).
 * If real footage is dropped at /blackout/video/blackout-intro.mp4
 * (see public/blackout/README.md), it is used automatically instead.
 * The final shot zooms toward a doorway so the game continues seamlessly.
 */

const SHOTS = [
  {
    id: 'shot1',
    time: 6.5,
    title: '02:17 AM',
    sub: 'SUBTERRA-7 RESEARCH ANNEX — 41.2 KM FROM THE LAST TOWN',
    render: 'exterior',
  },
  {
    id: 'shot2',
    time: 6.0,
    title: '',
    sub: '',
    render: 'checkpoint',
  },
  {
    id: 'shot3',
    time: 6.5,
    title: 'SECURITY NODE OFFLINE',
    sub: 'UNKNOWN CONNECTION  ::  DATA TRANSFER DETECTED',
    render: 'control',
  },
  {
    id: 'shot4',
    time: 6.0,
    title: '',
    sub: '',
    render: 'serverroom',
  },
  {
    id: 'shot5',
    time: 6.0,
    title: '',
    sub: 'ALERT: SUB-LEVEL 3',
    render: 'corridor',
  },
  {
    id: 'shot6',
    time: 6.5,
    title: 'DATA EXFILTRATION',
    sub: 'UNKNOWN SOURCE — NODE 43',
    render: 'breach',
    progress: 76,
  },
  {
    id: 'shot7',
    time: 8.0,
    title: 'BLACKOUT PROTOCOL',
    sub: 'FIND THE SOURCE.',
    render: 'blackout',
  },
];

export function CinematicIntro({ onComplete, onSkip }) {
  const [shotIndex, setShotIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const timerRef = useRef(0);
  const completedRef = useRef(false);

  const totalDuration = SHOTS.reduce((s, x) => s + x.time, 0);
  void totalDuration;

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    blackoutAudio.init();
    blackoutAudio.startAmbience();
    const t = setTimeout(() => setShowSkip(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Shot scheduler
  useEffect(() => {
    if (shotIndex >= SHOTS.length) {
      finish();
      return;
    }
    blackoutAudio.glitch();
    timerRef.current = setTimeout(() => {
      setShotIndex((i) => i + 1);
    }, SHOTS[shotIndex].time * 1000);
    return () => clearTimeout(timerRef.current);
  }, [shotIndex, finish]);

  // Procedural film canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = Math.min(window.innerWidth, 960);
    canvas.height = Math.round(canvas.width * 0.5625);
    let running = true;

    const draw = (t) => {
      if (!running) return;
      const shot = SHOTS[Math.min(shotIndex, SHOTS.length - 1)];
      const W = canvas.width;
      const H = canvas.height;
      const local = (t / 1000) % shot.time;
      const p = local / shot.time;

      ctx.fillStyle = '#020409';
      ctx.fillRect(0, 0, W, H);

      switch (shot.render) {
        case 'exterior': {
          // Rain over a ridge, facility silhouette with security lights
          const sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#050a14');
          sky.addColorStop(1, '#0a1220');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);

          // Mountains
          ctx.fillStyle = '#070d16';
          ctx.beginPath();
          ctx.moveTo(0, H * 0.55);
          for (let x = 0; x <= W; x += W / 14) {
            ctx.lineTo(x, H * (0.5 + Math.sin(x * 0.011) * 0.06 + (x % 3) * 0.01));
          }
          ctx.lineTo(W, H);
          ctx.lineTo(0, H);
          ctx.fill();

          // Facility silhouette
          ctx.fillStyle = '#04070d';
          ctx.fillRect(W * 0.42, H * 0.4, W * 0.16, H * 0.16);
          ctx.fillRect(W * 0.45, H * 0.33, W * 0.1, H * 0.1);

          // Security lights
          for (let i = 0; i < 4; i++) {
            const lx = W * (0.44 + i * 0.04);
            const flick = Math.sin(t * 0.004 + i * 3) > -0.4 ? 1 : 0.2;
            const g = ctx.createRadialGradient(lx, H * 0.45, 0, lx, H * 0.45, 30);
            g.addColorStop(0, `rgba(255,80,60,${0.7 * flick})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(lx - 30, H * 0.45 - 30, 60, 60);
          }

          // Rain
          ctx.strokeStyle = 'rgba(160,190,220,0.16)';
          ctx.lineWidth = 1;
          for (let i = 0; i < 70; i++) {
            const rx = (i * 97 + t * 0.35) % W;
            const ry = (i * 53 + t * 0.6) % H;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + 3, ry + 14);
            ctx.stroke();
          }
          break;
        }
        case 'checkpoint': {
          // Empty industrial corridor — one-point perspective
          const vpx = W / 2 + Math.sin(t * 0.0002) * W * 0.02;
          const horizon = H * 0.48;
          ctx.fillStyle = '#070a10';
          ctx.fillRect(0, 0, W, H);

          // Floor
          ctx.fillStyle = '#0c0f14';
          ctx.beginPath();
          ctx.moveTo(vpx - 26, horizon);
          ctx.lineTo(vpx + 26, horizon);
          ctx.lineTo(W, H);
          ctx.lineTo(0, H);
          ctx.fill();

          // Wall panels
          for (let i = 1; i <= 6; i++) {
            const f = i / 6;
            const inset = 26 + (W / 2 - 26) * f * f;
            ctx.strokeStyle = `rgba(120,140,160,${0.05 + f * 0.1})`;
            ctx.strokeRect(vpx - inset, horizon - (horizon - H * 0.16) * f * f, inset * 2, (H - horizon) * f * f);
          }

          // Ceiling fluorescents, half dead
          for (let i = 0; i < 5; i++) {
            const f = 0.12 + i * 0.17;
            const y = horizon - (horizon - H * 0.1) * f;
            const w = W * 0.02 * (1 + f * 3);
            const alive = i !== 2;
            const flick = alive ? 1 : Math.sin(t * 0.03) > 0 ? 0.4 : 0.05;
            const g = ctx.createRadialGradient(vpx, y, 0, vpx, y, w * 6);
            g.addColorStop(0, `rgba(190,210,235,${0.5 * flick})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(vpx - w * 6, y - w * 6, w * 12, w * 12);
          }

          // Warning light far end
          const wr = ctx.createRadialGradient(vpx, horizon, 0, vpx, horizon, W * 0.08);
          wr.addColorStop(0, 'rgba(255,60,45,0.5)');
          wr.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = wr;
          ctx.fillRect(0, 0, W, H);
          break;
        }
        case 'control': {
          // Control room with failing monitors
          ctx.fillStyle = '#05070c';
          ctx.fillRect(0, 0, W, H);
          const mons = [
            [0.1, 0.18, 0.2],
            [0.35, 0.14, 0.24],
            [0.63, 0.2, 0.22],
            [0.38, 0.5, 0.28],
          ];
          mons.forEach(([x, y, w], i) => {
            const dead = i === 1 && Math.sin(t * 0.01) > 0.4;
            const mw = W * w;
            const mh = mw * 0.62;
            const mx = W * x;
            const my = H * y;
            ctx.fillStyle = '#0a0e14';
            ctx.fillRect(mx, my, mw, mh);
            if (!dead) {
              ctx.fillStyle = i === 0 ? 'rgba(248,113,113,0.75)' : 'rgba(96,165,250,0.6)';
              ctx.font = `${Math.max(8, mw * 0.09)}px monospace`;
              const lines = i === 0 ? ['SECURITY NODE', 'OFFLINE'] : ['DATA TRANSFER', 'DETECTED', 'UNKNOWN'];
              lines.forEach((ln, li) => ctx.fillText(ln, mx + mw * 0.1, my + mh * 0.35 + li * mw * 0.13));
            }
            const glow = ctx.createRadialGradient(mx + mw / 2, my + mh / 2, 0, mx + mw / 2, my + mh / 2, mw);
            glow.addColorStop(0, dead ? 'rgba(0,0,0,0)' : 'rgba(110,160,220,0.14)');
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);
          });
          break;
        }
        case 'serverroom': {
          // Rows of racks in perspective, LEDs shutting down
          ctx.fillStyle = '#04060a';
          ctx.fillRect(0, 0, W, H);
          const rows = 6;
          for (let r = 0; r < rows; r++) {
            const f = r / rows;
            const y = H * (0.3 + f * 0.55);
            const w = W * (0.06 + f * 0.1);
            for (let i = 0; i < 8; i++) {
              const x = W * 0.5 + (i - 3.5) * w * 1.15;
              const alive = Math.sin(t * 0.001 + r * 2 + i) > -0.2 - f;
              ctx.fillStyle = '#0a0d12';
              ctx.fillRect(x - w / 2, y - w * 0.9, w, w * 1.5);
              if (alive) {
                ctx.fillStyle = `rgba(52,211,153,${0.4 + Math.sin(t * 0.01 + i) * 0.3})`;
                ctx.fillRect(x - w * 0.3, y - w * 0.6, w * 0.16, 2);
                ctx.fillRect(x + w * 0.05, y - w * 0.45, w * 0.16, 2);
              }
            }
          }
          break;
        }
        case 'corridor': {
          // Red emergency corridor — camera moves toward a door
          ctx.fillStyle = '#0a0505';
          ctx.fillRect(0, 0, W, H);
          const zoom = 1 + p * 0.8;
          const vpx = W / 2;
          const vpy = H / 2;
          // Door at end
          const dw = W * 0.09 * zoom;
          const dh = H * 0.22 * zoom;
          ctx.strokeStyle = 'rgba(255,80,60,0.8)';
          ctx.lineWidth = 2;
          ctx.strokeRect(vpx - dw / 2, vpy - dh / 2, dw, dh);
          ctx.fillStyle = 'rgba(120,20,16,0.5)';
          ctx.fillRect(vpx - dw / 2, vpy - dh / 2, dw, dh);
          // Converging lines
          ctx.strokeStyle = 'rgba(180,60,50,0.28)';
          ctx.lineWidth = 1;
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(vpx + Math.cos(a) * W * 0.06 * zoom, vpy + Math.sin(a) * W * 0.06 * zoom);
            ctx.lineTo(vpx + Math.cos(a) * W, vpy + Math.sin(a) * W);
            ctx.stroke();
          }
          const pulse = (Math.sin(t * 0.005) + 1) / 2;
          const g = ctx.createRadialGradient(vpx, vpy, 0, vpx, vpy, W * 0.4);
          g.addColorStop(0, `rgba(255,40,30,${0.16 + pulse * 0.1})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
          break;
        }
        case 'breach': {
          // Terminal close-up with progress bar
          ctx.fillStyle = '#03060a';
          ctx.fillRect(0, 0, W, H);
          const mw = W * 0.52;
          const mh = mw * 0.62;
          const mx = (W - mw) / 2;
          const my = (H - mh) / 2;
          ctx.fillStyle = '#050a10';
          ctx.fillRect(mx, my, mw, mh);
          ctx.strokeStyle = 'rgba(150,180,220,0.25)';
          ctx.strokeRect(mx, my, mw, mh);
          ctx.fillStyle = '#f87171';
          ctx.font = `bold ${mw * 0.07}px monospace`;
          ctx.fillText('DATA EXFILTRATION', mx + mw * 0.08, my + mh * 0.22);
          ctx.fillStyle = '#fbbf24';
          ctx.font = `${mw * 0.09}px monospace`;
          const blocks = 18;
          const filled = Math.round((shot.progress / 100) * blocks);
          const jitter = Math.random() < 0.06 ? 1 : 0;
          const barStr = '█'.repeat(filled - jitter) + '░'.repeat(blocks - filled + jitter);
          ctx.fillText(barStr, mx + mw * 0.08, my + mh * 0.52);
          ctx.fillStyle = '#93c5fd';
          ctx.font = `${mw * 0.06}px monospace`;
          ctx.fillText(`${shot.progress}%  ::  UNKNOWN SOURCE`, mx + mw * 0.08, my + mh * 0.74);
          break;
        }
        case 'blackout': {
          // Complete darkness, then the door silhouette grows
          ctx.fillStyle = '#010204';
          ctx.fillRect(0, 0, W, H);
          const grow = Math.min(1, p * 1.4);
          const dw = W * 0.05 + W * 0.22 * grow;
          const dh = dw * 2.1;
          const vpx = W / 2;
          const vpy = H * 0.48;
          const g = ctx.createRadialGradient(vpx, vpy, 0, vpx, vpy, dw * 1.6);
          g.addColorStop(0, 'rgba(70,90,120,0.22)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = 'rgba(8,12,18,0.9)';
          ctx.fillRect(vpx - dw / 2, vpy - dh / 2, dw, dh);
          ctx.strokeStyle = 'rgba(140,170,210,0.5)';
          ctx.strokeRect(vpx - dw / 2, vpy - dh / 2, dw, dh);
          break;
        }
        default:
          break;
      }

      // Film grain
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 90; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
        ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
      }
      ctx.globalAlpha = 1;

      // Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [shotIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="absolute inset-0 bg-black flex flex-col items-center justify-center select-none overflow-hidden"
      onClick={() => {
        if (showSkip && onSkip) onSkip();
      }}
    >
      {/* Procedural cinematic canvas */}
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: 'min(100vh, 56.25vw)', objectFit: 'cover' }}
      />

      {/* Optional real footage — drop a file at public/blackout/video/blackout-intro.mp4 */}
      <video
        className="hidden"
        src="/blackout/video/blackout-intro.mp4"
        preload="none"
        muted
        playsInline
      />

      {/* Shot titles */}
      <AnimatePresence mode="wait">
        {shotIndex < SHOTS.length && (
          <motion.div
            key={SHOTS[shotIndex].id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.1, delay: 0.7 }}
            className="absolute bottom-[12%] left-0 right-0 text-center px-6 pointer-events-none"
          >
            {SHOTS[shotIndex].title && (
              <div className="font-mono text-amber-400/90 tracking-[0.3em] text-xs sm:text-sm font-bold mb-2">
                {SHOTS[shotIndex].title}
              </div>
            )}
            {SHOTS[shotIndex].sub && (
              <div className="font-mono text-slate-400/80 tracking-[0.18em] text-[10px] sm:text-xs">
                {SHOTS[shotIndex].sub}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timestamp overlay */}
      {shotIndex < SHOTS.length && (
        <div className="absolute top-[6%] right-[6%] font-mono text-[10px] text-red-400/70 tracking-widest flex items-center gap-2 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
          REC
        </div>
      )}

      {/* Skip hint */}
      <AnimatePresence>
        {showSkip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-[4%] right-[5%] font-mono text-[10px] text-slate-500 tracking-widest pointer-events-none"
          >
            CLICK TO SKIP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-[7vh] bg-black pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[7vh] bg-black pointer-events-none" />
    </motion.div>
  );
}

export default CinematicIntro;
