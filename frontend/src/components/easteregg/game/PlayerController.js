import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { soundEffects } from '../audio/soundEffects';

export class PlayerController {
  constructor(camera, domElement, colliders = []) {
    this.camera = camera;
    this.domElement = domElement;
    this.colliders = colliders;

    this.controls = new PointerLockControls(camera, domElement);

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.isSprinting = false;
    this.canJump = false;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.health = 100;
    this.maxHealth = 100;
    this.isDead = false;
    this.lastDamageTime = 0;

    // Callbacks
    this.onHealthChange = null;
    this.onPlayerDeath = null;
    this.onLockChange = null;

    this.init();
  }

  init() {
    this.camera.position.set(0, 1.8, 25);

    this.onKeyDown = this.handleKeyDown.bind(this);
    this.onKeyUp = this.handleKeyUp.bind(this);

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    this.controls.addEventListener('lock', () => {
      if (this.onLockChange) this.onLockChange(true);
    });

    this.controls.addEventListener('unlock', () => {
      if (this.onLockChange) this.onLockChange(false);
    });
  }

  handleKeyDown(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = true;
        break;
      case 'Space':
        if (this.canJump) {
          this.velocity.y = 11;
          this.canJump = false;
        }
        break;
      default:
        break;
    }
  }

  handleKeyUp(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = false;
        break;
      default:
        break;
    }
  }

  lock() {
    this.controls.lock();
  }

  unlock() {
    this.controls.unlock();
  }

  isLocked() {
    return this.controls.isLocked;
  }

  takeDamage(amount) {
    const now = performance.now();
    if (now - this.lastDamageTime < 500 || this.isDead) return; // 500ms invulnerability

    this.lastDamageTime = now;
    this.health = Math.max(0, this.health - amount);
    soundEffects.playPlayerHurt();

    if (this.onHealthChange) {
      this.onHealthChange(this.health, this.maxHealth);
    }

    if (this.health <= 0) {
      this.isDead = true;
      if (this.onPlayerDeath) {
        this.onPlayerDeath();
      }
    }
  }

  update(delta) {
    if (!this.controls.isLocked) return;

    // Movement damping
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    this.velocity.y -= 26.0 * delta; // Gravity

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();

    const speedMultiplier = this.isSprinting ? 95.0 : 60.0;

    if (this.moveForward || this.moveBackward) {
      this.velocity.z -= this.direction.z * speedMultiplier * delta;
    }
    if (this.moveLeft || this.moveRight) {
      this.velocity.x -= this.direction.x * speedMultiplier * delta;
    }

    // Save previous position in case of collision
    const oldPos = this.camera.position.clone();

    // Move forward/back and strafe
    this.controls.moveRight(-this.velocity.x * delta);
    this.controls.moveForward(-this.velocity.z * delta);

    // Vertical movement
    this.camera.position.y += this.velocity.y * delta;

    // Ground collision
    if (this.camera.position.y < 1.8) {
      this.velocity.y = 0;
      this.camera.position.y = 1.8;
      this.canJump = true;
    }

    // Wall & Obstacle Collision Detection
    const playerRadius = 0.8;
    const playerPos = this.camera.position;
    const playerBox = new THREE.Box3(
      new THREE.Vector3(playerPos.x - playerRadius, 0, playerPos.z - playerRadius),
      new THREE.Vector3(playerPos.x + playerRadius, 3, playerPos.z + playerRadius)
    );

    for (let i = 0; i < this.colliders.length; i++) {
      if (playerBox.intersectsBox(this.colliders[i])) {
        // Revert X/Z position to prevent walking through walls
        this.camera.position.x = oldPos.x;
        this.camera.position.z = oldPos.z;
        this.velocity.x = 0;
        this.velocity.z = 0;
        break;
      }
    }
  }

  dispose() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    this.controls.dispose();
  }
}
