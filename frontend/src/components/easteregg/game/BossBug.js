import * as THREE from 'three';
import { soundEffects } from '../audio/soundEffects';

export class BossBug {
  constructor(scene) {
    this.scene = scene;
    this.bossGroup = new THREE.Group();

    this.maxHealth = 30;
    this.health = 30;
    this.isDead = false;
    this.isEnraged = false; // Phase 2 at < 50% HP

    this.meshList = []; // For raycasting
    this.projectiles = [];
    this.tendrils = [];
    this.particles = [];

    this.lastAttackTime = 0;
    this.attackCooldown = 1800;
    this.hitFlashTimer = 0;

    this.onHealthChange = null;
    this.onDefeated = null;
    this.onDamagePlayer = null;

    this.init();
  }

  init() {
    soundEffects.playBossIntro();

    this.bossGroup.position.set(0, 5.5, -20);

    // ── Central Geometric Bug Core ──────────────────────────────────────
    const coreGeo = new THREE.DodecahedronGeometry(2.4, 1);
    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0xd946ef,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0xa21caf,
    });
    this.core = new THREE.Mesh(coreGeo, this.coreMat);
    this.bossGroup.add(this.core);

    // ── Glowing Wireframe Cage ──────────────────────────────────────────
    const cageGeo = new THREE.IcosahedronGeometry(3.2, 1);
    this.cageMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    this.cage = new THREE.Mesh(cageGeo, this.cageMat);
    this.bossGroup.add(this.cage);

    // ── Floating Code Tendrils & Geometric Legs ─────────────────────────
    for (let i = 0; i < 6; i++) {
      const legGeo = new THREE.CylinderGeometry(0.12, 0.25, 3.5, 6);
      const legMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        metalness: 0.8,
        roughness: 0.3,
      });
      const leg = new THREE.Mesh(legGeo, legMat);

      const angle = (i / 6) * Math.PI * 2;
      leg.position.set(Math.cos(angle) * 3, -1.2, Math.sin(angle) * 3);
      leg.rotation.z = Math.cos(angle) * 0.7;
      leg.rotation.x = Math.sin(angle) * 0.7;

      this.bossGroup.add(leg);
      this.tendrils.push({ mesh: leg, baseAngle: angle });
    }

    // ── Orbiting Bug Glyphs ─────────────────────────────────────────────
    const glyphGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const glyphMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.orbitingGlyphs = [];
    for (let i = 0; i < 4; i++) {
      const glyph = new THREE.Mesh(glyphGeo, glyphMat);
      this.bossGroup.add(glyph);
      this.orbitingGlyphs.push(glyph);
    }

    this.scene.add(this.bossGroup);

    // Register user data for hit detection
    this.core.userData.boss = this;
    this.cage.userData.boss = this;
    this.meshList.push(this.core, this.cage);

    if (this.onHealthChange) {
      this.onHealthChange(this.health, this.maxHealth);
    }
  }

  takeDamage(amount = 1) {
    if (this.isDead) return;

    this.health = Math.max(0, this.health - amount);
    this.hitFlashTimer = 0.18;
    this.coreMat.emissive.setHex(0xffffff);
    soundEffects.playHit();

    // Check Phase 2 transition
    if (this.health <= this.maxHealth * 0.5 && !this.isEnraged) {
      this.isEnraged = true;
      this.cageMat.color.setHex(0xf43f5e);
      this.attackCooldown = 1100; // Attack faster in Phase 2
      soundEffects.playBossIntro();
    }

    if (this.onHealthChange) {
      this.onHealthChange(this.health, this.maxHealth);
    }

    if (this.health <= 0) {
      this.defeat();
    }
  }

  defeat() {
    this.isDead = true;
    soundEffects.playEnemyDeath();

    // Dramatic particle vortex
    const pCount = 50;
    const geo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const colors = [0xd946ef, 0xef4444, 0x38bdf8, 0xfacc15];

    for (let i = 0; i < pCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(this.bossGroup.position);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16
      );

      this.scene.add(mesh);
      this.particles.push({ mesh, vel, life: 2.2 });
    }

    this.scene.remove(this.bossGroup);

    setTimeout(() => {
      soundEffects.playVictory();
      if (this.onDefeated) {
        this.onDefeated();
      }
    }, 1200);
  }

  update(delta, playerPos) {
    const now = performance.now();

    if (!this.isDead) {
      // Rotate boss elements
      this.core.rotation.y += delta * 1.5;
      this.core.rotation.x += delta * 0.8;
      this.cage.rotation.y -= delta * 1.2;
      this.cage.rotation.z += delta * 0.6;

      // Orbiting glyphs
      this.orbitingGlyphs.forEach((g, idx) => {
        const t = now * 0.003 + (idx * Math.PI * 2) / 4;
        g.position.set(Math.cos(t) * 4.2, Math.sin(t * 1.5) * 1.2, Math.sin(t) * 4.2);
        g.rotation.x += delta * 2;
        g.rotation.y += delta * 2;
      });

      // Hit flash reset
      if (this.hitFlashTimer > 0) {
        this.hitFlashTimer -= delta;
        if (this.hitFlashTimer <= 0) {
          this.coreMat.emissive.setHex(this.isEnraged ? 0xbe123c : 0xa21caf);
        }
      }

      // Movement around arena
      const orbitSpeed = this.isEnraged ? 0.0008 : 0.0005;
      const orbitRadius = 22;
      this.bossGroup.position.x = Math.sin(now * orbitSpeed) * orbitRadius;
      this.bossGroup.position.z = Math.cos(now * orbitSpeed) * orbitRadius;
      this.bossGroup.position.y = 5.0 + Math.sin(now * 0.002) * 1.5;

      // Face player
      this.bossGroup.lookAt(playerPos.x, this.bossGroup.position.y, playerPos.z);

      // Attack player
      if (now - this.lastAttackTime > this.attackCooldown) {
        this.lastAttackTime = now;
        this.attack(playerPos);
      }
    }

    // ── Update Boss Projectiles ─────────────────────────────────────────
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.mesh.position.addScaledVector(proj.vel, delta);
      proj.life -= delta;

      const dist = proj.mesh.position.distanceTo(playerPos);
      if (dist < 1.4) {
        if (this.onDamagePlayer) this.onDamagePlayer(20);
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
        continue;
      }

      if (proj.life <= 0) {
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // ── Update Death Particles ──────────────────────────────────────────
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.mesh.position.addScaledVector(p.vel, delta);
      p.life -= delta;
      p.mesh.scale.multiplyScalar(0.97);

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }
  }

  attack(playerPos) {
    const origin = this.bossGroup.position.clone().add(new THREE.Vector3(0, -0.5, 0));

    if (this.isEnraged) {
      // 3-way spread attack in Phase 2
      const spreadAngles = [-0.25, 0, 0.25];
      spreadAngles.forEach((angleOffset) => {
        const dir = new THREE.Vector3().subVectors(playerPos, origin).normalize();
        dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleOffset);
        this.spawnOrb(origin, dir, 20);
      });
    } else {
      // Single targeted glitch orb
      const dir = new THREE.Vector3().subVectors(playerPos, origin).normalize();
      this.spawnOrb(origin, dir, 17);
    }
  }

  spawnOrb(origin, dir, speed) {
    const geo = new THREE.SphereGeometry(0.4, 10, 10);
    const mat = new THREE.MeshBasicMaterial({ color: 0xd946ef });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(origin);
    this.scene.add(mesh);

    this.projectiles.push({
      mesh,
      vel: dir.multiplyScalar(speed),
      life: 4.5,
    });
  }

  dispose() {
    this.scene.remove(this.bossGroup);
    this.projectiles.forEach((p) => this.scene.remove(p.mesh));
    this.particles.forEach((p) => this.scene.remove(p.mesh));
    this.projectiles = [];
    this.particles = [];
  }
}
