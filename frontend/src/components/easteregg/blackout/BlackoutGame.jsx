import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Facility } from './Facility';
import { PlayerSystem } from './PlayerSystem';
import { blackoutAudio } from './Ambience';
import { BlackoutHUD } from './BlackoutHUD';
import { CLUES, KEYPAD_CODE, areaAt } from './clues';

/**
 * BLACKOUT — cinematic clue-finding investigation game.
 * First-person exploration of a fictional underground research facility.
 * Desktop: pointer lock + WASD + E + TAB. Mobile: joystick + drag + buttons.
 * Full WebGL disposal on unmount.
 */
export function BlackoutGame({ onExit }) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const foundRef = useRef(new Set());
  const holdRef = useRef({ active: null, progress: 0 });
  const leakRef = useRef(62);
  const pausedRef = useRef(false);

  const [hud, setHud] = useState({
    clues: 0,
    leak: 62,
    area: 'checkpoint',
    prompt: null,
    battery: 100,
    flashlight: true,
    logOpen: false,
    camera: null,
    keypad: false,
    keypadError: false,
    hold: 0,
    paused: true,
    ending: false,
    endingStep: -1,
    endingDone: false,
    toast: null,
    detail: null,
    isTouch: false,
  });
  const hudRef = useRef(hud);
  const setHudPatch = useCallback((patch) => {
    hudRef.current = { ...hudRef.current, ...patch };
    setHud((prev) => ({ ...prev, ...patch }));
  }, []);

  const showToast = useCallback(
    (toast) => {
      setHudPatch({ toast });
      setTimeout(() => {
        if (hudRef.current.toast === toast) setHudPatch({ toast: null });
      }, 4200);
    },
    [setHudPatch]
  );

  // ── Engine bootstrap ────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const isTouch =
      'ontouchstart' in window ||
      (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
    const quality = isTouch ? 'low' : 'high';

    setHudPatch({ isTouch });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);

    const camera = new THREE.PerspectiveCamera(
      72,
      window.innerWidth / window.innerHeight,
      0.08,
      80
    );
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isTouch,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.4 : 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const facility = new Facility(scene, { quality });
    if (quality === 'high') facility.initSparkParticles();

    const player = new PlayerSystem(camera, renderer.domElement, facility, { isTouch });

    engineRef.current = {
      scene,
      camera,
      renderer,
      facility,
      player,
      clock: new THREE.Clock(),
      raf: 0,
      leakTimer: 0,
      alarmTimer: 0,
      disposed: false,
    };

    // ── Pointer lock / pause (desktop) ────────────────────────────────
    player.onLockChange = (locked) => {
      if (isTouch) return;
      pausedRef.current = !locked;
      setHudPatch({ paused: !locked });
    };

    player.onFootstep = () => blackoutAudio.footstep();

    // Start locked-down on desktop: player must click to engage (like FPS).
    // On touch devices there is no pointer lock — start unpaused.
    if (isTouch) {
      pausedRef.current = false;
      setHudPatch({ paused: false });
    } else {
      pausedRef.current = true;
      setHudPatch({ paused: true });
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Interact key ──────────────────────────────────────────────────
    const interactMeshes = facility.interactables.map((it) => it.mesh);

    const onKeyDown = (e) => {
      if (e.code === 'KeyE') player.setInteractHeld(true);
      if (e.code === 'Tab') {
        e.preventDefault();
        setHudPatch({ logOpen: !hudRef.current.logOpen });
      }
    };
    const onKeyUp = (e) => {
      if (e.code === 'KeyE') player.setInteractHeld(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // ── Main loop ─────────────────────────────────────────────────────
    let lastPromptId = null;
    let lastArea = '';

    const animate = () => {
      if (engineRef.current.disposed) return;
      engineRef.current.raf = requestAnimationFrame(animate);

      const { facility: fac, player: pl, clock } = engineRef.current;
      const delta = Math.min(clock.getDelta(), 0.06);
      const elapsed = clock.getElapsedTime();
      const ending = hudRef.current.ending;

      if (!ending && !hudRef.current.paused) {
        pl.update(delta, fac.colliders, false);

        // Interact raycast
        const target = pl.getInteractTarget(fac.interactables, interactMeshes);
        const prompt = target && !hudRef.current.logOpen && !hudRef.current.keypad && !hudRef.current.camera
          ? { kind: target.entry.kind, id: target.entry.id, prompt: target.entry.prompt }
          : null;

        if ((prompt && prompt.id) !== lastPromptId) {
          lastPromptId = prompt ? prompt.id : null;
          setHudPatch({ prompt });
        }

        // Hold interactions (breaker / final trace)
        const holding = pl.interactHeld && prompt && (prompt.kind === 'breaker' || prompt.kind === 'final');
        if (holding && holdRef.current.active === prompt.id) {
          holdRef.current.progress = Math.min(1, holdRef.current.progress + delta / (prompt.kind === 'breaker' ? 2 : 3));
          if (holdRef.current.progress >= 1) {
            holdRef.current.active = null;
            holdRef.current.progress = 0;
            setHudPatch({ hold: 0 });
            if (prompt.kind === 'breaker') restorePower();
            else beginEnding();
          } else {
            setHudPatch({ hold: holdRef.current.progress });
          }
        } else if (holdRef.current.active || holdRef.current.progress > 0) {
          holdRef.current.active = null;
          holdRef.current.progress = 0;
          setHudPatch({ hold: 0 });
        }
        if (holding && holdRef.current.active !== prompt.id && holdRef.current.progress === 0) {
          holdRef.current.active = prompt.id;
        }

        // Instant interactions
        if (pl.interactHeld && prompt && prompt.kind === 'clue') {
          pl.setInteractHeld(false);
          discoverClue(prompt.id);
        }
        if (pl.interactHeld && prompt && prompt.kind === 'camera') {
          pl.setInteractHeld(false);
          setHudPatch({ camera: prompt.data, logOpen: false });
          blackoutAudio.glitch();
        }
        if (pl.interactHeld && prompt && prompt.kind === 'keypad') {
          pl.setInteractHeld(false);
          setHudPatch({ keypad: true });
          blackoutAudio.uiBeep();
        }

        // Data leak progression
        engineRef.current.leakTimer += delta;
        if (engineRef.current.leakTimer >= 4) {
          engineRef.current.leakTimer = 0;
          leakRef.current = Math.min(99, leakRef.current + 0.5);
          setHudPatch({ leak: Math.floor(leakRef.current) });
        }

        // Area label
        const area = areaAt(pl.camera.position.x, pl.camera.position.z);
        if (area !== lastArea) {
          lastArea = area;
          setHudPatch({ area });
        }

        // Alarm escalation at high leak
        engineRef.current.alarmTimer -= delta;
        if (leakRef.current > 85 && engineRef.current.alarmTimer <= 0) {
          engineRef.current.alarmTimer = 9 - (leakRef.current - 85) * 0.25;
          blackoutAudio.alarm();
        }
      }

      const tension = leakRef.current / 100;
      fac.update(delta, elapsed, pl.camera.position, tension);
      fac.updateSparkParticles(delta);

      renderer.render(scene, camera);
    };

    engineRef.current.raf = requestAnimationFrame(animate);

    blackoutAudio.startAmbience();

    // ── Interaction handlers ──────────────────────────────────────────
    function discoverClue(id) {
      if (foundRef.current.has(id)) return;
      const clue = CLUES.find((c) => c.id === id);
      if (!clue) return;
      foundRef.current.add(id);
      blackoutAudio.clueFound();
      leakRef.current = Math.max(0, leakRef.current - 3);
      setHudPatch({
        clues: foundRef.current.size,
        detail: { clue },
        leak: Math.floor(leakRef.current),
      });
      showToast({ title: 'CLUE DISCOVERED', sub: `${clue.code} — ${clue.title}` });

      if (foundRef.current.size >= CLUES.length) {
        const fac = engineRef.current.facility;
        fac.unlockDoor('final');
        fac.setDoorReason('final', 'CONTAINMENT RELEASED');
        setTimeout(() => {
          showToast({ title: 'CONTAINMENT RELEASED', sub: 'FINAL SERVER CHAMBER UNSEALED' });
        }, 4400);
      }
    }

    function restorePower() {
      if (engineRef.current.powerRestored) return;
      engineRef.current.powerRestored = true;
      const fac = engineRef.current.facility;
      fac.setPower(true);
      fac.unlockDoor('serverroom');
      fac.setDoorReason('serverroom', 'MAGLOCK RELEASED');
      blackoutAudio.grant();
      leakRef.current = Math.min(99, leakRef.current + 4);
      setHudPatch({ leak: Math.floor(leakRef.current) });
      showToast({ title: 'POWER RESTORED', sub: 'SERVER FARM MAGLOCK RELEASED' });
    }

    function beginEnding() {
      setHudPatch({ ending: true, endingStep: 0, prompt: null });
      player.unlock();
      blackoutAudio.grant();
    }

    const returnCleanup = () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
    engineRef.current.returnCleanup = returnCleanup;

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      returnCleanup();
      player.dispose();
      facility.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (engineRef.current) {
        cancelAnimationFrame(engineRef.current.raf);
        engineRef.current.disposed = true;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Keypad ──────────────────────────────────────────────────────────
  const handleKeypadSubmit = useCallback(
    (code) => {
      if (code === KEYPAD_CODE) {
        const fac = engineRef.current.facility;
        fac.unlockDoor('controlroom');
        fac.setDoorReason('controlroom', 'OVERRIDE ACCEPTED');
        blackoutAudio.grant();
        leakRef.current = Math.min(99, leakRef.current + 3);
        setHudPatch({ keypad: false, leak: Math.floor(leakRef.current) });
        showToast({ title: 'OVERRIDE ACCEPTED', sub: 'CONTROL ROOM UNSEALED' });
      } else {
        blackoutAudio.deny();
        setHudPatch({ keypadError: true });
        setTimeout(() => setHudPatch({ keypadError: false }), 700);
      }
    },
    [setHudPatch, showToast]
  );

  const handleExit = useCallback(() => {
    blackoutAudio.stopAll();
    onExit();
  }, [onExit]);

  const handleResume = useCallback(() => {
    if (hudRef.current.isTouch) {
      pausedRef.current = false;
      setHudPatch({ paused: false });
    } else if (engineRef.current) {
      engineRef.current.player.lock();
    }
  }, [setHudPatch]);

  // ── Ending sequence driver ──────────────────────────────────────────
  useEffect(() => {
    if (!hud.ending || hud.endingDone) return undefined;
    const timers = [];
    const sequence = [1, 2, 3, 4, 5];
    sequence.forEach((step, i) => {
      timers.push(setTimeout(() => {
        setHudPatch({ endingStep: step });
        blackoutAudio.uiBeep();
      }, 1600 * (i + 1)));
    });
    timers.push(setTimeout(() => setHudPatch({ endingDone: true }), 1600 * 6));
    return () => timers.forEach(clearTimeout);
  }, [hud.ending, hud.endingDone, setHudPatch]);

  // ESC returns to the website once the ending completes
  useEffect(() => {
    if (!hud.endingDone) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') handleExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hud.endingDone, handleExit]);

  return (
    <div className="absolute inset-0 overflow-hidden select-none bg-black">
      <div ref={containerRef} className="w-full h-full" />
      <BlackoutHUD
        {...hud}
        clueList={CLUES.filter((c) => foundRef.current.has(c.id))}
        onResume={handleResume}
        onExit={handleExit}
        onToggleLog={(open) => setHudPatch({ logOpen: open })}
        onCloseCamera={() => setHudPatch({ camera: null })}
        onCloseKeypad={() => setHudPatch({ keypad: false })}
        onCloseDetail={() => setHudPatch({ detail: null })}
        onKeypadSubmit={handleKeypadSubmit}
        onToggleFlashlight={() => {
          const on = engineRef.current.player.toggleFlashlight();
          setHudPatch({ flashlight: !!on, battery: engineRef.current.player.battery });
        }}
        onJoystick={(x, y) => engineRef.current.player.setJoystick(x, y)}
        onLook={(dx, dy) => engineRef.current.player.addLook(dx, dy)}
        onInteractDown={() => engineRef.current.player.setInteractHeld(true)}
        onInteractUp={() => engineRef.current.player.setInteractHeld(false)}
      />
    </div>
  );
}

export default BlackoutGame;
