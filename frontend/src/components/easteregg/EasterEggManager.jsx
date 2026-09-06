import { useState, useEffect, lazy, Suspense } from 'react';
import { GlitchTransition } from './GlitchTransition';

// Lazy-load game bundles ONLY when the respective Easter egg is triggered.
const LazyFPSGame = lazy(() => import('./game/FPSGame'));
const LazyBlackoutExperience = lazy(() =>
  import('./blackout/BlackoutExperience')
);

/**
 * EasterEggManager — mounts hidden experiences without touching the site.
 * mode: 'fps' | 'blackout'
 *
 * FPS is desktop-only (pointer lock); Blackout ships a full mobile
 * fallback with joystick + touch look, so mobile users get it too.
 */
export function EasterEggManager({ isActive, mode = 'fps', onClose, onGameFinished }) {
  const [phase, setPhase] = useState('transition'); // 'transition' | 'playing' | 'mobile'

  useEffect(() => {
    if (!isActive) return;

    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024));

    if (mode === 'fps' && isMobile) {
      setPhase('mobile');
    } else {
      setPhase('transition');
    }
  }, [isActive, mode]);

  useEffect(() => {
    if (!isActive) setPhase('transition');
  }, [isActive]);

  if (!isActive) return null;

  const handleReturn = () => {
    if (onGameFinished) onGameFinished();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Mobile fallback — FPS only */}
      {phase === 'mobile' && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white font-mono">
          <div className="p-8 max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center gap-5">
            <div className="text-amber-400 text-xs tracking-widest font-bold">
              [NOTICE: TERMINAL DISPATCH]
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              This experience is optimized for desktop keyboard and mouse controls.
            </p>
            <button
              onClick={handleReturn}
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Return to GDGC
            </button>
          </div>
        </div>
      )}

      {/* FPS: cinematic glitch & loading sequence */}
      {mode === 'fps' && phase === 'transition' && (
        <GlitchTransition onTransitionComplete={() => setPhase('playing')} />
      )}

      {/* FPS: 3D First-Person Shooter Canvas */}
      {mode === 'fps' && phase === 'playing' && (
        <Suspense
          fallback={
            <div className="w-full h-full bg-black flex items-center justify-center text-cyan-400 font-mono text-sm">
              INITIALIZING 3D ENGINE...
            </div>
          }
        >
          <LazyFPSGame onReturnToSite={handleReturn} />
        </Suspense>
      )}

      {/* Blackout: full experience (protocol → cinematic → game) */}
      {mode === 'blackout' && (
        <Suspense
          fallback={
            <div className="w-full h-full bg-black flex items-center justify-center text-red-400 font-mono text-sm tracking-widest">
              ESTABLISHING CONNECTION...
            </div>
          }
        >
          <LazyBlackoutExperience onExit={handleReturn} />
        </Suspense>
      )}
    </div>
  );
}

export default EasterEggManager;
