import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import './SplashScreen.css';

// 48 deterministic particles across the 4 brand colors:
// Red → top-left, Green → top-right, Blue → bottom-left, Yellow → bottom-right
const COLOR_CONFIG = [
  { name: 'red',    color: '#EA4335', targetBase: { x: -34.1, y: -19.7 }, angle: 156.4, span: 22 },
  { name: 'green',  color: '#34A853', targetBase: { x: 43.4,  y: -13.2 }, angle: -150.5, span: 26 },
  { name: 'blue',   color: '#4285F4', targetBase: { x: -44.4, y: 12.5  }, angle: -150.1, span: 26 },
  { name: 'yellow', color: '#FBBC04', targetBase: { x: 33.3,  y: 19.1  }, angle: 156.0, span: 22 },
];

// Screen coordinate quadrants (X positive right, Y positive DOWN):
// Red    (top-left):     x<0, y<0 → cos<0, sin<0 → 180°..270° (center 225° = 1.25π)
// Green  (top-right):    x>0, y<0 → cos>0, sin<0 → 270°..360° (center 315° = 1.75π)
// Blue   (bottom-left):  x<0, y>0 → cos<0, sin>0 → 90°..180°  (center 135° = 0.75π)
// Yellow (bottom-right): x>0, y>0 → cos>0, sin>0 → 0°..90°    (center 45°  = 0.25π)
const QUADRANT_ANGLES = {
  red:    { min: Math.PI * 1.05, max: Math.PI * 1.45 },
  green:  { min: Math.PI * 1.55, max: Math.PI * 1.95 },
  blue:   { min: Math.PI * 0.55, max: Math.PI * 0.95 },
  yellow: { min: Math.PI * 0.05, max: Math.PI * 0.45 },
};

const PARTICLES = (() => {
  const list = [];
  let id = 0;
  COLOR_CONFIG.forEach((cfg) => {
    const qAngles = QUADRANT_ANGLES[cfg.name];
    for (let k = 0; k < 12; k++) {
      const i = id++;
      // Starting location clustered around dino center
      const x0 = Math.round(((i * 17 + 7) % 52) - 26);
      const y0 = Math.round(((i * 23 + 11) % 54) - 27);

      // Stage 2: Wide dispersion burst — each color into its dedicated screen quadrant
      const tFrac = k / 11;
      const jitter = (((i * 7 + k * 13) % 21) - 10) * 0.008;
      const theta = qAngles.min + tFrac * (qAngles.max - qAngles.min) + jitter;
      // Large scatter radius so particles burst to near screen edges on desktop
      const rScatter = 520 + ((i * 19 + k * 7) % 220);
      const sx = Math.round(Math.cos(theta) * rScatter);
      const sy = Math.round(Math.sin(theta) * rScatter);

      // Stage 3: Target positions aligned along GDGC logo pill shape geometries
      const rad = (cfg.angle * Math.PI) / 180;
      const t = ((k / 11) - 0.5) * 2 * cfg.span;
      const tx = Math.round(cfg.targetBase.x + t * Math.cos(rad));
      const ty = Math.round(cfg.targetBase.y + t * Math.sin(rad));

      list.push({
        id: i,
        colorName: cfg.name,
        colorHex: cfg.color,
        x0,
        y0,
        sx,
        sy,
        tx,
        ty,
        size: 5 + (i % 3) * 1.5,
        delay: ((i % 12) * 0.015).toFixed(3),
      });
    }
  });
  return list;
})();

