/**
 * Procedural Web Audio ambience + SFX for BLACKOUT.
 * Zero external audio files — everything synthesized.
 * Owns a single AudioContext, fully stopped/disposed on game exit.
 */

class BlackoutAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.nodes = [];
    this.started = false;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
  }

  _track(node) {
    this.nodes.push(node);
    return node;
  }

  startAmbience() {
    this.init();
    if (!this.ctx || this.started) return;
    this.started = true;

    // Deep facility drone
    const drone = this.ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 42;
    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.05;
    drone.connect(droneGain).connect(this.master);
    drone.start();
    this._track(drone);
    this._track(droneGain);

    // Ventilation hiss (filtered noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 380;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.028;
    noise.connect(noiseFilter).connect(noiseGain).connect(this.master);
    noise.start();
    this._track(noise);
    this._track(noiseFilter);
    this._track(noiseGain);

    // Electrical buzz
    const buzz = this.ctx.createOscillator();
    buzz.type = 'sawtooth';
    buzz.frequency.value = 118;
    const buzzGain = this.ctx.createGain();
    buzzGain.gain.value = 0.006;
    const buzzFilter = this.ctx.createBiquadFilter();
    buzzFilter.type = 'bandpass';
    buzzFilter.frequency.value = 900;
    buzz.connect(buzzFilter).connect(buzzGain).connect(this.master);
    buzz.start();
    this._track(buzz);
    this._track(buzzFilter);
    this._track(buzzGain);
  }

  setTension(level) {
    // level 0..1 — raises drone pitch/gain and buzz
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (this._droneGain) this._droneGain.gain.linearRampToValueAtTime(0.05 + level * 0.05, t + 2);
  }

  _beep(freq, dur, type = 'sine', gain = 0.14, when = 0) {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  clueFound() {
    this._beep(660, 0.3, 'sine', 0.16);
    this._beep(990, 0.4, 'sine', 0.12, 0.12);
  }

  uiBeep() {
    this._beep(880, 0.07, 'square', 0.07);
  }

  deny() {
    this._beep(220, 0.18, 'square', 0.12);
    this._beep(180, 0.22, 'square', 0.12, 0.14);
  }

  grant() {
    this._beep(523, 0.12, 'square', 0.1);
    this._beep(784, 0.2, 'square', 0.1, 0.1);
  }

  door() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.linearRampToValueAtTime(90, t + 0.5);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.55);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t);
  }

  footstep() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.09;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500 + Math.random() * 250;
    const g = this.ctx.createGain();
    g.gain.value = 0.12;
    src.connect(filter).connect(g).connect(this.master);
    src.start(t);
  }

  alarm() {
    this._beep(440, 0.5, 'sawtooth', 0.05);
    this._beep(415, 0.5, 'sawtooth', 0.05, 0.55);
  }

  glitch() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (i % 8 < 3 ? 1 : 0.2);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    src.connect(g).connect(this.master);
    src.start(t);
  }

  stopAll() {
    if (!this.ctx) return;
    try {
      this.nodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
        } catch {
          /* already stopped */
        }
      });
      this.nodes.forEach((node) => {
        try {
          node.disconnect();
        } catch {
          /* noop */
        }
      });
    } catch {
      /* noop */
    }
    this.nodes = [];
    this.started = false;
    try {
      this.ctx.close();
    } catch {
      /* noop */
    }
    this.ctx = null;
    this.master = null;
  }
}

export const blackoutAudio = new BlackoutAudio();
