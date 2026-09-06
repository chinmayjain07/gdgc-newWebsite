import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLUES, CAMERAS, ENDING_SEQUENCE, FINAL_TITLE, FINAL_BRAND, AREA_LABELS } from './clues';

/**
 * BLACKOUT HUD — exfiltration meter, investigation log, clue reader,
 * security-camera overlay, keypad, ending sequence, mobile controls.
 * Styled to feel like facility UI, not a game UI.
 */

function ExfilBar({ leak }) {
  const blocks = 14;
  const filled = Math.round((leak / 100) * blocks);
  return (
    <div className="flex items-center gap-3 pointer-events-none">
      <div className="hidden sm:block font-mono text-[9px] tracking-[0.22em] text-red-400/80">
        DATA EXFILTRATION
      </div>
      <div className="font-mono text-[11px] sm:text-xs tracking-widest text-amber-300">
        {'█'.repeat(filled)}
        <span className="text-slate-600">{'░'.repeat(blocks - filled)}</span>
        <span className="ml-2 text-red-400">{leak}%</span>
      </div>
    </div>
  );
}

function ClueReader({ clue, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="max-w-md w-full border border-amber-500/30 bg-[#0a0d12]/95 p-5 font-mono shadow-2xl shadow-amber-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[9px] tracking-[0.3em] text-amber-500/80 mb-1">
          EVIDENCE — {clue.code}
        </div>
        <div className="text-sm text-slate-100 font-bold tracking-wider mb-4">
          {clue.title.toUpperCase()}
        </div>
        <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-300">
          {clue.detail}
        </pre>
        <button
          onClick={onClose}
          className="mt-5 w-full py-2 border border-slate-700 text-slate-400 text-[10px] tracking-[0.25em] hover:border-amber-500/50 hover:text-amber-300 transition-colors cursor-pointer"
        >
          CLOSE
        </button>
      </motion.div>
    </motion.div>
  );
}

function CameraOverlay({ camId, onClose }) {
  const cam = CAMERAS[camId];
  const [noiseSeed, setNoiseSeed] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setNoiseSeed((s) => s + 1), 120);
    return () => clearInterval(i);
  }, []);
  if (!cam) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-black/92 flex items-center justify-center p-4 pointer-events-auto"
    >
      <motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        className="relative w-full max-w-2xl aspect-video bg-[#04070a] border border-slate-700/70 overflow-hidden font-mono"
      >
        {/* Simulated footage */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(140,160,180,0.06) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)',
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500/60 text-[10px] tracking-[0.3em]">
          <div className="text-slate-400/80 text-xs mb-2">{cam.label}</div>
          {cam.lines.map((l, i) => (
            <div key={i} className="my-0.5">{l}</div>
          ))}
        </div>

        {/* Noise blocks */}
        <div
          key={noiseSeed}
          className="absolute inset-0 opacity-[0.07]"
          style={{
            background: `url("data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='60' height='60' fill='white'/></svg>`
            )}")`,
            backgroundSize: '60px 60px',
            transform: `translateY(${(noiseSeed % 4) * 7}px)`,
          }}
        />

        {/* Scanline sweep */}
        <motion.div
          className="absolute left-0 right-0 h-8 bg-white/[0.03]"
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* HUD chrome */}
        <div className="absolute top-3 left-4 text-red-500/90 text-[11px] tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> REC ●
        </div>
        <div className="absolute top-3 right-4 text-slate-300 text-[11px] tracking-widest">
          {cam.time}
        </div>
        <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 tracking-widest">
          {cam.node}
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] text-amber-500/70 tracking-widest">
          SIGNAL: WEAK
        </div>
      </motion.div>

      <button
        onClick={onClose}
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 px-6 py-2 border border-slate-700 text-slate-400 text-[10px] tracking-[0.3em] hover:border-slate-500 hover:text-slate-200 transition-colors cursor-pointer font-mono"
      >
        CLOSE FEED
      </button>
    </motion.div>
  );
}

