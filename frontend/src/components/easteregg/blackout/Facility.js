import * as THREE from 'three';
import {
  getConcreteTexture,
  getMetalTexture,
  getFloorTexture,
  getScreenTexture,
} from './Textures.js';

/**
 * BLACKOUT facility — fictional "SUBTERRA-7" research annex.
 * Fully procedural geometry/materials, zero external assets.
 *
 * Top view (x → east, z → south):
 *
 *   finalChamber   serverRoom   controlRoom     z:-26..-16
 *   x:-13..-3      x:-3..9      x:9..19
 *       └──────┬────────┴────────┐
 *   storage                datacenter        z:-12..-2 / -14..-4
 *   x:-17..-3              x:3..15
 *       └──────┬────────────────┐
 *   lab                   maintenance       z:2..12 / -4..10
 *   x:-17..-3             x:3..9
 *       └──────┬────────────────┘
 *        corridor  x:-3..3, z:-16..15
 *              │
 *        checkpoint x:-5..5, z:15..25   (entry)
 */

const DOOR_W = 1.8;
const DOOR_H = 2.6;
const WALL_H = 3.2;
const WALL_T = 0.4;

function hash(n) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

export class Facility {
  constructor(scene, { quality = 'high' } = {}) {
    this.scene = scene;
    this.quality = quality;
    this.colliders = [];
    this.interactables = [];
    this.doors = {};
    this.flickerLights = [];
    this.blinkMats = [];
    this.ledMats = [];
    this.dust = null;
    this.sparks = [];
    this.junctionSparks = null;
    this.meshes = [];
    this.geometries = [];
    this.textures = [];
    this.materials = [];
    this.signCanvasTextures = [];

    this._build();
  }

  // ── material helpers ────────────────────────────────────────────────

  _trackMaterial(mat) {
    this.materials.push(mat);
    return mat;
  }

  _trackTexture(tex) {
    this.textures.push(tex);
    return tex;
  }

