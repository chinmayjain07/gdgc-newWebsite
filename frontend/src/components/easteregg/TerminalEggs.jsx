import { useEffect, useRef, useState } from 'react';

export function PixelDino() {
  return (
    <div className="t egg-dino-track" aria-hidden="true">
      <svg className="t egg-dino" viewBox="0 0 24 16" width="72" height="48">
        <g fill="#7ee787">
          <rect x="14" y="1" width="3" height="3" />
          <rect x="17" y="2" width="2" height="2" />
          <rect x="13" y="4" width="5" height="4" />
          <rect x="10" y="6" width="4" height="2" />
          <rect x="8" y="7" width="3" height="2" />
          <rect x="12" y="8" width="6" height="3" />
          <rect x="12" y="11" width="3" height="4" />
          <rect x="16" y="11" width="2" height="4" />
          <rect x="20" y="5" width="2" height="2" />
          <rect x="19" y="4" width="1" height="1" />
        </g>
        <rect x="17" y="2" width="1" height="1" fill="#0a0f1c" />
      </svg>
    </div>
  );
}

const MATRIX_CHARS = '01<>/{}[]();=+-#$%&@!?abcdefghijklmnopqrstuvwxyz';

export function MatrixRain({ columns = 14 }) {
  const [cols, setCols] = useState(() =>
    Array.from({ length: columns }, (_, i) => ({
      id: i,
      chars: Array.from({ length: 18 }, () =>
        MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      ).join(''),
      offset: Math.random() * 8,
      duration: 1.4 + Math.random() * 1.4,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCols((prev) =>
        prev.map((c) => ({
          ...c,
          chars: c.chars
            .split('')
            .map(() => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)])
            .join(''),
        }))
      );
    }, 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="t egg-matrix" aria-hidden="true">
      {cols.map((c) => (
        <div
          key={c.id}
          className="t egg-matrix-col"
          style={{
            animationDuration: `${c.duration}s`,
            animationDelay: `-${c.offset}s`,
          }}
        >
          {c.chars.split('').map((ch, i) => (
            <span key={i} className={i === 0 ? 'head' : undefined}>
              {ch}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

export function useKonami(enabled, onUnlock) {
  const bufferRef = useRef([]);

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (e.key.startsWith('Arrow')) e.preventDefault();
      }

      bufferRef.current.push(e.code);
      if (bufferRef.current.length > KONAMI_SEQUENCE.length) {
        bufferRef.current.shift();
      }

      const matches = KONAMI_SEQUENCE.every(
        (code, i) => bufferRef.current[i] === code
      );
      if (matches && bufferRef.current.length === KONAMI_SEQUENCE.length) {
        bufferRef.current = [];
        onUnlock();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onUnlock]);
}
