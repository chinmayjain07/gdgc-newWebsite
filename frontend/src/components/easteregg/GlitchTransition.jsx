import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { soundEffects } from './audio/soundEffects';

export function GlitchTransition({ onTransitionComplete }) {
  const [phase, setPhase] = useState(0); // 0: glitch text, 1: screen flicker, 2: black & loading, 3: connected
  const [progress, setProgress] = useState(0);
  const [glitchText, setGlitchText] = useState('SYSTEM_OVERRIDE_DETECTED');

  useEffect(() => {
    soundEffects.playGlitch();

    // Step 3-5: Scramble text and flicker
    const chars = '!@#$%^&*<>_[]{}010101XYZ';
    const interval = setInterval(() => {
      let scramble = '';
      for (let i = 0; i < 28; i++) {
        scramble += chars[Math.floor(Math.random() * chars.length)];
      }
      setGlitchText(scramble);
    }, 60);

    // Timeline Sequence
    const t1 = setTimeout(() => {
      soundEffects.playGlitch();
      setPhase(1); // Screen flicker & brightness rise
    }, 800);

    const t2 = setTimeout(() => {
      clearInterval(interval);
      setPhase(2); // Black screen & loading bar
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Progress Bar Simulation
  useEffect(() => {
    if (phase === 2) {
      const pInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(pInterval);
            setPhase(3); // CONNECTION ESTABLISHED
            setTimeout(() => {
              if (onTransitionComplete) onTransitionComplete();
            }, 800);
            return 100;
          }
          return prev + 12;
        });
      }, 70);

      return () => clearInterval(pInterval);
    }
  }, [phase, onTransitionComplete]);

  // Compute progress block characters
  const filledBlocks = Math.floor(progress / 5);
  const emptyBlocks = 20 - filledBlocks;
  const progressBarString = '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, emptyBlocks));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center font-mono select-none overflow-hidden"
    >
      {/* ── Screen Scanlines & Glitch Overlay ────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"
        aria-hidden="true"
      />

      {/* ── Phase 0 & 1: Glitching Diagnostic Text & Camera Zoom ─────── */}
      {phase < 2 && (
        <motion.div
          animate={{
            scale: [1, 1.08, 1.25, 1.6],
            filter: [
              'hue-rotate(0deg) brightness(1)',
              'hue-rotate(90deg) brightness(1.8)',
              'hue-rotate(180deg) brightness(2.2)',
              'brightness(3)',
            ],
          }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-4 text-center p-6"
        >
          <div className="text-emerald-400 text-sm tracking-widest font-bold">
            ⚠ PROTOCOL INJECTION: UNKNOWN_VECTOR
          </div>

          <div className="text-xl sm:text-3xl text-cyan-400 font-extrabold tracking-wider break-all max-w-xl">
            {glitchText}
          </div>

          <div className="text-xs text-rose-500 font-mono tracking-widest animate-pulse">
            MEMORY_FAULT: 0x004F3A • RECONFIGURING KERNEL...
          </div>
        </motion.div>
      )}

      {/* ── Phase 2 & 3: Black Screen, Progress Bar & Connection ───────── */}
      {phase >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6 text-center max-w-lg p-6"
        >
          <div className="text-xs text-emerald-400 tracking-widest font-bold">
            INITIALIZING UNKNOWN ENVIRONMENT...
          </div>

          <div className="text-sm text-slate-400">Loading...</div>

          <div className="text-cyan-400 text-base sm:text-lg tracking-widest font-mono">
            {progressBarString} {progress}%
          </div>

          {phase === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm font-bold text-emerald-400 tracking-widest animate-pulse mt-2"
            >
              ✓ CONNECTION ESTABLISHED
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
