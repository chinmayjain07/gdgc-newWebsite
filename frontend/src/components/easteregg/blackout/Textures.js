import * as THREE from 'three';

/**
 * Procedural PBR texture factory for the Blackout facility.
 * Generates canvas-based albedo/roughness/normal maps at runtime so the
 * game needs zero downloaded textures. All textures are memoized and
 * disposed by the caller on exit.
 */

const cache = new Map();

function makeCanvas(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function noiseOverlay(ctx, size, amount, alpha) {
  const imageData = ctx.getImageData(0, 0, size, size);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    d[i + 3] = Math.min(255, d[i + 3] * alpha + 255 * (1 - alpha));
  }
  ctx.putImageData(imageData, 0, 0);
}

function canvasToTexture(canvas, repeatX = 1, repeatY = 1) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 4;
  return tex;
}

function heightToNormal(canvas, strength = 2.0) {
  const size = canvas.width;
  const src = canvas.getContext('2d').getImageData(0, 0, size, size).data;
  const out = makeCanvas(size);
  const ctx = out.getContext('2d');
  const result = ctx.createImageData(size, size);
  const getH = (x, y) => {
    const xi = (x + size) % size;
    const yi = (y + size) % size;
    return src[(yi * size + xi) * 4] / 255;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (getH(x - 1, y) - getH(x + 1, y)) * strength;
      const dy = (getH(x, y - 1) - getH(x, y + 1)) * strength;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const i = (y * size + x) * 4;
      result.data[i] = ((dx / len) * 0.5 + 0.5) * 255;
      result.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      result.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      result.data[i + 3] = 255;
    }
  }
  ctx.putImageData(result, 0, 0);
  return out;
}

function buildSet(canvas, repeatX, repeatY, normalStrength = 2.0) {
  const normalCanvas = heightToNormal(canvas, normalStrength);
  return {
    map: canvasToTexture(canvas, repeatX, repeatY),
    normalMap: canvasToTexture(normalCanvas, repeatX, repeatY),
  };
}

export function getConcreteTexture(repeatX = 4, repeatY = 2) {
  const key = `concrete-${repeatX}-${repeatY}`;
  if (cache.has(key)) return cache.get(key);

  const size = 256;
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#6d6f6c';
  ctx.fillRect(0, 0, size, size);

  // Blotches / stains
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 6 + Math.random() * 40;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const shade = 90 + Math.random() * 60;
    g.addColorStop(0, `rgba(${shade},${shade},${shade - 4},0.16)`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cracks
  ctx.strokeStyle = 'rgba(38,38,36,0.55)';
  for (let i = 0; i < 7; i++) {
    ctx.lineWidth = 0.6 + Math.random();
    ctx.beginPath();
    let x = Math.random() * size;
    let y = Math.random() * size;
    ctx.moveTo(x, y);
    for (let s = 0; s < 9; s++) {
      x += (Math.random() - 0.5) * 42;
      y += (Math.random() - 0.5) * 42;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  noiseOverlay(ctx, size, 46, 1);
  const set = buildSet(canvas, repeatX, repeatY, 1.6);
  cache.set(key, set);
  return set;
}

export function getMetalTexture(repeatX = 2, repeatY = 2) {
  const key = `metal-${repeatX}-${repeatY}`;
  if (cache.has(key)) return cache.get(key);

  const size = 256;
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext('2d');

  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, '#7c828a');
  base.addColorStop(0.5, '#6b7078');
  base.addColorStop(1, '#767c84');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Brushed streaks
  for (let i = 0; i < 140; i++) {
    ctx.strokeStyle = `rgba(${Math.random() > 0.5 ? '255,255,255' : '20,22,26'},${0.03 + Math.random() * 0.05})`;
    ctx.lineWidth = 0.5 + Math.random();
    const y = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }

  // Scratches
  ctx.strokeStyle = 'rgba(30,32,36,0.4)';
  for (let i = 0; i < 16; i++) {
    ctx.lineWidth = 0.5 + Math.random() * 0.8;
    ctx.beginPath();
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 70, y + (Math.random() - 0.5) * 70);
    ctx.stroke();
  }

  noiseOverlay(ctx, size, 26, 1);
  const set = buildSet(canvas, repeatX, repeatY, 1.2);
  cache.set(key, set);
  return set;
}

export function getFloorTexture(repeatX = 8, repeatY = 8) {
  const key = `floor-${repeatX}-${repeatY}`;
  if (cache.has(key)) return cache.get(key);

  const size = 256;
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4c4e4c';
  ctx.fillRect(0, 0, size, size);

  // Tile grooves
  ctx.strokeStyle = 'rgba(26,27,26,0.9)';
  ctx.lineWidth = 3;
  for (let i = 0; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo((i * size) / 2, 0);
    ctx.lineTo((i * size) / 2, size);
    ctx.moveTo(0, (i * size) / 2);
    ctx.lineTo(size, (i * size) / 2);
    ctx.stroke();
  }

  // Water stains
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 10 + Math.random() * 34;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(28,32,30,0.28)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  noiseOverlay(ctx, size, 40, 1);
  const set = buildSet(canvas, repeatX, repeatY, 1.4);
  cache.set(key, set);
  return set;
}

export function getScreenTexture(lines = 'alert') {
  const key = `screen-${lines}`;
  if (cache.has(key)) return cache.get(key);

  const canvas = makeCanvas(256);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#041008';
  ctx.fillRect(0, 0, 256, 256);
  ctx.font = 'bold 15px monospace';

  const content = {
    alert: [
      ['>> SECURITY NODE 04', '#f87171'],
      ['STATUS: COMPROMISED', '#f87171'],
      ['', '#fff'],
      ['LAST CONNECTION', '#facc15'],
      ['02:17:43', '#e5e7eb'],
      ['SOURCE: UNKNOWN', '#e5e7eb'],
      ['', '#fff'],
      ['EXFILTRATION ACTIVE', '#f87171'],
    ],
    grid: [
      ['SYSTEM DIAGNOSTIC', '#4ade80'],
      ['-----------------', '#4ade80'],
      ['MEM 64% OK', '#86efac'],
      ['NET LINK STABLE', '#86efac'],
      ['PWR BUS A/B OK', '#86efac'],
      ['TEMP 21.4C', '#86efac'],
    ],
    log: [
      ['ACCESS LOG 02:13', '#60a5fa'],
      ['CARD #7741 :: GRANTED', '#93c5fd'],
      ['CARD #0663 :: DENIED', '#f87171'],
      ['CARD #0663 :: DENIED', '#f87171'],
      ['OVERRIDE :: ???', '#facc15'],
    ],
    final: [
      ['CONTAINMENT NODE', '#fbbf24'],
      ['DATA EXTRACTION', '#f87171'],
      ['██████████░░░░ 68%', '#fbbf24'],
      ['SOURCE: NODE 43', '#e5e7eb'],
      ['TRACE: AVAILABLE', '#4ade80'],
    ],
  }[lines] || content.alert;

  content.forEach(([text, color], i) => {
    ctx.fillStyle = color;
    ctx.fillText(text, 14, 34 + i * 24);
  });

  // Scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  for (let y = 0; y < 256; y += 4) {
    ctx.fillRect(0, y, 256, 1.4);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  cache.set(`screen-${lines}`, tex);
  return tex;
}

export function disposeTextureCache() {
  cache.forEach((set) => {
    const entries = set.map ? set : Object.values(set);
    entries.forEach((tex) => {
      if (tex && tex.dispose) tex.dispose();
    });
  });
  cache.clear();
}