function Keypad({ onSubmit, error, onClose }) {
  const [code, setCode] = useState('');
  const press = useCallback(
    (d) => {
      if (code.length < 4) setCode((c) => c + d);
    },
    [code.length]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94 }}
        animate={error ? { x: [0, -6, 6, -4, 0] } : { x: 0 }}
        transition={error ? { duration: 0.35 } : undefined}
        className="border border-slate-600/60 bg-[#0a0d12]/95 p-6 font-mono shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[9px] tracking-[0.3em] text-red-400/80 mb-1 text-center">
          SECURITY OVERRIDE
        </div>
        <div className="text-[10px] text-slate-500 tracking-widest mb-4 text-center">
          CONTROL ROOM ACCESS
        </div>
        <div
          className={`w-40 mx-auto mb-4 py-2 text-center text-xl tracking-[0.5em] border ${
            error ? 'border-red-500 text-red-400' : 'border-slate-700 text-emerald-400'
          }`}
        >
          {code.padEnd(4, '·')}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '↵'].map((d) => (
            <button
              key={d}
              onClick={() => {
                if (d === 'C') setCode('');
                else if (d === '↵') {
                  if (code.length === 4) onSubmit(code);
                } else press(d);
              }}
              className="w-12 h-12 border border-slate-700/80 text-slate-300 text-sm hover:border-emerald-500/60 hover:text-emerald-300 active:bg-slate-800 transition-colors cursor-pointer"
            >
              {d}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InvestigationLog({ found, onClose }) {
  const foundClues = CLUES.filter((c) => found.includes(c.id));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-black/78 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full border border-slate-700/70 bg-[#0a0d12]/95 p-5 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[9px] tracking-[0.35em] text-red-400/80 mb-1">BLACKOUT</div>
        <div className="text-sm text-slate-200 tracking-wider mb-1">
          INVESTIGATION LOG
        </div>
        <div className="text-[10px] text-amber-400/80 mb-4 tracking-widest">
          CLUES FOUND: {foundClues.length} / {CLUES.length}
        </div>
        {foundClues.length === 0 ? (
          <div className="text-[11px] text-slate-500 italic">
            No evidence recovered yet. Search the facility.
          </div>
        ) : (
          <div className="space-y-2">
            {foundClues.map((c) => (
              <div key={c.id} className="border-l-2 border-amber-500/40 pl-3">
                <div className="text-[11px] text-slate-200">
                  {c.code} — {c.title}
                </div>
                <div className="text-[9px] text-slate-500 tracking-wider">
                  {c.location}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 text-[9px] text-slate-600 tracking-[0.2em]">
          UNDISCOVERED EVIDENCE NOT SHOWN
        </div>
        <button
          onClick={onClose}
          className="mt-3 w-full py-2 border border-slate-700 text-slate-400 text-[10px] tracking-[0.25em] hover:border-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
        >
          RESUME INVESTIGATION
        </button>
      </motion.div>
    </motion.div>
  );
}

function EndingOverlay({ step, done, onExit }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center font-mono pointer-events-auto"
    >
      {ENDING_SEQUENCE.map((item, i) => (
        <motion.div
          key={item.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: step > i ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className={`text-sm sm:text-base tracking-[0.3em] mb-3 ${
            i < 4 ? 'text-emerald-400' : 'text-amber-300'
          }`}
        >
          {step > i ? item.text : ''}
        </motion.div>
      ))}

      {done && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="mt-8"
          >
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
              {FINAL_TITLE[0]}
              <br />
              <span className="text-slate-400">{FINAL_TITLE[1]}</span>
            </h1>
            <div className="mt-5 text-slate-500 tracking-[0.35em] text-xs">
              {FINAL_BRAND}
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            onClick={onExit}
            className="mt-10 px-6 py-2.5 border border-emerald-500/40 text-emerald-400 text-[10px] tracking-[0.3em] hover:bg-emerald-500/10 transition-colors cursor-pointer"
          >
            PRESS ESC TO RETURN
          </motion.button>
        </>
      )}
    </motion.div>
  );
}

function MobileControls({ onJoystick, onLook, onInteractDown, onInteractUp, onToggleLog, flashlight, onToggleFlashlight, battery }) {
  const joyRef = useRef(null);
  const joyState = useRef({ active: false, id: null, cx: 0, cy: 0 });
  const lookState = useRef({ active: false, id: null, lx: 0, ly: 0 });

  const onJoyStart = (e) => {
    const t = e.changedTouches[0];
    joyState.current = { active: true, id: t.identifier, cx: t.clientX, cy: t.clientY };
  };
  const onJoyMove = (e) => {
    const s = joyState.current;
    if (!s.active) return;
    for (const t of e.changedTouches) {
      if (t.identifier === s.id) {
        const dx = Math.max(-1, Math.min(1, (t.clientX - s.cx) / 48));
        const dy = Math.max(-1, Math.min(1, (t.clientY - s.cy) / 48));
        onJoystick(dx, dy);
      }
    }
  };
  const onJoyEnd = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === joyState.current.id) {
        joyState.current.active = false;
        onJoystick(0, 0);
      }
    }
  };

  const onLookStart = (e) => {
    const t = e.changedTouches[0];
    lookState.current = { active: true, id: t.identifier, lx: t.clientX, ly: t.clientY };
  };
  const onLookMove = (e) => {
    const s = lookState.current;
    if (!s.active) return;
    for (const t of e.changedTouches) {
      if (t.identifier === s.id) {
        onLook((t.clientX - s.lx) * 1.6, (t.clientY - s.ly) * 1.6);
        s.lx = t.clientX;
        s.ly = t.clientY;
      }
    }
  };
  const onLookEnd = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === lookState.current.id) {
        lookState.current.active = false;
      }
    }
  };

  return (
    <>
      {/* Left: movement joystick */}
      <div
        ref={joyRef}
        className="absolute left-6 bottom-24 z-30 w-32 h-32 rounded-full border border-slate-500/30 bg-slate-900/30 backdrop-blur-sm pointer-events-auto touch-none"
        onTouchStart={onJoyStart}
        onTouchMove={onJoyMove}
        onTouchEnd={onJoyEnd}
        onTouchCancel={onJoyEnd}
      >
        <div className="absolute inset-0 flex items-center justify-center text-[8px] tracking-[0.3em] text-slate-500 font-mono pointer-events-none">
          MOVE
        </div>
      </div>

      {/* Right: look area */}
      <div
        className="absolute right-0 top-16 bottom-40 w-[55%] z-20 pointer-events-auto touch-none"
        onTouchStart={onLookStart}
        onTouchMove={onLookMove}
        onTouchEnd={onLookEnd}
        onTouchCancel={onLookEnd}
      />

      {/* Action buttons */}
      <div className="absolute right-6 bottom-24 z-30 flex flex-col items-center gap-3 pointer-events-auto">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onToggleFlashlight();
          }}
          className="w-12 h-12 rounded-full border border-amber-500/40 bg-slate-900/40 text-amber-400/90 text-[8px] font-mono tracking-wider backdrop-blur-sm touch-none select-none"
        >
          {flashlight && battery > 0 ? 'LAMP' : 'OFF'}
        </button>
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onToggleLog();
          }}
          className="w-12 h-12 rounded-full border border-slate-500/40 bg-slate-900/40 text-slate-300 text-[8px] font-mono tracking-wider backdrop-blur-sm touch-none select-none"
        >
          LOG
        </button>
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onInteractDown();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInteractUp();
          }}
          className="w-20 h-20 rounded-full border border-emerald-500/50 bg-emerald-900/30 text-emerald-300 text-[10px] font-mono tracking-[0.2em] backdrop-blur-sm touch-none select-none"
        >
          USE
        </button>
      </div>
    </>
  );
}

