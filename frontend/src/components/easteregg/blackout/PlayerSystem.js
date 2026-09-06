import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

/**
 * BLACKOUT player system.
 * Desktop: PointerLockControls + WASD/Shift/Space/F/E.
 * Mobile: virtual joystick vector + touch-drag look + buttons.
 * Flashlight: camera-attached spotlight with sway + battery.
 * Interact: center-screen raycast against interactable meshes.
 */
export class PlayerSystem {
  constructor(camera, domElement, facility, { isTouch = false } = {}) {
    this.camera = camera;
    this.domElement = domElement;
    this.facility = facility;
    this.isTouch = isTouch;

    this.velocity = new THREE.Vector3();
    this.keys = { forward: false, backward: false, left: false, right: false, sprint: false };
    this.joystick = { x: 0, y: 0 };
    this.lookDelta = { x: 0, y: 0 };
    this.bobPhase = 0;
    this.stepAccum = 0;
    this.canJump = true;

    this.flashlightOn = true;
    this.battery = 100;

    this.interactHeld = false;

    this.onFootstep = null;
    this.onLockChange = null;

    camera.position.set(0, 1.7, 22);
    camera.rotation.set(0, 0, 0);

    if (!isTouch) {
      this.controls = new PointerLockControls(camera, domElement);
      this.controls.addEventListener('lock', () => this.onLockChange && this.onLockChange(true));
      this.controls.addEventListener('unlock', () => this.onLockChange && this.onLockChange(false));
    }

    this._flashlight = new THREE.SpotLight(0xfff1d6, 95, 22, 0.5, 0.55, 1.7);
    this._flashlight.castShadow = false;
    this._flashlight.position.set(0.12, -0.1, 0);
    this._flashTarget = new THREE.Object3D();
    this._flashTarget.position.set(0, 0, -1);
    camera.add(this._flashlight);
    camera.add(this._flashTarget);
    this._flashlight.target = this._flashTarget;

    this._raycaster = new THREE.Raycaster();
    this._raycaster.far = 3.0;

    this._onKeyDown = (e) => {
      if (e.repeat) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.forward = true; break;
        case 'KeyS': case 'ArrowDown': this.keys.backward = true; break;
        case 'KeyA': case 'ArrowLeft': this.keys.left = true; break;
        case 'KeyD': case 'ArrowRight': this.keys.right = true; break;
        case 'ShiftLeft': case 'ShiftRight': this.keys.sprint = true; break;
        case 'Space':
          if (this.canJump) {
            this.velocity.y = 5.2;
            this.canJump = false;
          }
          break;
        case 'KeyF': this.toggleFlashlight(); break;
        default: break;
      }
    };

    this._onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.forward = false; break;
        case 'KeyS': case 'ArrowDown': this.keys.backward = false; break;
        case 'KeyA': case 'ArrowLeft': this.keys.left = false; break;
        case 'KeyD': case 'ArrowRight': this.keys.right = false; break;
        case 'ShiftLeft': case 'ShiftRight': this.keys.sprint = false; break;
        default: break;
      }
    };

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
  }

  lock() {
    if (this.controls) this.controls.lock();
  }

  unlock() {
    if (this.controls) this.controls.unlock();
  }

  isLocked() {
    return this.controls ? this.controls.isLocked : true;
  }

  toggleFlashlight() {
    if (this.battery <= 0 && !this.flashlightOn) return;
    this.flashlightOn = !this.flashlightOn;
    return this.flashlightOn;
  }

  setJoystick(x, y) {
    this.joystick.x = x;
    this.joystick.y = y;
  }

  addLook(dx, dy) {
    this.lookDelta.x += dx;
    this.lookDelta.y += dy;
  }

  setInteractHeld(held) {
    this.interactHeld = held;
  }

  getInteractTarget(interactables, interactMeshes) {
    this._raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const hits = this._raycaster.intersectObjects(interactMeshes, false);
    if (hits.length === 0) return null;
    const hit = hits[0];
    const entry = interactables.find((it) => it.mesh === hit.object);
    if (!entry) return null;
    const dist = hit.distance;
    return { entry, distance: dist, point: hit.point };
  }

  update(delta, colliders, frozen = false) {
    if (this.controls && !this.controls.isLocked) {
      return;
    }

    // Touch look
    if (this.isTouch && (this.lookDelta.x || this.lookDelta.y)) {
      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.setFromQuaternion(this.camera.quaternion);
      euler.y -= this.lookDelta.x * 0.0032;
      euler.x -= this.lookDelta.y * 0.0032;
      euler.x = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, euler.x));
      this.camera.quaternion.setFromEuler(euler);
      this.lookDelta.x = 0;
      this.lookDelta.y = 0;
    }

    // Battery drain
    if (this.flashlightOn) {
      this.battery = Math.max(0, this.battery - delta * (100 / 300));
      if (this.battery <= 0) this.flashlightOn = false;
    }
    this._flashlight.intensity = this.flashlightOn ? 95 : 0;

    if (frozen) {
      this.velocity.set(0, 0, 0);
      return;
    }

    // Movement input
    let ix = 0;
    let iz = 0;
    if (this.keys.forward) iz -= 1;
    if (this.keys.backward) iz += 1;
    if (this.keys.left) ix -= 1;
    if (this.keys.right) ix += 1;
    ix += this.joystick.x;
    iz += this.joystick.y;
    const mag = Math.hypot(ix, iz);
    if (mag > 1) {
      ix /= mag;
      iz /= mag;
    }

    const speed = this.keys.sprint ? 6.4 : 3.4;
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const move = new THREE.Vector3()
      .addScaledVector(forward, -iz)
      .addScaledVector(right, ix)
      .multiplyScalar(speed * delta);

    if (mag > 0.05) {
      this.bobPhase += delta * (this.keys.sprint ? 11 : 7);
      this.stepAccum += move.length();
      if (this.stepAccum > 1.9) {
        this.stepAccum = 0;
        if (this.onFootstep) this.onFootstep();
      }
    }

    // Gravity + jump
    this.velocity.y -= 14 * delta;
    const pos = this.camera.position;
    pos.y += this.velocity.y * delta;
    if (pos.y <= 1.7) {
      pos.y = 1.7;
      this.velocity.y = 0;
      this.canJump = true;
    }

    // Collision (axis-separated revert)
    const oldX = pos.x;
    const oldZ = pos.z;
    pos.x += move.x;
    if (this._collides(pos, colliders)) pos.x = oldX;
    pos.z += move.z;
    if (this._collides(pos, colliders)) pos.z = oldZ;

    // Head bob (on top of gravity/jump height)
    const bob = mag > 0.05 ? Math.sin(this.bobPhase) * 0.035 : 0;
    this.camera.position.y = pos.y + bob;

    // Flashlight sway
    this._flashlight.position.x = 0.12 + Math.sin(this.bobPhase * 0.5) * 0.02;
    this._flashlight.position.y = -0.1 + Math.cos(this.bobPhase * 0.5) * 0.015;
  }

  _collides(pos, colliders) {
    const r = 0.42;
    const box = new THREE.Box3(
      new THREE.Vector3(pos.x - r, 0.3, pos.z - r),
      new THREE.Vector3(pos.x + r, 2.0, pos.z + r)
    );
    for (let i = 0; i < colliders.length; i++) {
      if (box.intersectsBox(colliders[i])) return true;
    }
    return false;
  }

  dispose() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    if (this.controls) this.controls.dispose();
    this.camera.remove(this._flashlight);
    this.camera.remove(this._flashTarget);
  }
}

export default PlayerSystem;
