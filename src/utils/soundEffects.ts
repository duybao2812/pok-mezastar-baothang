// Web Audio API Retro Arcade Synthesizer for Pokémon Mezastar

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy init AudioContext upon first user interaction to comply with browser autoplay policies
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Arcade UI Button Click
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio playback silently ignored
    }
  }

  // 2. Quantity +1 Increment Tone
  public playIncrement() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.06); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // 3. Quantity -1 Decrement Tone
  public playDecrement() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(329.63, now + 0.06); // E4

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  // 4. Superstar 6★ Legendary Fanfare
  public playSuperstarFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High-energy fanfare chord progression: C5 -> E5 -> G5 -> B5 -> C6 -> E6
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
      
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.09;
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(freq * 1.005, noteTime); // subtle chorus shimmer

        const duration = idx === notes.length - 1 ? 0.6 : 0.18;
        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + duration);
        osc2.start(noteTime);
        osc2.stop(noteTime + duration);
      });
    } catch {}
  }

  // 5. Star 5★ Victory Chime
  public playStarChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        const duration = idx === notes.length - 1 ? 0.4 : 0.14;
        gain.gain.setValueAtTime(0.15, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + duration);
      });
    } catch {}
  }

  // 6. Camera Laser Scan Sweep
  public playScanLaser() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.45);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  // 7. Trade / Swap Chime
  public playTradeChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      osc.frequency.setValueAtTime(1100, now + 0.16);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }
}

export const sounds = new SoundEngine();
