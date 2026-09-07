import * as THREE from 'three';

/**
 * Creates the futuristic digital arena
 * Features neon grids, glowing server racks, holographic walls, floating developer code fragments, and collision bounding boxes.
 */
export class GameWorld {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.particles = null;
    this.floatingCodeMeshes = [];

    this.init();
  }

  init() {
    // ── Ambient & Directional Lighting ──────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0a1128, 1.8);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x4285f4, 1.2);
    dirLight1.position.set(20, 40, 20);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xea4335, 0.8);
    dirLight2.position.set(-20, 30, -20);
    this.scene.add(dirLight2);

    // Subtle atmospheric fog
    this.scene.fog = new THREE.FogExp2(0x050814, 0.025);

    // ── Floor with Neon Grid ────────────────────────────────────────────
    const floorGeo = new THREE.PlaneGeometry(120, 120);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.8,
      metalness: 0.4,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.scene.add(floor);

    // Digital Grid overlay
    const grid = new THREE.GridHelper(120, 60, 0x4285f4, 0x1e293b);
    grid.position.y = 0.02;
    this.scene.add(grid);

    // ── Arena Outer Boundary Walls ──────────────────────────────────────
    const wallHeight = 8;
    const arenaSize = 50; // bounds: -50 to +50

    this.createWall(0, wallHeight / 2, -arenaSize, 100, wallHeight, 1.5, 0x4285f4);
    this.createWall(0, wallHeight / 2, arenaSize, 100, wallHeight, 1.5, 0x34a853);
    this.createWall(-arenaSize, wallHeight / 2, 0, 1.5, wallHeight, 100, 0xea4335);
    this.createWall(arenaSize, wallHeight / 2, 0, 1.5, wallHeight, 100, 0xfbbc04);

    // ── Futuristic Server Towers & Pillars ──────────────────────────────
    const serverPositions = [
      [-20, -20], [20, -20], [-20, 20], [20, 20],
      [-35, 0], [35, 0], [0, -35], [0, 35],
      [-12, -8], [12, -8], [-12, 8], [12, 8]
    ];

    serverPositions.forEach(([x, z], i) => {
      const h = 6 + (i % 3) * 1.5;
      const col = [0x4285f4, 0xea4335, 0x34a853, 0xfbbc04][i % 4];
      this.createServerRack(x, h / 2, z, 3, h, 3, col);
    });

    // ── Floating Developer Code Particles & Texts ───────────────────────
    this.createFloatingCodeFragments();
    this.createDigitalParticles();
  }

  createWall(x, y, z, w, h, d, glowColor) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x080e1e,
      roughness: 0.6,
      metalness: 0.5,
    });
    const wall = new THREE.Mesh(geo, mat);
    wall.position.set(x, y, z);
    this.scene.add(wall);

    // Edge glowing strip
    const edgeGeo = new THREE.BoxGeometry(w, 0.15, d);
    const edgeMat = new THREE.MeshBasicMaterial({ color: glowColor });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.set(x, h - 0.1, z);
    this.scene.add(edge);

    // Add bounding box for collision detection
    const box = new THREE.Box3().setFromObject(wall);
    this.colliders.push(box);
  }

  createServerRack(x, y, z, w, h, d, accentColor) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0b1329,
      roughness: 0.5,
      metalness: 0.7,
    });
    const server = new THREE.Mesh(geo, mat);
    server.position.set(x, y, z);
    this.scene.add(server);

    // Glowing server lights
    const lightBarGeo = new THREE.BoxGeometry(w * 0.8, 0.1, d * 1.02);
    const lightBarMat = new THREE.MeshBasicMaterial({ color: accentColor });
    for (let i = 1; i < h; i += 1.2) {
      const bar = new THREE.Mesh(lightBarGeo, lightBarMat);
      bar.position.set(x, i, z);
      this.scene.add(bar);
    }

    // Collider
    const box = new THREE.Box3().setFromObject(server);
    this.colliders.push(box);
  }

  createFloatingCodeFragments() {
    const codeTexts = [
      '< />', 'git push', 'npm run dev', '127.0.0.1', 'localhost:5000',
      'sudo systemctl', 'HTTP/2 200 OK', 'const kernel = true;', 'GDGC_PCCOE',
      'DEBUG=false', 'async function()', 'ptr = &core', 'PORT=5173'
    ];

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    codeTexts.forEach((text, i) => {
      ctx.clearRect(0, 0, 256, 64);
      ctx.fillStyle = '#050c1e';
      ctx.fillRect(0, 0, 256, 64);
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = ['#4285F4', '#34A853', '#FBBC04', '#EA4335'][i % 4];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.8 });
      const sprite = new THREE.Sprite(spriteMat);

      const angle = (i / codeTexts.length) * Math.PI * 2;
      const radius = 18 + (i % 3) * 6;
      const y = 3 + (i % 4) * 1.2;

      sprite.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      sprite.scale.set(4.5, 1.2, 1);
      this.scene.add(sprite);
      this.floatingCodeMeshes.push({ mesh: sprite, baseY: y, speed: 0.8 + (i % 3) * 0.4 });
    });
  }

  createDigitalParticles() {
    const count = 350;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color(0x4285f4),
      new THREE.Color(0xea4335),
      new THREE.Color(0xfbbc04),
      new THREE.Color(0x34a853),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  update(delta, time) {
    // Float code fragments
    this.floatingCodeMeshes.forEach((item) => {
      item.mesh.position.y = item.baseY + Math.sin(time * item.speed) * 0.4;
    });

    // Slow rotate dust particles
    if (this.particles) {
      this.particles.rotation.y = time * 0.02;
    }
  }

  dispose() {
    // Clean up scene objects
    this.colliders = [];
    this.floatingCodeMeshes = [];
  }
}
