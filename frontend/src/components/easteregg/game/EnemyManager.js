import * as THREE from 'three';
import { soundEffects } from '../audio/soundEffects';

export class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.enemies = [];
    this.enemyMeshList = []; // For raycast intersection testing
    this.projectiles = [];
    this.particles = [];

    this.kills = 0;
    this.targetKills = 7; // Kills needed to awaken THE BUG boss

    this.onEnemyKilled = null;
    this.onBossTrigger = null;
    this.onDamagePlayer = null;

    this.spawnTimer = 0;
    this.isBossActive = false;
  }

  startSpawning() {
    // Initial spawn of 3 enemies
    for (let i = 0; i < 3; i++) {
      this.spawnEnemy();
    }
  }

  spawnEnemy() {
    if (this.isBossActive) return;

    // Spawn at random position around arena edge (distance 25-40 from center)
    const angle = Math.random() * Math.PI * 2;
    const dist = 22 + Math.random() * 18;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    // ── Build Glitch Drone Model ────────────────────────────────────────
    const group = new THREE.Group();
    group.position.set(x, 2, z);

    // Inner glowing core
    const coreGeo = new THREE.OctahedronGeometry(0.7, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x991b1b,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Outer wireframe shell
    const wireGeo = new THREE.IcosahedronGeometry(1.0, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    // Orbiting mini digital bits
    const bitGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const bitMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const bits = [];
    for (let i = 0; i < 3; i++) {
      const bit = new THREE.Mesh(bitGeo, bitMat);
      group.add(bit);
      bits.push(bit);
    }

    this.scene.add(group);

    const enemy = {
      group,
      core,
      wire,
      bits,
      health: 3,
      maxHealth: 3,
      speed: 4.2 + Math.random() * 1.5,
      lastAttackTime: 0,
      attackCooldown: 2200 + Math.random() * 800,
      hitFlashTimer: 0,
    };

    // Associate reference on meshes for raycasting
    core.userData.enemy = enemy;
    wire.userData.enemy = enemy;

    this.enemies.push(enemy);
    this.enemyMeshList.push(core, wire);
  }

  damageEnemy(mesh, damage = 1) {
    const enemy = mesh.userData.enemy;
    if (!enemy || enemy.health <= 0) return;

    enemy.health -= damage;
    enemy.hitFlashTimer = 0.15; // flash white
    enemy.core.material.emissive.setHex(0xffffff);

    soundEffects.playHit();

    if (enemy.health <= 0) {
      this.destroyEnemy(enemy);
    }
  }

  destroyEnemy(enemy) {
    soundEffects.playEnemyDeath();
    this.createDeathExplosion(enemy.group.position);

    // Remove from scene and lists
    this.scene.remove(enemy.group);

    const enemyIdx = this.enemies.indexOf(enemy);
    if (enemyIdx !== -1) this.enemies.splice(enemyIdx, 1);

    this.enemyMeshList = this.enemyMeshList.filter(
      (m) => m !== enemy.core && m !== enemy.wire
    );

    this.kills++;
    if (this.onEnemyKilled) {
      this.onEnemyKilled(this.kills, this.targetKills);
    }

    // Check if target reached for Boss
    if (this.kills >= this.targetKills && !this.isBossActive) {
      this.isBossActive = true;
      if (this.onBossTrigger) {
        this.onBossTrigger();
      }
    } else if (!this.isBossActive && this.enemies.length < 4) {
      // Respawn enemy after 1.5s
      setTimeout(() => this.spawnEnemy(), 1500);
    }
  }

  createDeathExplosion(pos) {
    const cubeCount = 16;
    const geo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const colors = [0xef4444, 0x06b6d4, 0xfacc15];

    for (let i = 0; i < cubeCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 8
      );

      this.scene.add(mesh);
      this.particles.push({ mesh, vel, life: 0.8 });
    }
  }

  update(delta, playerPos) {
    const now = performance.now();

    // ── Update Enemies AI ───────────────────────────────────────────────
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // Rotate body & orbiting bits
      enemy.core.rotation.x += delta * 1.5;
      enemy.core.rotation.y += delta * 2.0;
      enemy.wire.rotation.y -= delta * 1.2;

      enemy.bits.forEach((bit, idx) => {
        const time = now * 0.003 + (idx * Math.PI * 2) / 3;
        bit.position.set(Math.cos(time) * 1.4, Math.sin(time * 2) * 0.4, Math.sin(time) * 1.4);
      });

      // Hit flash restore
      if (enemy.hitFlashTimer > 0) {
        enemy.hitFlashTimer -= delta;
        if (enemy.hitFlashTimer <= 0) {
          enemy.core.material.emissive.setHex(0x991b1b);
        }
      }

      // Move toward player
      const dir = new THREE.Vector3().subVectors(playerPos, enemy.group.position);
      const dist = dir.length();
      dir.normalize();

      // Maintain hover height
      enemy.group.position.y = 2.0 + Math.sin(now * 0.004 + i) * 0.3;

      // Only move closer if outside attack range
      if (dist > 6) {
        enemy.group.position.x += dir.x * enemy.speed * delta;
        enemy.group.position.z += dir.z * enemy.speed * delta;
      }

      // Attack player (shoot projectile or damage on close proximity)
      if (dist < 4.5) {
        // Proximity contact damage
        if (this.onDamagePlayer) this.onDamagePlayer(12);
      } else if (dist < 28 && now - enemy.lastAttackTime > enemy.attackCooldown) {
        enemy.lastAttackTime = now;
        this.fireProjectile(enemy.group.position.clone(), playerPos);
      }
    }

    // ── Update Projectiles ──────────────────────────────────────────────
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.mesh.position.addScaledVector(proj.vel, delta);
      proj.life -= delta;

      // Check collision with player
      const pDist = proj.mesh.position.distanceTo(playerPos);
      if (pDist < 1.2) {
        if (this.onDamagePlayer) this.onDamagePlayer(15);
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
      p.vel.y -= 14 * delta; // particle gravity
      p.life -= delta;
      p.mesh.scale.multiplyScalar(0.96);

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }
  }

  fireProjectile(fromPos, targetPos) {
    const geo = new THREE.SphereGeometry(0.2, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(fromPos);
    this.scene.add(mesh);

    const dir = new THREE.Vector3().subVectors(targetPos, fromPos).normalize();
    const vel = dir.multiplyScalar(16); // Projectile speed

    this.projectiles.push({ mesh, vel, life: 3.5 });
  }

  dispose() {
    this.enemies.forEach((e) => this.scene.remove(e.group));
    this.projectiles.forEach((p) => this.scene.remove(p.mesh));
    this.particles.forEach((p) => this.scene.remove(p.mesh));
    this.enemies = [];
    this.enemyMeshList = [];
    this.projectiles = [];
    this.particles = [];
  }
}
