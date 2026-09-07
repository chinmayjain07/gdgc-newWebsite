import * as THREE from 'three';
import { soundEffects } from '../audio/soundEffects';

export class WeaponSystem {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;

    this.maxAmmo = 30;
    this.currentAmmo = 30;
    this.isReloading = false;
    this.lastShotTime = 0;
    this.fireRate = 140; // ms between shots

    this.gunGroup = new THREE.Group();
    this.muzzleLight = null;
    this.raycaster = new THREE.Raycaster();
    this.recoilOffset = 0;

    // Callbacks
    this.onAmmoChange = null;
    this.onHit = null;

    this.init();
  }

  init() {
    // ── Build 3D Sci-Fi Digital Blaster ─────────────────────────────────
    const bodyGeo = new THREE.BoxGeometry(0.12, 0.16, 0.45);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3,
    });
    const gunBody = new THREE.Mesh(bodyGeo, bodyMat);

    // Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.25, 12);
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.04, -0.3);

    // Glowing Neon Energy Conduit (#4285F4)
    const conduitGeo = new THREE.BoxGeometry(0.04, 0.03, 0.3);
    const conduitMat = new THREE.MeshBasicMaterial({ color: 0x4285f4 });
    const conduit = new THREE.Mesh(conduitGeo, conduitMat);
    conduit.position.set(0, 0.085, -0.05);

    this.gunGroup.add(gunBody);
    this.gunGroup.add(barrel);
    this.gunGroup.add(conduit);

    // Muzzle flash point light
    this.muzzleLight = new THREE.PointLight(0x4285f4, 0, 10);
    this.muzzleLight.position.set(0, 0.04, -0.45);
    this.gunGroup.add(this.muzzleLight);

    // Position gun in front-right of camera
    this.gunGroup.position.set(0.24, -0.22, -0.45);
    this.camera.add(this.gunGroup);

    // Reload keyboard listener ('R')
    this.onKeyDown = (e) => {
      if (e.code === 'KeyR' && !this.isReloading && this.currentAmmo < this.maxAmmo) {
        this.reload();
      }
    };
    document.addEventListener('keydown', this.onKeyDown);
  }

  shoot(targetObjects = []) {
    const now = performance.now();
    if (now - this.lastShotTime < this.fireRate) return false;
    if (this.isReloading) return false;

    if (this.currentAmmo <= 0) {
      this.reload();
      return false;
    }

    this.lastShotTime = now;
    this.currentAmmo--;
    if (this.onAmmoChange) this.onAmmoChange(this.currentAmmo, this.maxAmmo);

    // Play laser sound
    soundEffects.playLaser();

    // Visual recoil
    this.recoilOffset = 0.08;
    this.muzzleLight.intensity = 3;
    setTimeout(() => {
      if (this.muzzleLight) this.muzzleLight.intensity = 0;
    }, 45);

    // Center screen raycast
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const intersects = this.raycaster.intersectObjects(targetObjects, true);

    let hitPoint = null;
    let hitObject = null;

    if (intersects.length > 0) {
      hitPoint = intersects[0].point;
      hitObject = intersects[0].object;

      // Create spark / impact hit visual
      this.createImpactSparks(hitPoint);

      if (this.onHit) {
        this.onHit(hitObject, intersects[0]);
      }
    } else {
      // Beam into distance
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      hitPoint = this.camera.position.clone().add(dir.multiplyScalar(60));
    }

    // Laser Tracer Beam
    this.createTracer(hitPoint);

    if (this.currentAmmo === 0) {
      this.reload();
    }

    return true;
  }

  reload() {
    if (this.isReloading) return;
    this.isReloading = true;

    // Drop gun slightly during reload
    this.gunGroup.position.y = -0.38;

    setTimeout(() => {
      this.currentAmmo = this.maxAmmo;
      this.isReloading = false;
      this.gunGroup.position.y = -0.22;
      if (this.onAmmoChange) this.onAmmoChange(this.currentAmmo, this.maxAmmo);
    }, 1100);
  }

  createTracer(targetPos) {
    const startPos = new THREE.Vector3();
    this.muzzleLight.getWorldPosition(startPos);

    const geo = new THREE.BufferGeometry().setFromPoints([startPos, targetPos]);
    const mat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.9,
    });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);

    setTimeout(() => {
      this.scene.remove(line);
      geo.dispose();
      mat.dispose();
    }, 50);
  }

  createImpactSparks(pos) {
    const sparkCount = 8;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i++) {
      positions[i * 3] = pos.x + (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = pos.y + (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 2] = pos.z + (Math.random() - 0.5) * 0.4;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.18,
      color: 0x38bdf8,
      transparent: true,
      opacity: 1,
    });
    const sparks = new THREE.Points(geo, mat);
    this.scene.add(sparks);

    setTimeout(() => {
      this.scene.remove(sparks);
      geo.dispose();
      mat.dispose();
    }, 120);
  }

  update(delta) {
    // Smooth recoil recovery
    if (this.recoilOffset > 0) {
      this.recoilOffset -= delta * 0.6;
      if (this.recoilOffset < 0) this.recoilOffset = 0;
    }

    if (!this.isReloading) {
      this.gunGroup.position.z = -0.45 + this.recoilOffset;
      this.gunGroup.rotation.x = this.recoilOffset * 0.5;
    }
  }

  dispose() {
    document.removeEventListener('keydown', this.onKeyDown);
    if (this.camera && this.gunGroup) {
      this.camera.remove(this.gunGroup);
    }
  }
}