export function SplashScreen({ onComplete }) {
  const { theme } = useTheme();

  useEffect(() => {
    // Lock scroll during splash screen
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Total duration: 6.2s (accommodates deliberate Dino run with cactus jumps, wide scatter, unhurried logo assembly, and exit)
    const timer = setTimeout(() => {
      document.body.style.overflow = originalOverflow;
      window.__gdgc_splash_completed = true;
      window.dispatchEvent(new CustomEvent('gdgc:splash-complete'));
      if (onComplete) {
        onComplete();
      }
    }, 6200);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        document.body.style.overflow = originalOverflow;
        window.__gdgc_splash_completed = true;
        window.dispatchEvent(new CustomEvent('gdgc:splash-complete'));
        if (onComplete) onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <aside
      className="splash-overlay"
      data-splash-theme={theme}
      aria-label="Welcome to Google Developer Groups on Campus"
      role="status"
    >
      <div className="splash-stage">
        {/* Ambient Radial Energy Glow */}
        <div className="splash-glow" />

        {/* Magnetic Central Pull Core (visible during dispersion & convergence) */}
        <div className="splash-pull-core" aria-hidden="true" />

        {/* Rotating Decorative Orbit Rings (fade in upon logo assembly) */}
        <div className="splash-rings-container" aria-hidden="true">
          <svg
            className="splash-rings"
            viewBox="0 0 280 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="140" cy="140" r="125" stroke="#4285F4" strokeWidth="2" strokeDasharray="45 190" strokeLinecap="round" />
            <circle cx="140" cy="140" r="115" stroke="#EA4335" strokeWidth="2" strokeDasharray="55 170" strokeDashoffset="80" strokeLinecap="round" />
            <circle cx="140" cy="140" r="135" stroke="#34A853" strokeWidth="2" strokeDasharray="65 210" strokeDashoffset="150" strokeLinecap="round" />
            <circle cx="140" cy="140" r="105" stroke="#FBBC04" strokeWidth="2" strokeDasharray="40 160" strokeDashoffset="220" strokeLinecap="round" />
          </svg>
        </div>

        {/* ── STAGE 3: Solid Assembled Shapes (fuses particles into continuous pills) ── */}
        <svg
          className="splash-assembled-shapes"
          viewBox="-80 -80 160 160"
          aria-hidden="true"
        >
          {/* Red top-left bracket capsule */}
          <line x1="-13.9" y1="-28.5" x2="-54.3" y2="-10.9" stroke="#EA4335" strokeWidth="13" strokeLinecap="round" />
          {/* Green top-right bracket capsule */}
          <line x1="20.8" y1="-26.0" x2="66.0" y2="-0.4" stroke="#34A853" strokeWidth="13" strokeLinecap="round" />
          {/* Blue bottom-left bracket capsule */}
          <line x1="-66.9" y1="-0.5" x2="-21.9" y2="25.5" stroke="#4285F4" strokeWidth="13" strokeLinecap="round" />
          {/* Yellow bottom-right bracket capsule */}
          <line x1="13.2" y1="28.1" x2="53.4" y2="10.2" stroke="#FBBC04" strokeWidth="13" strokeLinecap="round" />
        </svg>

        {/* ── STAGE 1: Dino Entrance with Cactuses and Timed Jump Arcs ── */}
        <div className="splash-dino-scene">
          {/* Cactus 1 — Double-branch obstacle */}
          <div className="dino-cactus dino-cactus-1" aria-hidden="true">
            <svg viewBox="0 0 24 34" width="24" height="34" fill="currentColor">
              <rect x="9" y="0" width="6" height="34" />
              <rect x="2" y="10" width="8" height="4" />
              <rect x="2" y="4" width="4" height="8" />
              <rect x="14" y="14" width="8" height="4" />
              <rect x="18" y="8" width="4" height="8" />
            </svg>
          </div>

          {/* Cactus 2 — Tall branch obstacle */}
          <div className="dino-cactus dino-cactus-2" aria-hidden="true">
            <svg viewBox="0 0 22 36" width="22" height="36" fill="currentColor">
              <rect x="8" y="0" width="6" height="36" />
              <rect x="1" y="14" width="8" height="4" />
              <rect x="1" y="8" width="4" height="8" />
              <rect x="13" y="12" width="8" height="4" />
              <rect x="17" y="6" width="4" height="8" />
            </svg>
          </div>

          {/* Dino horizontal travel container */}
          <div className="dino-runner">
            {/* Dino dissolve & pixel shimmer container */}
            <div className="dino-dissolver">
              <svg
                className="splash-dino-svg"
                viewBox="0 0 88 90"
                width="88"
                height="90"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Torso & Head */}
                <g className="dino-body">
                  <rect x="38" y="2" width="36" height="8" />
                  <rect x="38" y="10" width="46" height="18" />
                  <rect x="46" y="6" width="8" height="8" className="dino-eye-cut" />
                  <rect x="66" y="22" width="18" height="4" className="dino-mouth-cut" />
                  <rect x="56" y="26" width="20" height="6" />
                  <rect x="34" y="26" width="18" height="12" />
                  <rect x="22" y="38" width="34" height="24" />
                  <rect x="56" y="44" width="6" height="10" />
                  <rect x="62" y="50" width="6" height="4" />
                  <rect x="12" y="42" width="10" height="16" />
                  <rect x="4" y="34" width="8" height="14" />
                  <rect x="0" y="26" width="6" height="10" />
                </g>

                {/* Alternating Running Legs & Jump Tuck Pose */}
                <g className="dino-leg dino-leg-left">
                  <rect x="36" y="62" width="10" height="10" />
                  <rect x="40" y="72" width="6" height="8" />
                  <rect x="40" y="80" width="12" height="6" />
                </g>
                <g className="dino-leg dino-leg-right">
                  <rect x="24" y="62" width="10" height="10" />
                  <rect x="26" y="72" width="6" height="8" />
                  <rect x="26" y="80" width="12" height="6" />
                </g>
              </svg>
            </div>
          </div>

          {/* Running Ground Track */}
          <div className="dino-ground-track" aria-hidden="true">
            <div className="dino-ground-line" />
            <div className="dino-ground-pebbles" />
          </div>
        </div>

        {/* ── STAGE 2 & 3: Disintegration & Swirling Assembly Particles ── */}
        <div className="splash-particles-layer" aria-hidden="true">
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className={`splash-particle particle-${p.colorName}`}
              style={{
                '--x0': `${p.x0}px`,
                '--y0': `${p.y0}px`,
                '--sx': `${p.sx}px`,
                '--sy': `${p.sy}px`,
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                '--size': `${p.size}px`,
                '--color': p.colorHex,
                '--delay': `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* ── FINAL ASSEMBLED LOGO ── */}
        <img
          src={theme === 'dark' ? '/GDGC-dark.png' : '/GDGC-Light.png'}
          alt="Google Developer Groups on Campus"
          className="splash-final-logo"
          draggable="false"
        />
      </div>

      {/* Brand Subtitle */}
      <span className="splash-brand-text">
        Google Developer Groups on Campus
      </span>
    </aside>
  );
}
