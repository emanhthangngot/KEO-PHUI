// Web Audio API sound synthesizer for tactile micro-interactions and CS2 esports audio

class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Soft tactile click for buttons and tabs
  public playClick(pitch: number = 600): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio errors
    }
  }

  // Captain Ready powerup sound
  public playReady(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // Match Found esports buzzer / fanfare
  public playMatchFound(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Chord sequence: D4 -> G4 -> B4 -> D5
      const freqs = [293.66, 392.0, 493.88, 587.33];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);

        gain.gain.setValueAtTime(0.06, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + idx * 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + 0.5 + idx * 0.06);
      });
    } catch {
      // Ignore
    }
  }

  // Referee double whistle when match is locked / confirmed
  public playWhistle(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const blast = (start: number, dur: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';

        osc1.frequency.setValueAtTime(2600, start);
        osc1.frequency.linearRampToValueAtTime(2850, start + dur);

        osc2.frequency.setValueAtTime(2720, start);
        osc2.frequency.linearRampToValueAtTime(2970, start + dur);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(start);
        osc2.start(start);
        osc1.stop(start + dur);
        osc2.stop(start + dur);
      };

      blast(now, 0.14);
      blast(now + 0.2, 0.26);
    } catch {
      // Ignore
    }
  }

  // CS2 Victory Stinger & Fanfare
  public playCS2Victory(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Heavy bass impact kick
      const kick = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kick.type = 'triangle';
      kick.frequency.setValueAtTime(160, now);
      kick.frequency.exponentialRampToValueAtTime(35, now + 0.4);
      kickGain.gain.setValueAtTime(0.3, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      kick.connect(kickGain);
      kickGain.connect(ctx.destination);
      kick.start(now);
      kick.stop(now + 0.4);

      // Heroic triumphant brass arpeggio (C4 -> E4 -> G4 -> C5 -> E5)
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        const start = now + idx * 0.09;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch {
      // Ignore
    }
  }

  // CS2 Defeat Stinger (Deep gloomy distorted warning)
  public playCS2Defeat(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Deep descending drone
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(110, now);
      sub.frequency.linearRampToValueAtTime(55, now + 0.8);
      subGain.gain.setValueAtTime(0.25, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.8);

      // Dissonant interval (tritone)
      const tritone = ctx.createOscillator();
      const tritoneGain = ctx.createGain();
      tritone.type = 'triangle';
      tritone.frequency.setValueAtTime(155.56, now + 0.1);
      tritone.frequency.linearRampToValueAtTime(77.78, now + 0.9);
      tritoneGain.gain.setValueAtTime(0.15, now + 0.1);
      tritoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      tritone.connect(tritoneGain);
      tritoneGain.connect(ctx.destination);
      tritone.start(now + 0.1);
      tritone.stop(now + 0.9);
    } catch {
      // Ignore
    }
  }

  // Tactical Radio Ping for notifications and invites
  public playTacticalPing(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.09, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, now + 0.09);
      gain2.gain.setValueAtTime(0.12, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }
}

export const sounds = new SoundController();
