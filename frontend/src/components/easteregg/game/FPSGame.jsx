import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GameWorld } from './GameWorld';
import { PlayerController } from './PlayerController';
import { WeaponSystem } from './WeaponSystem';
import { EnemyManager } from './EnemyManager';
import { BossBug } from './BossBug';
import { GameHUD } from './GameHUD';

export function FPSGame({ onReturnToSite }) {
  const containerRef = useRef(null);

  // HUD State
  const [health, setHealth] = useState(100);
  const [maxHealth] = useState(100);
  const [ammo, setAmmo] = useState(30);
  const [maxAmmo] = useState(30);
  const [kills, setKills] = useState(0);
  const targetKills = 7;

  const [bossHealth, setBossHealth] = useState(null);
  const [bossMaxHealth, setBossMaxHealth] = useState(30);
  const [isBossActive, setIsBossActive] = useState(false);

  const [showHitMarker, setShowHitMarker] = useState(false);
  const [isDamaged, setIsDamaged] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  // References
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    world: null,
    player: null,
    weapon: null,
    enemies: null,
    boss: null,
    animFrameId: null,
    lastTime: performance.now(),
  });

  // Handle Return to Website
  const handleReturn = useCallback(() => {
    if (stateRef.current.player) {
      stateRef.current.player.unlock();
    }
    if (onReturnToSite) {
      onReturnToSite();
    }
  }, [onReturnToSite]);

  // Handle click-to-lock from HUD pause overlay
  const handleLockRequest = useCallback(() => {
    if (stateRef.current.player && !stateRef.current.player.isLocked()) {
      stateRef.current.player.lock();
    }
  }, []);

  // ESC Key Listener for victory screen or return
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape' && isVictory) {
        handleReturn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVictory, handleReturn]);

  // Main Three.js Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Setup Scene, Camera, Renderer ───────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050814);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ── Systems ─────────────────────────────────────────────────────────
    const world = new GameWorld(scene);
    const player = new PlayerController(camera, renderer.domElement, world.colliders);
    const weapon = new WeaponSystem(camera, scene);
    const enemies = new EnemyManager(scene);

    stateRef.current = {
      scene,
      camera,
      renderer,
      world,
      player,
      weapon,
      enemies,
      boss: null,
      animFrameId: null,
      lastTime: performance.now(),
    };

    // ── Event Hookups ───────────────────────────────────────────────────
    player.onHealthChange = (hp) => {
      setHealth(hp);
      setIsDamaged(true);
      setTimeout(() => setIsDamaged(false), 200);
    };

    player.onPlayerDeath = () => {
      // Respawn player at starting point with full HP
      setHealth(100);
      player.health = 100;
      player.isDead = false;
      camera.position.set(0, 1.8, 25);
    };

    player.onLockChange = (locked) => {
      setIsLocked(locked);
    };

    weapon.onAmmoChange = (current, max) => {
      setAmmo(current);
    };

    weapon.onHit = (hitObject) => {
      setShowHitMarker(true);
      setTimeout(() => setShowHitMarker(false), 120);

      // Check if enemy hit
      if (hitObject.userData.enemy) {
        enemies.damageEnemy(hitObject, 1);
      }
      // Check if boss hit
      else if (hitObject.userData.boss && stateRef.current.boss) {
        stateRef.current.boss.takeDamage(1);
      }
    };

    enemies.onDamagePlayer = (dmg) => {
      player.takeDamage(dmg);
    };

    enemies.onEnemyKilled = (k, target) => {
      setKills(k);
    };

    enemies.onBossTrigger = () => {
      setIsBossActive(true);
      const boss = new BossBug(scene);
      stateRef.current.boss = boss;

      boss.onHealthChange = (current, max) => {
        setBossHealth(current);
        setBossMaxHealth(max);
      };

      boss.onDamagePlayer = (dmg) => {
        player.takeDamage(dmg);
      };

      boss.onDefeated = () => {
        setIsVictory(true);
        player.unlock();
      };
    };

    // Click canvas to shoot (pointer lock is handled by HUD overlay)
    const handleCanvasClick = () => {
      if (player.isLocked()) {
        const shootTargets = [
          ...enemies.enemyMeshList,
          ...(stateRef.current.boss ? stateRef.current.boss.meshList : []),
        ];
        weapon.shoot(shootTargets);
      }
    };
    container.addEventListener('click', handleCanvasClick);

    // Start Spawning Enemies after 1.5s exploration grace period
    setTimeout(() => {
      enemies.startSpawning();
    }, 1500);

    // Initial Pointer Lock
    player.lock();

    // ── Window Resize ───────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Main Game Loop ──────────────────────────────────────────────────
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Update world
      world.update(delta, time);

      // Update player
      player.update(delta);

      // Update weapon
      weapon.update(delta);

      // Update enemies
      enemies.update(delta, camera.position);

      // Update boss if active
      if (stateRef.current.boss) {
        stateRef.current.boss.update(delta, camera.position);
      }

      renderer.render(scene, camera);
      stateRef.current.animFrameId = requestAnimationFrame(animate);
    };

    stateRef.current.animFrameId = requestAnimationFrame(animate);

    // ── Cleanup on Unmount ──────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleCanvasClick);

      if (stateRef.current.animFrameId) {
        cancelAnimationFrame(stateRef.current.animFrameId);
      }

      player.dispose();
      weapon.dispose();
      enemies.dispose();
      world.dispose();
      if (stateRef.current.boss) stateRef.current.boss.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      <div ref={containerRef} className="w-full h-full cursor-crosshair" />

      <GameHUD
        health={health}
        maxHealth={maxHealth}
        ammo={ammo}
        maxAmmo={maxAmmo}
        kills={kills}
        targetKills={targetKills}
        bossHealth={bossHealth}
        bossMaxHealth={bossMaxHealth}
        isBossActive={isBossActive}
        showHitMarker={showHitMarker}
        isDamaged={isDamaged}
        isLocked={isLocked}
        isVictory={isVictory}
        onReturnToSite={handleReturn}
        onClickToLock={handleLockRequest}
      />
    </div>
  );
}

export default FPSGame;
