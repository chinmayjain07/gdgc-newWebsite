import { motion, AnimatePresence } from 'framer-motion';

export function GameHUD({
  health,
  maxHealth,
  ammo,
  maxAmmo,
  kills,
  targetKills,
  bossHealth,
  bossMaxHealth,
  isBossActive,
  showHitMarker,
  isDamaged,
  isLocked,
  isVictory,
  onReturnToSite,
  onClickToLock,
}) {
  const hpPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  const bossHpPercent =
    bossHealth !== null ? Math.max(0, Math.min(100, (bossHealth / bossMaxHealth) * 100)) : 100;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none font-mono text-white overflow-hidden">
      {/* ── Red Damage Vignette on Hit ───────────────────────────────── */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 pointer-events-none ${
          isDamaged ? 'opacity-80' : 'opacity-0'
        }`}
        style={{
          boxShadow: 'inset 0 0 100px 30px rgba(239, 68, 68, 0.75)',
        }}
      />

      {/* ── Top Bar: Developer Diagnostic Header ─────────────────────── */}
      {!isVictory && (
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-xs tracking-wider opacity-80">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">NODE: UNKNOWN</span>
            <span className="text-slate-500">|</span>
            <span className="text-sky-400">SIGNAL: 98%</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400">STATUS: ACTIVE</span>
          </div>

          <div className="text-slate-400 hidden sm:block">
            [ESC TO PAUSE / RELEASE MOUSE]
          </div>
        </div>
      )}

      {/* ── Boss Health Bar (Top Center) ────────────────────────────── */}
      {isBossActive && !isVictory && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 w-80 sm:w-96 flex flex-col items-center gap-1.5"
        >
          <div className="flex items-center justify-between w-full text-xs font-bold text-fuchsia-400">
            <span>⚠ SYSTEM CORE: THE BUG</span>
            <span>{Math.round(bossHpPercent)}%</span>
          </div>
          <div className="w-full h-3 bg-black/60 border border-fuchsia-500/50 rounded-full overflow-hidden p-0.5 shadow-lg shadow-fuchsia-500/20">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 rounded-full transition-all duration-150"
              style={{ width: `${bossHpPercent}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* ── Target Progress Indicator (When Boss not yet active) ──────── */}
      {!isBossActive && !isVictory && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/40 border border-slate-700/60 backdrop-blur text-xs flex items-center gap-2">
          <span className="text-slate-400">HOSTILE ENTITIES:</span>
          <span className="text-sky-400 font-bold">
            {kills} / {targetKills}
          </span>
        </div>
      )}

      {/* ── Minimalist Crosshair & Hit Marker ───────────────────────── */}
      {!isVictory && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* Main Crosshair */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="absolute w-2 h-0.5 bg-cyan-400 left-0" />
            <div className="absolute w-2 h-0.5 bg-cyan-400 right-0" />
            <div className="absolute w-0.5 h-2 bg-cyan-400 top-0" />
            <div className="absolute w-0.5 h-2 bg-cyan-400 bottom-0" />
            <div className="w-1 h-1 rounded-full bg-cyan-300" />
          </div>

          {/* Hit Marker 'X' */}
          <AnimatePresence>
            {showHitMarker && (
              <motion.div
                initial={{ scale: 1.5, opacity: 1 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="absolute text-red-500 font-bold text-xl pointer-events-none"
              >
                ✕
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Bottom HUD: Health & Ammo ───────────────────────────────── */}
      {!isVictory && (
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          {/* Health Box */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span>HP</span>
              <span>
                {health} / {maxHealth}
              </span>
            </div>
            <div className="w-48 sm:w-56 h-3 bg-black/60 border border-emerald-500/50 rounded-sm overflow-hidden p-0.5">
              <div
                className={`h-full rounded-sm transition-all duration-150 ${
                  hpPercent < 30
                    ? 'bg-rose-500 animate-pulse'
                    : hpPercent < 60
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Ammo Box */}
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs font-bold text-sky-400 tracking-wider">
              AMMO
            </div>
            <div className="flex items-baseline gap-1 text-2xl sm:text-3xl font-bold">
              <span className={ammo === 0 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}>
                {ammo}
              </span>
              <span className="text-sm text-slate-500">/ {maxAmmo}</span>
            </div>
            <span className="text-[10px] text-slate-500">[R TO RELOAD]</span>
          </div>
        </div>
      )}

      {/* ── Pointer Unlock / Pause Overlay ─────────────────────────── */}
      {/* This overlay is clickable and directly triggers pointer lock */}
      {!isLocked && !isVictory && (
        <div
          className="absolute inset-0 pointer-events-auto bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center cursor-pointer"
          onClick={(e) => {
            // Only trigger lock if we clicked the backdrop, not the return button
            if (onClickToLock) onClickToLock();
          }}
        >
          <div className="p-8 max-w-md rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 flex flex-col items-center gap-5">
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
              SYSTEM PAUSED
            </div>
            <h2 className="text-xl font-bold text-white">CLICK TO ENGAGE CONTROLS</h2>
            <div className="text-xs text-slate-400 space-y-1 text-left w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div><strong className="text-cyan-300">WASD:</strong> Move</div>
              <div><strong className="text-cyan-300">MOUSE:</strong> Look around</div>
              <div><strong className="text-cyan-300">LEFT CLICK:</strong> Fire pulse blaster</div>
              <div><strong className="text-cyan-300">SHIFT:</strong> Sprint</div>
              <div><strong className="text-cyan-300">SPACE:</strong> Jump</div>
              <div><strong className="text-cyan-300">R:</strong> Reload</div>
              <div><strong className="text-cyan-300">ESC:</strong> Pause / Return</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Don't trigger pointer lock
                onReturnToSite();
              }}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors pointer-events-auto"
            >
              ← Return to GDGC Terminal
            </button>
          </div>
        </div>
      )}

      {/* ── Victory / Completion Screen ─────────────────────────────── */}
      {isVictory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 pointer-events-auto bg-black flex flex-col items-center justify-center p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col items-center gap-6 max-w-lg"
          >
            <div className="text-emerald-400 text-sm tracking-widest font-bold animate-pulse">
              SYSTEM RESTORED
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              YOU FOUND WHAT
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
                WAS NEVER ANNOUNCED.
              </span>
            </h1>

            <div className="text-lg text-slate-400 font-semibold tracking-wider">
              GDGC PCCOE
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
              className="mt-6 flex flex-col items-center gap-3"
            >
              <button
                onClick={onReturnToSite}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                PRESS ESC TO RETURN
              </button>
              <span className="text-[11px] text-slate-500">
                (or click button above to return to terminal)
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
