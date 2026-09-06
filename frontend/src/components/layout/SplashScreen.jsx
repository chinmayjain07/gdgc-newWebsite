import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import './SplashScreen.css';

// 48 deterministic particles across the 4 brand colors:
// Red (top-left), Green (top-right), Blue (bottom-left), Yellow (bottom-right)
const COLOR_CONFIG = [
  { name: 'red', color: '#EA4335', targetBase: { x: -34.1, y: -19.7 }, angle: 156.4, span: 22 },
  { name: 'green', color: '#34A853', targetBase: { x: 43.4, y: -13.2 }, angle: -150.5, span: 26 },
  { name: 'blue', color: '#4285F4', targetBase: { x: -44.4, y: 12.5 }, angle: -150.1, span: 26 },
  { name: 'yellow', color: '#FBBC04', targetBase: { x: 33.3, y: 19.1 }, angle: 156.0, span: 22 },
];

const PARTICLES = (() => {
  const list = [];
  let id = 0;
  COLOR_CONFIG.forEach((cfg) => {
    for (let k = 0; k < 12; k++) {
      const i = id++;
      // Starting location clustered around dino center
      const x0 = Math.round(((i * 17 + 7) % 52) - 26);
      const y0 = Math.round(((i * 23 + 11) % 54) - 27);

      // Stage 2: Wide scatter explosion outward (240px to 390px radius)
      const theta = (i / 48) * 2 * Math.PI + (((i * 7) % 9) - 4) * 0.08;
      const rScatter = 240 + ((i * 19) % 150);
      const sx = Math.round(Math.cos(theta) * rScatter);
      const sy = Math.round(Math.sin(theta) * rScatter);

      // Mid-scatter orbital swirl waypoint (continued motion during spread)
      const thetaSpread = theta + 0.5;
      const rSpread = rScatter * 1.08;
      const mx = Math.round(Math.cos(thetaSpread) * rSpread);
      const my = Math.round(Math.sin(thetaSpread) * rSpread);

      // Stage 3: Target positions aligned along GDGC logo pill shape geometries
      const rad = (cfg.angle * Math.PI) / 180;
      const t = ((k / 11) - 0.5) * 2 * cfg.span;
      const tx = Math.round(cfg.targetBase.x + t * Math.cos(rad));
      const ty = Math.round(cfg.targetBase.y + t * Math.sin(rad));

      // Magnetic vortex midpoint for curved inward swirl
      const rVortex = (rScatter * 0.42 + Math.hypot(tx, ty) * 0.58) * 1.15;
      const thetaVortex = theta + 1.45;
      const vx = Math.round(Math.cos(thetaVortex) * rVortex);
      const vy = Math.round(Math.sin(thetaVortex) * rVortex);

      list.push({
        id: i,
        colorName: cfg.name,
        colorHex: cfg.color,
        x0,
        y0,
        sx,
        sy,
        mx,
        my,
        vx,
        vy,
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
      if (onComplete) {
        onComplete();
      }
    }, 6200);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        document.body.style.overflow = originalOverflow;
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

        {/* Rotating Decorative Orbit Rings (fade in upon logo assembly) */}
        <svg
          className="splash-rings"
          viewBox="0 0 280 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="140" cy="140" r="125" stroke="#4285F4" strokeWidth="1.5" strokeDasharray="45 190" strokeLinecap="round" />
          <circle cx="140" cy="140" r="115" stroke="#EA4335" strokeWidth="1.5" strokeDasharray="55 170" strokeDashoffset="80" strokeLinecap="round" />
          <circle cx="140" cy="140" r="135" stroke="#34A853" strokeWidth="1.5" strokeDasharray="65 210" strokeDashoffset="150" strokeLinecap="round" />
          <circle cx="140" cy="140" r="105" stroke="#FBBC04" strokeWidth="1.5" strokeDasharray="40 160" strokeDashoffset="220" strokeLinecap="round" />
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
                '--mx': `${p.mx}px`,
                '--my': `${p.my}px`,
                '--vx': `${p.vx}px`,
                '--vy': `${p.vy}px`,
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
          src="/gdgc-logo.png"
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
