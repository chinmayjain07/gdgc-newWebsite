import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { blackoutAudio } from './Ambience';

const LazyCinematicIntro = lazy(() => import('./CinematicIntro'));
const LazyBlackoutGame = lazy(() => import('./BlackoutGame'));

/**
 * BLACKOUT orchestrator.
 * Phases: 'protocol' → 'cinematic' → 'game'
 * The final cinematic shot (door zoom) hands off directly to first-person
 * control at the matching in-game position so the video "becomes" the game.
 */

function ProtocolSequence({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    blackoutAudio.init();
    blackoutAudio.glitch();

    const lines = [
      'BLACKOUT PROTOCOL INITIALIZED',
      'SYSTEM OVERRIDE DETECTED',
      'Connection unstable...',
    ];
    lines.forEach((_, i) => {
      setTimeout(() => setStage(i + 1), 700 + i * 950);
    });

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 750);
          return 100;
        }
        return Math.min(100, p + 7);
      });
    }, 85);
    return () => clearInterval(interval);
  }, [onComplete]);

  const filled = Math.round((progress / 100) * 20);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black flex flex-col items-center justify-center font-mono select-none"
    >
      <div className="w-full max-w-lg px-6 space-y-2">
        <div className="text-red-500 text-xs sm:text-sm tracking-[0.3em] font-bold">
          {stage >= 1 ? 'BLACKOUT PROTOCOL INITIALIZED' : '\u00A0'}
        </div>
        <div className="text-amber-500 text-xs sm:text-sm tracking-[0.2em]">
          {stage >= 2 ? 'SYSTEM OVERRIDE DETECTED' : '\u00A0'}
        </div>
        <div className="text-slate-500 text-[11px] sm:text-xs tracking-widest">
          {stage >= 3 ? 'Connection unstable...' : '\u00A0'}
        </div>
        <div className="pt-5 text-amber-400 text-sm tracking-[0.25em]">
          {bar} {progress}%
        </div>
      </div>
      {/* Interference lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(255,60,50,0.05) 0px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 7px)',
        }}
      />
    </motion.div>
  );
}

export function BlackoutExperience({ onExit }) {
  const [phase, setPhase] = useState('protocol');
  const [fade, setFade] = useState(false);

  const exitAll = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      blackoutAudio.stopAll();
      onExit();
    }, 900);
  }, [onExit]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black overflow-hidden select-none">
      <motion.div
        animate={{ opacity: fade ? 0 : 1 }}
        transition={{ duration: 0.9 }}
        className="absolute inset-0"
      >
        {phase === 'protocol' && (
          <ProtocolSequence onComplete={() => setPhase('cinematic')} />
        )}

        {phase === 'cinematic' && (
          <Suspense
            fallback={
              <div className="w-full h-full bg-black flex items-center justify-center font-mono text-[10px] tracking-[0.4em] text-slate-600">
                ACQUIRING SIGNAL...
              </div>
            }
          >
            <LazyCinematicIntro onComplete={() => setPhase('game')} onSkip={() => setPhase('game')} />
          </Suspense>
        )}

        {phase === 'game' && (
          <Suspense
            fallback={
              <div className="w-full h-full bg-black flex items-center justify-center font-mono text-[10px] tracking-[0.4em] text-slate-600">
                ESTABLISHING PRESENCE...
              </div>
            }
          >
            <LazyBlackoutGame onExit={exitAll} />
          </Suspense>
        )}
      </motion.div>
    </div>
  );
}

export default BlackoutExperience;