  _makeSignTexture(title, sub, color = '#f87171', bg = '#0a0c10') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, 244, 116);
    ctx.fillStyle = color;
    ctx.font = 'bold 30px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(title, 128, 58);
    if (sub) {
      ctx.font = '17px monospace';
      ctx.fillStyle = '#c9d1d9';
      ctx.fillText(sub, 128, 92);
    }
    const tex = new THREE.CanvasTexture(canvas);
    this.signCanvasTextures.push(tex);
    return tex;
  }

  _signPlane(title, sub, x, y, z, ry, color) {
    const tex = this._makeSignTexture(title, sub, color);
    this._trackTexture(tex);
    const mat = this._trackMaterial(
      new THREE.MeshBasicMaterial({ map: tex, transparent: false })
    );
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = ry;
    this.scene.add(mesh);
    this.meshes.push(mesh);
    this.geometries.push(mesh.geometry);
    return mesh;
  }

  // ── primitive builders ──────────────────────────────────────────────

  _box(w, h, d, mat, x, y, z, { collide = true, castShadow = false, receiveShadow = false } = {}) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    this.scene.add(mesh);
    this.meshes.push(mesh);
    this.geometries.push(geo);
    if (collide) {
      this.colliders.push(new THREE.Box3().setFromObject(mesh));
    }
    return mesh;
  }

  _wallSeg(x1, z1, x2, z2, mat, height = WALL_H) {
    const horizontal = Math.abs(x2 - x1) > Math.abs(z2 - z1);
    const len = horizontal ? Math.abs(x2 - x1) : Math.abs(z2 - z1);
    if (len < 0.05) return;
    const cx = (x1 + x2) / 2;
    const cz = (z1 + z2) / 2;
    return this._box(
      horizontal ? len : WALL_T,
      height,
      horizontal ? WALL_T : len,
      mat,
      cx,
      height / 2,
      cz
    );
  }

  _lintel(x, z, horizontal, gap = DOOR_W) {
    const geo = new THREE.BoxGeometry(
      horizontal ? gap : WALL_T,
      WALL_H - DOOR_H,
      horizontal ? WALL_T : gap
    );
    const mesh = new THREE.Mesh(geo, this.matConcreteWall);
    mesh.position.set(x, DOOR_H + (WALL_H - DOOR_H) / 2, z);
    this.scene.add(mesh);
    this.meshes.push(mesh);
    this.geometries.push(geo);
  }

  _pointLight(color, intensity, distance, x, y, z, flicker = false) {
    const light = new THREE.PointLight(color, intensity, distance, 1.9);
    light.position.set(x, y, z);
    this.scene.add(light);
    this.meshes.push(light);

    const bulbGeo = new THREE.BoxGeometry(0.44, 0.05, 0.14);
    const bulb = new THREE.Mesh(
      bulbGeo,
      this._trackMaterial(new THREE.MeshBasicMaterial({ color }))
    );
    bulb.position.set(x, y + 0.08, z);
    this.scene.add(bulb);
    this.meshes.push(bulb);
    this.geometries.push(bulbGeo);

    if (flicker) {
      this.flickerLights.push({ light, bulb, base: intensity, seed: hash(x * 7 + z) * 100 });
    }
    return light;
  }

  _screen(x, y, z, ry, screenMat, w = 0.66, h = 0.44, interact = null) {
    const frameGeo = new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.05);
    const frame = new THREE.Mesh(frameGeo, this.matMetalDark);
    frame.position.set(x, y, z);
    frame.rotation.y = ry;
    this.scene.add(frame);
    this.meshes.push(frame);
    this.geometries.push(frameGeo);

    const faceGeo = new THREE.PlaneGeometry(w, h);
    const face = new THREE.Mesh(faceGeo, screenMat);
    face.position.set(x, y, z);
    face.rotation.y = ry;
    face.translateZ(0.033);
    this.scene.add(face);
    this.meshes.push(face);
    this.geometries.push(faceGeo);

    if (interact) {
      this._register(interact.kind, interact.id, face, face.position, interact.data, interact.prompt);
    }
    return face;
  }

  _register(kind, id, mesh, position, data = null, prompt = null) {
    this.interactables.push({ kind, id, mesh, position, data, prompt });
  }

  // ── doors ───────────────────────────────────────────────────────────

  _door(id, cx, cz, horizontal, { locked = false, reason = '', auto = false } = {}) {
    const panelW = horizontal ? DOOR_W : 0.26;
    const panelD = horizontal ? 0.26 : DOOR_W;
    const geo = new THREE.BoxGeometry(panelW, DOOR_H, panelD);
    const mesh = new THREE.Mesh(geo, this.matDoor);
    mesh.position.set(cx, DOOR_H / 2, cz);
    this.scene.add(mesh);
    this.meshes.push(mesh);
    this.geometries.push(geo);

    const stripGeo = new THREE.BoxGeometry(horizontal ? DOOR_W : 0.3, 0.06, horizontal ? 0.3 : DOOR_W);
    const strip = new THREE.Mesh(
      stripGeo,
      this._trackMaterial(
        new THREE.MeshBasicMaterial({ color: locked ? 0xff3b30 : 0x34d399 })
      )
    );
    strip.position.set(cx, DOOR_H + 0.12, cz);
    this.scene.add(strip);
    this.meshes.push(strip);
    this.geometries.push(stripGeo);

    const collider = new THREE.Box3().setFromObject(mesh);
    this.colliders.push(collider);

    this.doors[id] = {
      id,
      mesh,
      strip,
      horizontal,
      locked,
      reason,
      auto,
      open: false,
      openT: 0,
      collider,
      homeX: cx,
      homeZ: cz,
    };
    return this.doors[id];
  }

  unlockDoor(id) {
    const door = this.doors[id];
    if (!door) return;
    door.locked = false;
    door.strip.material.color.setHex(0x34d399);
    // Non-auto (sealed) doors open once unlocked
    if (!door.auto) door.open = true;
  }

  setDoorReason(id, reason) {
    const door = this.doors[id];
    if (door) door.reason = reason;
  }

  openDoor(id) {
    const door = this.doors[id];
    if (door && !door.locked) door.open = true;
  }

  _updateDoors(delta, playerPos) {
    for (const id in this.doors) {
      const door = this.doors[id];
      let target = door.open ? 1 : 0;

      if (door.auto && !door.locked) {
        const dist = Math.hypot(playerPos.x - door.homeX, playerPos.z - door.homeZ);
        target = dist < 3.0 ? 1 : 0;
      }

      if (door.openT !== target) {
        door.openT += Math.sign(target - door.openT) * Math.min(delta * 1.6, Math.abs(target - door.openT));
      }

      const slide = door.openT * (DOOR_W - 0.05);
      if (door.horizontal) {
        door.mesh.position.x = door.homeX + slide;
      } else {
        door.mesh.position.z = door.homeZ + slide;
      }
      door.strip.position.copy(door.mesh.position);
      door.strip.position.y = DOOR_H + 0.12;

      if (door.openT > 0.92) {
        door.collider.makeEmpty();
      } else {
        door.collider.setFromObject(door.mesh);
      }
    }
  }

  // ── build pipeline ──────────────────────────────────────────────────

  _build() {
    const concrete = getConcreteTexture(3, 1.5);
    const metal = getMetalTexture(2, 2);
    const floorTex = getFloorTexture(5, 5);

    this.matConcreteWall = this._trackMaterial(
      new THREE.MeshStandardMaterial({
        map: this._trackTexture(concrete.map),
        normalMap: this._trackTexture(concrete.normalMap),
        roughness: 0.94,
        metalness: 0.02,
      })
    );
    this.matFloor = this._trackMaterial(
      new THREE.MeshStandardMaterial({
        map: this._trackTexture(floorTex.map),
        normalMap: this._trackTexture(floorTex.normalMap),
        roughness: 0.72,
        metalness: 0.14,
      })
    );
    this.matCeiling = this._trackMaterial(
      new THREE.MeshStandardMaterial({
        map: this._trackTexture(concrete.map),
        color: 0x6f6f6b,
        roughness: 0.98,
      })
    );
    this.matMetal = this._trackMaterial(
      new THREE.MeshStandardMaterial({
        map: this._trackTexture(metal.map),
        normalMap: this._trackTexture(metal.normalMap),
        roughness: 0.42,
        metalness: 0.85,
      })
    );
    this.matMetalDark = this._trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0x2b3036, roughness: 0.55, metalness: 0.75 })
    );
    this.matRust = this._trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0x5e4433, roughness: 0.9, metalness: 0.35 })
    );
    this.matDoor = this._trackMaterial(
      new THREE.MeshStandardMaterial({
        map: this._trackTexture(metal.map),
        color: 0x9aa2ac,
        roughness: 0.38,
        metalness: 0.9,
      })
    );
    this.matPaper = this._trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0xd8d2c0, roughness: 0.95 })
    );
    this.matCable = this._trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0x14171c, roughness: 0.8 })
    );
    this.matPlastic = this._trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0x33383d, roughness: 0.6 })
    );
    this.matGlass = this._trackMaterial(
      new THREE.MeshPhysicalMaterial({
        color: 0xbfd4dd,
        roughness: 0.12,
        metalness: 0.0,
        transparent: true,
        opacity: 0.22,
      })
    );
    this.points = {};

    this.scene.fog = new THREE.FogExp2(0x04060a, 0.052);
    this.scene.add(new THREE.AmbientLight(0x27303e, 0.5));
    this.scene.add(new THREE.HemisphereLight(0x33404f, 0x0d1015, 0.42));

    // Emissive screen materials (predefined in-game content only)
    const alertTex = this._trackTexture(getScreenTexture('alert'));
    const gridTex = this._trackTexture(getScreenTexture('grid'));
    const logTex = this._trackTexture(getScreenTexture('log'));
    const finalTex = this._trackTexture(getScreenTexture('final'));
    this.matScreenAlert = this._trackMaterial(
      new THREE.MeshStandardMaterial({ map: alertTex, emissive: 0xff9a8a, emissiveMap: alertTex, emissiveIntensity: 0.85, roughness: 0.3 })
    );
    this.matScreenGrid = this._trackMaterial(
      new THREE.MeshStandardMaterial({ map: gridTex, emissive: 0x8fe8b8, emissiveMap: gridTex, emissiveIntensity: 0.7, roughness: 0.3 })
    );
    this.matScreenLog = this._trackMaterial(
      new THREE.MeshStandardMaterial({ map: logTex, emissive: 0x9db8ff, emissiveMap: logTex, emissiveIntensity: 0.7, roughness: 0.3 })
    );
    this.matScreenFinal = this._trackMaterial(
      new THREE.MeshStandardMaterial({ map: finalTex, emissive: 0xffd9a0, emissiveMap: finalTex, emissiveIntensity: 0.9, roughness: 0.3 })
    );

    this._buildShell();
    this._buildCheckpoint();
    this._buildCorridor();
    this._buildLab();
    this._buildStorage();
    this._buildMaintenance();
    this._buildDatacenter();
    this._buildServerRoom();
    this._buildControlRoom();
    this._buildFinalChamber();
    this._buildDoors();
    this._buildDust();
  }

  _roomShell(x1, z1, x2, z2) {
    const w = x2 - x1;
    const d = z2 - z1;
    const cx = (x1 + x2) / 2;
    const cz = (z1 + z2) / 2;
    this._box(w, 0.1, d, this.matFloor, cx, 0.05, cz, { collide: false });
    this._box(w, 0.1, d, this.matCeiling, cx, WALL_H + 0.05, cz, { collide: false });
  }

  _buildShell() {
    this.roomRects = {
      checkpoint: [-5, 15, 5, 25],
      corridor: [-3, -16, 3, 15],
      lab: [-17, 2, -3, 12],
      storage: [-17, -12, -3, -2],
      maintenance: [3, -4, 9, 10],
      datacenter: [3, -14, 15, -4],
      serverroom: [-3, -26, 9, -16],
      controlroom: [9, -26, 19, -16],
      finalchamber: [-13, -26, -3, -16],
    };

    for (const key in this.roomRects) {
      const [x1, z1, x2, z2] = this.roomRects[key];
      this._roomShell(x1, z1, x2, z2);
    }

    const W = this.matConcreteWall;

    const segs = [
      [-5, 15, -0.9, 15],
      [0.9, 15, 5, 15],
      [-5, 15, -5, 25],
      [5, 15, 5, 25],
      [-5, 25, 5, 25],
      [-3, -16, -3, -7.9],
      [-3, -6.1, -3, 6.1],
      [-3, 7.9, -3, 15],
      [3, -16, 3, 3.1],
      [3, 4.9, 3, 15],
      [-17, 2, -3, 2],
      [-17, 12, -3, 12],
      [-17, 2, -17, 12],
      [-17, -2, -3, -2],
      [-17, -12, -3, -12],
      [-17, -12, -17, -2],
      [9, -4, 9, 10],
      [3, 10, 9, 10],
      [3, -4, 5.1, -4],
      [6.9, -4, 15, -4],
      [15, -14, 15, -4],
      [3, -14, 15, -14],
      [-13, -16, -0.9, -16],
      [0.9, -16, 19, -16],
      [9, -26, 9, -21.9],
      [9, -20.1, 9, -16],
      [-3, -26, -3, -21.9],
      [-3, -20.1, -3, -16],
      [-13, -26, 19, -26],
      [19, -26, 19, -16],
      [-13, -26, -13, -16],
    ];

    segs.forEach(([x1, z1, x2, z2]) => this._wallSeg(x1, z1, x2, z2, W));

    this._lintel(0, 15, true);
    this._lintel(-3, 7, false);
    this._lintel(-3, -7, false);
    this._lintel(3, 4, false);
    this._lintel(6, -4, true);
    this._lintel(0, -16, true);
    this._lintel(9, -21, false);
    this._lintel(-3, -21, false);
  }

  // ── areas ───────────────────────────────────────────────────────────

  _buildCheckpoint() {
    const P = this._pointLight.bind(this);
    P(0xff2a20, 7, 10, 0, 2.95, 20, true);

    // Security desk with access-log terminal
    this._box(3.4, 0.9, 1.0, this.matMetalDark, -2.6, 0.45, 23.6, { castShadow: true });
    this._screen(-3.2, 1.55, 23.5, 0.4, this.matScreenLog, 0.7, 0.5, {
      kind: 'clue',
      id: 'access-log',
      prompt: 'INSPECT ACCESS LOG',
    });
    this._screen(-2.0, 1.5, 23.6, 0.2, this.matScreenGrid, 0.6, 0.42);

    // Desk chair
    this._box(0.5, 0.08, 0.5, this.matPlastic, -2.6, 0.55, 22.4, { collide: false });
    this._box(0.08, 0.55, 0.08, this.matMetal, -2.6, 0.28, 22.6, { collide: false });
    this.colliders.push(
      new THREE.Box3(new THREE.Vector3(-3.0, 0, 22.0), new THREE.Vector3(-2.2, 1.2, 22.8))
    );

    // Discarded access card on floor
    const cardGeo = new THREE.BoxGeometry(0.22, 0.015, 0.14);
    const cardMat = this._trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: 0.4, metalness: 0.1, emissive: 0x224488, emissiveIntensity: 0.25 })
    );
    const card = new THREE.Mesh(cardGeo, cardMat);
    card.position.set(1.4, 0.03, 18.6);
    card.rotation.y = 0.7;
    this.scene.add(card);
    this.meshes.push(card);
    this.geometries.push(cardGeo);
    this._register('clue', 'access-card', card, card.position, null, 'PICK UP ACCESS CARD');

    // Wall signage + glass partition detail
    this._signPlane('CHECKPOINT', 'SUB-LEVEL 3', 0, 2.4, 24.78, Math.PI, '#facc15');
    this._box(1.6, 1.2, 0.08, this.matGlass, 3.9, 1.6, 24.7, { collide: false });

    // Entry door (sealed behind player — adds to the trap feeling)
    this._box(2.2, 2.6, 0.3, this.matDoor, 0, 1.3, 25.05, { castShadow: true });
    this._signPlane('SEALED', 'LOCKDOWN ACTIVE', 0, 2.2, 24.85, Math.PI, '#f87171');

    this.points = this.points || {};
    this.points.checkpoint = new THREE.Vector3(0, 1.7, 20);
  }

  _buildCorridor() {
    const P = this._pointLight.bind(this);
    P(0xff2a20, 7, 10, 0, 2.95, 10, false);
    P(0xff2a20, 6, 9, 0, 2.95, 0, true);
    P(0xff2a20, 7, 10, 0, 2.95, -10, false);

    // Power lights (off until restored)
    this.powerLights = [];
    [[0, 2.95, 6], [0, 2.95, -6]].forEach(([x, y, z]) => {
      const l = new THREE.PointLight(0xdfe8ff, 0, 11, 1.9);
      l.position.set(x, y, z);
      this.scene.add(l);
      this.meshes.push(l);
      this.powerLights.push(l);
    });

    // Pipes along both walls
    const pipeGeo = new THREE.CylinderGeometry(0.07, 0.07, 30, 10);
    const pipe1 = new THREE.Mesh(pipeGeo, this.matRust);
    pipe1.rotation.x = Math.PI / 2;
    pipe1.position.set(-2.72, 2.55, 0);
    this.scene.add(pipe1);
    const pipe2 = new THREE.Mesh(pipeGeo, this.matMetal);
    pipe2.rotation.x = Math.PI / 2;
    pipe2.position.set(-2.78, 2.3, 0);
    this.scene.add(pipe2);
    const pipe3 = new THREE.Mesh(pipeGeo, this.matMetalDark);
    pipe3.rotation.x = Math.PI / 2;
    pipe3.position.set(2.72, 2.5, 0);
    this.scene.add(pipe3);
    this.meshes.push(pipe1, pipe2, pipe3);
    this.geometries.push(pipeGeo);
    this.colliders.push(
      new THREE.Box3(new THREE.Vector3(-2.95, 2.2, -15.5), new THREE.Vector3(-2.6, 2.7, 15.5))
    );

    // Ceiling cable tray
    this._box(0.5, 0.06, 30, this.matMetalDark, 1.4, 3.05, 0, { collide: false });

    // CAM 04 wall monitor (interactable camera)
    this._screen(2.68, 1.7, 9.5, -Math.PI / 2, this.matScreenLog, 0.6, 0.4, {
      kind: 'camera',
      id: 'cam04',
      data: 'cam04',
      prompt: 'VIEW CAM 04 FEED',
    });
    this._signPlane('CAM 04', 'NODE 43', 2.68, 2.25, 9.5, -Math.PI / 2, '#facc15');

    // Small wall camera prop above monitor
    const camBody = new THREE.BoxGeometry(0.24, 0.14, 0.34);
    const camMesh = new THREE.Mesh(camBody, this.matMetalDark);
    camMesh.position.set(2.7, 2.6, 9.5);
    camMesh.rotation.y = -0.5;
    this.scene.add(camMesh);
    this.meshes.push(camMesh);
    this.geometries.push(camBody);

    // Debris
    for (let i = 0; i < 6; i++) {
      const s = 0.1 + hash(i * 3.7) * 0.16;
      this._box(s, s * 0.6, s, this.matConcreteWall, -1.8 + hash(i) * 3.2, s * 0.3, 12 - i * 4.5, { collide: false });
    }

    this.points.corridorMid = new THREE.Vector3(0, 1.7, 0);
    this.points.corridorNorth = new THREE.Vector3(0, 1.7, -13);
  }

  _buildLab() {
    const P = this._pointLight.bind(this);
    P(0xff2a20, 6, 10, -10, 2.95, 7, true);

    // Work bench
    this._box(4.2, 0.9, 1.2, this.matMetalDark, -12, 0.45, 10.6, { castShadow: true });
    this._screen(-13.2, 1.5, 10.5, 0.35, this.matScreenGrid, 0.66, 0.44, {
      kind: 'clue',
      id: 'message',
      prompt: 'READ TERMINAL MESSAGE',
    });

    // Handwritten note
    const noteGeo = new THREE.PlaneGeometry(0.3, 0.22);
    const noteMat = this._trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0xe8dfc8, roughness: 0.95, emissive: 0x555044, emissiveIntensity: 0.16 })
    );
    const note = new THREE.Mesh(noteGeo, noteMat);
    note.rotation.x = -Math.PI / 2;
    note.rotation.z = 0.5;
    note.position.set(-10.6, 0.92, 10.5);
    this.scene.add(note);
    this.meshes.push(note);
    this.geometries.push(noteGeo);
    this._register('clue', 'note', note, note.position, null, 'READ HANDWRITTEN NOTE');

    // Coffee cup
    const cupGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.1, 10);
    const cup = new THREE.Mesh(cupGeo, this.matPaper);
    cup.position.set(-9.8, 0.98, 10.8);
    this.scene.add(cup);
    this.meshes.push(cup);
    this.geometries.push(cupGeo);

    // Breaker panel — the power puzzle
    const panelGeo = new THREE.BoxGeometry(0.7, 1.0, 0.16);
    const panel = new THREE.Mesh(panelGeo, this.matMetal);
    panel.position.set(-16.7, 1.6, 7);
    this.scene.add(panel);
    this.meshes.push(panel);
    this.geometries.push(panelGeo);
    this.colliders.push(
      new THREE.Box3(new THREE.Vector3(-17, 1.0, 6.6), new THREE.Vector3(-16.4, 2.2, 7.4))
    );

    const leverGeo = new THREE.BoxGeometry(0.08, 0.3, 0.1);
    this.lever = new THREE.Mesh(leverGeo, this._trackMaterial(new THREE.MeshStandardMaterial({ color: 0xff3b30, roughness: 0.4, emissive: 0x551111, emissiveIntensity: 0.5 })));
    this.lever.position.set(-16.58, 1.7, 7);
    this.lever.rotation.z = 0.6;
    this.scene.add(this.lever);
    this.meshes.push(this.lever);
    this.geometries.push(leverGeo);
    this._register('breaker', 'breaker', panel, panel.position, null, 'HOLD — RESTORE POWER');

    this._signPlane('LAB', 'RESEARCH', -16.75, 2.5, 7, Math.PI / 2, '#facc15');

    this.points.lab = new THREE.Vector3(-10, 1.7, 7);
  }

  _buildStorage() {
    const P = this._pointLight.bind(this);
    P(0xff2a20, 5.5, 9, -10, 2.95, -7, true);

    // Shelving units
    for (let i = 0; i < 3; i++) {
      const x = -15.2 + i * 3.4;
      this._box(1.1, 2.1, 4.2, this.matMetalDark, x, 1.05, -7, { castShadow: true });
      for (let j = 0; j < 4; j++) {
        const c = 0.36 + hash(i * 9 + j * 3.3) * 0.3;
        this._box(c, c, c, this.matPlastic, x + (hash(i + j) - 0.5) * 0.5, 0.5 + Math.floor(hash(i * 5 + j)) * 0.7, -8.6 + j * 1.1, { collide: false, castShadow: true });
      }
    }

    // Glowing data drive on a shelf
    const driveGeo = new THREE.BoxGeometry(0.26, 0.08, 0.18);
    const driveMat = this._trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0x1a1f26, roughness: 0.4, emissive: 0x38bdf8, emissiveIntensity: 0.85 })
    );
    const drive = new THREE.Mesh(driveGeo, driveMat);
    drive.position.set(-8.5, 1.32, -6.2);
    drive.rotation.y = 0.4;
    this.scene.add(drive);
    this.meshes.push(drive);
    this.geometries.push(driveGeo);
    this._register('clue', 'data-drive', drive, drive.position, null, 'TAKE DATA DRIVE');

    this.points.storage = new THREE.Vector3(-10, 1.7, -7);
  }

  _buildMaintenance() {
    const P = this._pointLight.bind(this);
    P(0xff2a20, 5, 8, 6, 2.9, 3, true);

    // Vertical pipe bundle
    const vGeo = new THREE.CylinderGeometry(0.09, 0.09, 3.2, 10);
    for (let i = 0; i < 3; i++) {
      const v = new THREE.Mesh(vGeo, i === 1 ? this.matRust : this.matMetalDark);
      v.position.set(8.6, 1.6, 1.2 + i * 0.5);
      this.scene.add(v);
      this.meshes.push(v);
    }
    this.geometries.push(vGeo);
    this.colliders.push(new THREE.Box3(new THREE.Vector3(8.3, 0, 0.9), new THREE.Vector3(8.95, 3, 2.4)));

    // Barrels
    const barrelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.85, 12);
    [
      [4.2, 8.6],
      [4.9, 8.2],
    ].forEach(([x, z]) => {
      const b = new THREE.Mesh(barrelGeo, this.matRust);
      b.position.set(x, 0.43, z);
      this.scene.add(b);
      this.meshes.push(b);
      this.colliders.push(new THREE.Box3().setFromObject(b));
    });
    this.geometries.push(barrelGeo);

    // Toolbox
    this._box(0.5, 0.24, 0.3, this.matPlastic, 7.4, 0.12, 7.5, { castShadow: true });

    // Sparking junction box
    const boxGeo = new THREE.BoxGeometry(0.36, 0.5, 0.2);
    const jbox = new THREE.Mesh(boxGeo, this.matMetal);
    jbox.position.set(8.7, 1.9, 4.5);
    this.scene.add(jbox);
    this.meshes.push(jbox);
    this.geometries.push(boxGeo);
    this.junctionSparks = { position: new THREE.Vector3(8.6, 1.75, 4.5), timer: 3.0 };
    this.sparkLight = new THREE.PointLight(0xbfdcff, 0, 6, 2);
    this.sparkLight.position.set(8.5, 1.6, 4.5);
    this.scene.add(this.sparkLight);
    this.meshes.push(this.sparkLight);

    // Loose cables across the floor
    const cableGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.4, 6);
    const cable = new THREE.Mesh(cableGeo, this.matCable);
    cable.rotation.z = Math.PI / 2;
    cable.rotation.y = 0.4;
    cable.position.set(6, 0.04, 6.5);
    this.scene.add(cable);
    this.meshes.push(cable);
    this.geometries.push(cableGeo);

    this._signPlane('MAINTENANCE', 'SUB-3', 8.78, 2.3, 4, -Math.PI / 2, '#facc15');

    this.points.maintenance = new THREE.Vector3(6, 1.7, 3);
  }

  _buildDatacenter() {
    const P = this._pointLight.bind(this);
    P(0xff2a20, 6, 10, 9, 2.95, -9, true);

    this._serverRow(5.5, -6.4, 4);
    this._serverRow(5.5, -11.4, 4);

    // Breach monitoring station
    this._box(2.4, 0.9, 0.9, this.matMetalDark, 11.5, 0.45, -7.2, { castShadow: true });
    this._screen(11.5, 1.55, -7.55, 0, this.matScreenLog, 1.0, 0.62);

    this.points.datacenter = new THREE.Vector3(9, 1.7, -9);
  }

  _buildServerRoom() {
    const P = this._pointLight.bind(this);
    P(0xff2a20, 7, 11, 3, 2.95, -21, true);

    this.powerLightServer = new THREE.PointLight(0xdfe8ff, 0, 12, 1.9);
    this.powerLightServer.position.set(3, 2.95, -21);
    this.scene.add(this.powerLightServer);
    this.meshes.push(this.powerLightServer);

    this._serverRow(0, -19, 4);
    this._serverRow(0, -23, 4);

    // Damaged / scorched rack (clue)
    const dmgGeo = new THREE.BoxGeometry(0.95, 2.2, 0.85);
    const dmgMat = this._trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0x181512, roughness: 0.85, metalness: 0.5 })
    );
    const dmg = new THREE.Mesh(dmgGeo, dmgMat);
    dmg.position.set(7.4, 1.1, -18.6);
    this.scene.add(dmg);
    this.meshes.push(dmg);
    this.geometries.push(dmgGeo);
    this.colliders.push(new THREE.Box3().setFromObject(dmg));

    const scorch = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 1.6),
      this._trackMaterial(new THREE.MeshBasicMaterial({ color: 0x0a0908, transparent: true, opacity: 0.55 }))
    );
    scorch.position.set(7.4, 1.2, -18.14);
    scorch.rotation.y = Math.PI;
    this.scene.add(scorch);
    this.meshes.push(scorch);
    this.geometries.push(scorch.geometry);

    this._register('clue', 'server-log', dmg, dmg.position, null, 'INSPECT DAMAGED SERVER');

    // Fallen papers
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.38), this.matPaper);
      p.rotation.x = -Math.PI / 2;
      p.rotation.z = hash(i * 7.3) * Math.PI;
      p.position.set(-1 + hash(i) * 7, 0.012, -17.4 + i * 0.7);
      this.scene.add(p);
      this.meshes.push(p);
      this.geometries.push(p.geometry);
    }

    this._signPlane('SERVER FARM', 'BAYS 1–4', 0, 2.35, -16.25, 0, '#facc15');

    this.points.serverRoom = new THREE.Vector3(3, 1.7, -21);
  }

  _serverRow(xStart, z, count) {
    for (let i = 0; i < count; i++) {
      const x = xStart + i * 1.9;
      const rackGeo = new THREE.BoxGeometry(1.5, 2.2, 0.85);
      const rack = new THREE.Mesh(rackGeo, this.matMetalDark);
      rack.position.set(x, 1.1, z);
      rack.castShadow = true;
      this.scene.add(rack);
      this.meshes.push(rack);
      this.geometries.push(rackGeo);
      this.colliders.push(new THREE.Box3().setFromObject(rack));

      const ledGeo = new THREE.PlaneGeometry(1.3, 0.09);
      const ledMat = this._trackMaterial(
        new THREE.MeshBasicMaterial({ color: 0x1a0d0d })
      );
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(x, 1.62, z + (z < -16 ? -0.44 : 0.44));
      if (z < -16) led.rotation.y = Math.PI;
      this.scene.add(led);
      this.meshes.push(led);
      this.geometries.push(ledGeo);
      this.ledMats.push(ledMat);

      const ventGeo = new THREE.PlaneGeometry(1.3, 0.5);
      const vent = new THREE.Mesh(ventGeo, this._trackMaterial(new THREE.MeshBasicMaterial({ color: 0x0b0e12 })));
      vent.position.set(x, 1.0, z + (z < -16 ? -0.44 : 0.44));
      if (z < -16) vent.rotation.y = Math.PI;
      this.scene.add(vent);
      this.meshes.push(vent);
      this.geometries.push(ventGeo);
    }
  }

  _buildControlRoom() {
    const P = this._pointLight.bind(this);
    P(0xff2a20, 6.5, 11, 14, 2.95, -21, true);

    // Console
    this._box(3.6, 0.9, 1.1, this.matMetalDark, 14, 0.45, -24.2, { castShadow: true });
    this._screen(12.8, 1.55, -24.3, 0.4, this.matScreenGrid, 0.66, 0.44);
    this._screen(14.0, 1.55, -24.5, 0.15, this.matScreenLog, 0.66, 0.44);

    // Archive playback monitor (clue 08)
    this._screen(15.6, 1.6, -24.2, -0.3, this.matScreenAlert, 0.72, 0.48, {
      kind: 'camera',
      id: 'archive',
      data: 'archive',
      prompt: 'PLAY ARCHIVE RECORDING',
    });

    // Operator chairs
    [
      [13.2, -22.8],
      [14.8, -22.6],
    ].forEach(([x, z]) => {
      this._box(0.52, 0.08, 0.52, this.matPlastic, x, 0.55, z, { collide: false });
      this.colliders.push(new THREE.Box3(new THREE.Vector3(x - 0.3, 0, z - 0.3), new THREE.Vector3(x + 0.3, 1.1, z + 0.3)));
    });

    // Wall of glass looking into server room
    this._box(0.08, 1.6, 3.2, this.matGlass, 9.1, 1.7, -18.5, { collide: false });

    this._signPlane('CONTROL', 'AUTHORISED ONLY', 14, 2.4, -16.25, 0, '#f87171');

    this.points.controlRoom = new THREE.Vector3(14, 1.7, -21);
  }

  _buildFinalChamber() {
    const P = this._pointLight.bind(this);
    this.finalLight = P(0xff2a20, 5, 9, -8, 2.95, -21, true);

    // Central pedestal + containment terminal
    this._box(1.6, 1.0, 1.0, this.matMetalDark, -8, 0.5, -21, { castShadow: true });
    this._screen(-8, 1.62, -21.42, 0, this.matScreenFinal, 0.85, 0.55, {
      kind: 'final',
      id: 'final-terminal',
      prompt: 'HOLD — INITIATE TRACE',
    });

    // Cables snaking to the pedestal
    const cableGeo = new THREE.CylinderGeometry(0.035, 0.035, 5.4, 6);
    const c1 = new THREE.Mesh(cableGeo, this.matCable);
    c1.rotation.z = Math.PI / 2;
    c1.rotation.y = 0.18;
    c1.position.set(-8, 0.05, -19);
    this.scene.add(c1);
    this.meshes.push(c1);
    this.geometries.push(cableGeo);

    // Racks ringing the chamber
    this._serverRow(-11.2, -25, 2);
    this._serverRow(-11.2, -17, 2);

    this._signPlane('CONTAINMENT', 'NODE 43', -8, 2.4, -16.25, 0, '#f87171');

    this.points.finalChamber = new THREE.Vector3(-8, 1.7, -23);
  }

  _buildDoors() {
    this._door('entry', 0, 15, true, { auto: true });
    this._door('lab', -3, 7, false, { auto: true });
    this._door('storage', -3, -7, false, { auto: true });
    this._door('maintenance', 3, 4, false, { auto: true });
    this._door('datacenter', 6, -4, true, { auto: true });
    this._door('serverroom', 0, -16, true, { locked: true, reason: 'MAGLOCK ENGAGED — POWER OFFLINE' });
    this._door('controlroom', 9, -21, false, { locked: true, reason: 'KEYPAD REQUIRED — OVERRIDE 0243' });

    const keypadDoor = this.doors.controlroom;
    this._register('keypad', 'keypad', keypadDoor.mesh, keypadDoor.mesh.position, null, 'ENTER OVERRIDE CODE');

    this._door('final', -3, -21, false, { locked: true, reason: 'CONTAINMENT — 8 SIGNATURES REQUIRED' });
  }

  _buildDust() {
    const count = this.quality === 'high' ? 260 : 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = -16 + hash(i * 1.3) * 32;
      positions[i * 3 + 1] = 0.3 + hash(i * 2.7) * 2.6;
      positions[i * 3 + 2] = -25 + hash(i * 4.1) * 49;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = this._trackMaterial(
      new THREE.PointsMaterial({ color: 0x9fb4c8, size: 0.025, transparent: true, opacity: 0.4, depthWrite: false })
    );
    this.dust = new THREE.Points(geo, mat);
    this.dust.frustumCulled = false;
    this.scene.add(this.dust);
    this.meshes.push(this.dust);
    this.geometries.push(geo);
  }

  // ── state mutations ─────────────────────────────────────────────────

  setPower(on) {
    this.powerOn = on;
    this.powerLights.forEach((l) => {
      l.intensity = on ? 9 : 0;
    });
    if (this.powerLightServer) this.powerLightServer.intensity = on ? 10 : 0;
    this.ledMats.forEach((m, i) => {
      m.color.setHex(on ? 0x0d2b18 : 0x1a0d0d);
      if (on && i % 3 === 0) m.color.setHex(0x123a20);
    });
    if (this.lever) {
      this.lever.material.color.setHex(0x34d399);
      this.lever.material.emissive.setHex(0x0d4429);
      this.lever.rotation.z = -0.6;
    }
  }

  setScreenMaterials(alertMat, gridMat, logMat, finalMat) {
    if (alertMat) this.matScreenAlert = alertMat;
    if (gridMat) this.matScreenGrid = gridMat;
    if (logMat) this.matScreenLog = logMat;
    if (finalMat) this.matScreenFinal = finalMat;
  }

  // ── per-frame update ────────────────────────────────────────────────

  update(delta, elapsed, playerPos, tension = 0) {
    this._updateDoors(delta, playerPos);

    // Flickering emergency lights
    for (const f of this.flickerLights) {
      const n =
        Math.sin(elapsed * 11 + f.seed) * Math.sin(elapsed * 5.3 + f.seed * 1.7);
      const instability = 0.75 + tension * 0.25;
      const drop = n > 0.86 - tension * 0.12 ? 0.15 : 1;
      f.light.intensity = f.base * instability * drop;
      f.bulb.material.color.setScalar(0.2 + (f.light.intensity / f.base) * 0.8);
    }

    // Server LED blink
    const blinkOn = Math.sin(elapsed * 6) > 0;
    for (let i = 0; i < this.ledMats.length; i++) {
      if (i % 4 === (Math.floor(elapsed * 2) % 4)) {
        this.ledMats[i].color.setHex(this.powerOn ? 0x123a20 : blinkOn ? 0x521212 : 0x1a0d0d);
      }
    }

    // Dust drift
    if (this.dust) {
      const pos = this.dust.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - delta * 0.05;
        if (y < 0.2) y = 2.9;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // Sparks at the maintenance junction box
    if (this.junctionSparks) {
      this.junctionSparks.timer -= delta;
      const threshold = 7.0 - tension * 4.0;
      if (this.junctionSparks.timer <= 0) {
        this.junctionSparks.timer = 3 + Math.random() * threshold;
        this.sparkLight.intensity = 26;
        if (this.sparkParticles) this._burstSparks();
      }
      this.sparkLight.intensity = Math.max(0, this.sparkLight.intensity - delta * 90);
    }
  }

  _burstSparks() {
    const { position } = this.junctionSparks;
    this.sparkParticles.forEach((p) => {
      p.position.copy(position);
      p.visible = true;
      p.userData.life = 0.4 + Math.random() * 0.2;
      p.userData.vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2.4,
        -Math.random() * 1.6,
        (Math.random() - 0.5) * 2.4
      );
    });
  }

  initSparkParticles() {
    if (this.sparkParticles) return;
    this.sparkParticles = [];
    const geo = new THREE.BoxGeometry(0.03, 0.03, 0.03);
    const mat = this._trackMaterial(new THREE.MeshBasicMaterial({ color: 0xcfe4ff }));
    for (let i = 0; i < 14; i++) {
      const p = new THREE.Mesh(geo, mat);
      p.visible = false;
      this.scene.add(p);
      this.meshes.push(p);
      this.sparkParticles.push(p);
    }
    this.geometries.push(geo);
  }

  updateSparkParticles(delta) {
    if (!this.sparkParticles) return;
    for (const p of this.sparkParticles) {
      if (!p.visible) continue;
      p.userData.life -= delta;
      if (p.userData.life <= 0) {
        p.visible = false;
        continue;
      }
      p.position.addScaledVector(p.userData.vel, delta);
      p.userData.vel.y -= 5 * delta;
    }
  }

  dispose() {
    for (const mesh of this.meshes) {
      this.scene.remove(mesh);
    }
    for (const geo of this.geometries) {
      geo.dispose();
    }
    for (const mat of this.materials) {
      mat.dispose();
    }
    for (const tex of this.textures) {
      tex.dispose();
    }
    for (const tex of this.signCanvasTextures) {
      tex.dispose();
    }
    this.meshes = [];
    this.geometries = [];
    this.materials = [];
    this.textures = [];
    this.signCanvasTextures = [];
    this.interactables = [];
    this.colliders = [];
    this.doors = {};
  }
}

export default Facility;