export function BlackoutHUD(props) {
  const {
    clues,
    leak,
    area,
    prompt,
    battery,
    flashlight,
    logOpen,
    camera,
    keypad,
    keypadError,
    hold,
    paused,
    ending,
    endingStep,
    endingDone,
    toast,
    detail,
    isTouch,
    clueList,
    onResume,
    onExit,
    onToggleLog,
    onCloseCamera,
    onCloseKeypad,
    onCloseDetail,
    onKeypadSubmit,
    onToggleFlashlight,
    onJoystick,
    onLook,
    onInteractDown,
    onInteractUp,
  } = props;

  const foundIds = clueList.map((c) => c.id);

  const batteryColor =
    battery > 50 ? 'text-emerald-400' : battery > 20 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="absolute inset-0 font-mono text-white pointer-events-none z-20">
      {/* Flashlight vignette when off */}
      {!flashlight && !ending && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 180px 60px rgba(0,0,0,0.88)' }}
        />
      )}

      {!ending && (
        <>
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="text-[9px] tracking-[0.3em] text-red-400/90 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                BLACKOUT — SUBTERRA-7
              </div>
              <div className="text-[9px] tracking-[0.22em] text-slate-400">
                {AREA_LABELS[area] || 'MAIN CORRIDOR — SUB-LEVEL 3'}
              </div>
              <ExfilBar leak={leak} />
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={onToggleLog}
                className="hidden sm:block px-3 py-1.5 border border-slate-600/60 bg-black/40 text-[9px] tracking-[0.25em] text-slate-300 hover:border-slate-400 transition-colors cursor-pointer"
              >
                LOG [{clues} / {CLUES.length}]
              </button>
              <div className={`text-[9px] tracking-widest ${batteryColor} hidden sm:flex items-center gap-1.5 border border-slate-700/60 bg-black/40 px-2 py-1.5`}>
                <span className="inline-block w-3 h-1.5 border border-current relative">
                  <span
                    className="absolute inset-y-0 left-0 bg-current"
                    style={{ width: `${battery}%` }}
                  />
                </span>
                {Math.round(battery)}%
                <button
                  onClick={onToggleFlashlight}
                  className="ml-1 text-slate-500 hover:text-white cursor-pointer"
                  title="Toggle flashlight (F)"
                >
                  F
                </button>
              </div>
            </div>
          </div>

          {/* Interaction prompt + hold progress */}
          {prompt && !logOpen && !camera && !keypad && !detail && (
            <div className="absolute left-1/2 top-[58%] -translate-x-1/2 text-center">
              <div className="px-4 py-1.5 border border-amber-500/40 bg-black/60 text-[10px] tracking-[0.28em] text-amber-300">
                [E] {prompt.prompt}
              </div>
              {hold > 0 && (
                <div className="mx-auto mt-2 w-40 h-1 bg-slate-800">
                  <div
                    className="h-full bg-amber-400 transition-[width] duration-100"
                    style={{ width: `${hold * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-24 left-1/2 -translate-x-1/2 text-center px-5 py-2.5 border border-amber-500/40 bg-black/70"
              >
                <div className="text-[10px] tracking-[0.3em] text-amber-300 font-bold">
                  {toast.title}
                </div>
                {toast.sub && (
                  <div className="text-[9px] tracking-[0.2em] text-slate-400 mt-1">
                    {toast.sub}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile controls */}
          {isTouch && (
            <MobileControls
              onJoystick={onJoystick}
              onLook={onLook}
              onInteractDown={onInteractDown}
              onInteractUp={onInteractUp}
              onToggleLog={() => onToggleLog(true)}
              flashlight={flashlight}
              onToggleFlashlight={onToggleFlashlight}
              battery={battery}
            />
          )}

          {/* Pause overlay */}
          {paused && !ending && (
            <div
              className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center pointer-events-auto cursor-pointer"
              onClick={onResume}
            >
              <div className="text-[10px] tracking-[0.35em] text-red-400/80 mb-2">
                BLACKOUT PROTOCOL
              </div>
              <div className="text-lg tracking-[0.2em] text-slate-200 mb-6">
                INVESTIGATION SUSPENDED
              </div>
              <div className="max-w-xs w-full border border-slate-700/70 bg-[#0a0d12]/90 p-4 text-left text-[10px] text-slate-400 space-y-1.5">
                {isTouch ? (
                  <>
                    <div><span className="text-emerald-400">LEFT STICK:</span> Move</div>
                    <div><span className="text-emerald-400">DRAG RIGHT:</span> Look</div>
                    <div><span className="text-emerald-400">USE:</span> Interact / Hold</div>
                    <div><span className="text-emerald-400">LOG:</span> Investigation log</div>
                  </>
                ) : (
                  <>
                    <div><span className="text-emerald-400">WASD:</span> Move</div>
                    <div><span className="text-emerald-400">MOUSE:</span> Look</div>
                    <div><span className="text-emerald-400">SHIFT:</span> Sprint</div>
                    <div><span className="text-emerald-400">E:</span> Interact (hold for heavy actions)</div>
                    <div><span className="text-emerald-400">F:</span> Flashlight</div>
                    <div><span className="text-emerald-400">TAB:</span> Investigation log</div>
                    <div><span className="text-emerald-400">ESC:</span> Pause</div>
                  </>
                )}
              </div>
              <div className="mt-6 text-[10px] tracking-[0.3em] text-slate-500">
                {isTouch ? 'TAP TO CONTINUE' : 'CLICK TO CONTINUE'}
              </div>
            </div>
          )}
        </>
      )}

      {/* Overlays */}
      <AnimatePresence>
        {detail && <ClueReader clue={detail.clue} onClose={onCloseDetail} />}
      </AnimatePresence>
      <AnimatePresence>
        {camera && <CameraOverlay camId={camera} onClose={onCloseCamera} />}
      </AnimatePresence>
      <AnimatePresence>
        {keypad && (
          <Keypad onSubmit={onKeypadSubmit} error={keypadError} onClose={onCloseKeypad} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {logOpen && <InvestigationLog found={foundIds} onClose={() => onToggleLog(false)} />}
      </AnimatePresence>

      {/* Ending */}
      {ending && (
        <EndingOverlay step={endingStep} done={endingDone} onExit={onExit} />
      )}

      {/* Exit during play — from pause screen */}
      {!ending && paused && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 text-[9px] tracking-[0.3em] text-slate-600 hover:text-slate-300 pointer-events-auto cursor-pointer font-mono"
        >
          ABANDON INVESTIGATION
        </button>
      )}
    </div>
  );
}

export default BlackoutHUD;
