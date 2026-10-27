// Web Audio API Synthesizer for Solfeggio & Meditative Akashic Frequencies

class SoundEngine {
  private ctx: AudioContext | null = null;
  private primaryOsc: OscillatorNode | null = null;
  private binauralOsc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentFrequency: number = 432;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playFrequency(frequency: number, binauralDelta: number = 4) {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.stop();

      this.currentFrequency = frequency;
      const now = this.ctx.currentTime;

      // Master gain
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, now);
      // Gentle fade in over 2 seconds
      this.gainNode.gain.exponentialRampToValueAtTime(0.12, now + 2);
      this.gainNode.connect(this.ctx.destination);

      // Primary sine wave
      this.primaryOsc = this.ctx.createOscillator();
      this.primaryOsc.type = 'sine';
      this.primaryOsc.frequency.setValueAtTime(frequency, now);

      // Binaural wave (e.g., +4Hz theta beat for deep meditation and Akashic access)
      this.binauralOsc = this.ctx.createOscillator();
      this.binauralOsc.type = 'sine';
      this.binauralOsc.frequency.setValueAtTime(frequency + binauralDelta, now);

      // Panners for stereo binaural effect if supported
      try {
        const leftPanner = this.ctx.createStereoPanner();
        const rightPanner = this.ctx.createStereoPanner();
        leftPanner.pan.setValueAtTime(-0.8, now);
        rightPanner.pan.setValueAtTime(0.8, now);

        this.primaryOsc.connect(leftPanner);
        leftPanner.connect(this.gainNode);

        this.binauralOsc.connect(rightPanner);
        rightPanner.connect(this.gainNode);
      } catch {
        // Fallback if StereoPanner is not supported
        this.primaryOsc.connect(this.gainNode);
        this.binauralOsc.connect(this.gainNode);
      }

      this.primaryOsc.start(now);
      this.binauralOsc.start(now);
      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio playback not supported or interaction required:', e);
    }
  }

  public playSingingBowlChime(freq: number = 432) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.25, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
      chimeGain.connect(this.ctx.destination);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle harmonic overtone
      const overtone = this.ctx.createOscillator();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2.76, now);
      const overtoneGain = this.ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.08, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
      overtone.connect(overtoneGain);
      overtoneGain.connect(this.ctx.destination);

      osc.connect(chimeGain);
      osc.start(now);
      overtone.start(now);
      osc.stop(now + 4.6);
      overtone.stop(now + 3.1);
    } catch (e) {
      console.warn('Chime audio error:', e);
    }
  }

  public stop() {
    if (this.ctx && this.gainNode && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        if (this.primaryOsc) {
          try {
            this.primaryOsc.stop();
            this.primaryOsc.disconnect();
          } catch {}
          this.primaryOsc = null;
        }
        if (this.binauralOsc) {
          try {
            this.binauralOsc.stop();
            this.binauralOsc.disconnect();
          } catch {}
          this.binauralOsc = null;
        }
        this.isPlaying = false;
      }, 850);
    } else {
      this.isPlaying = false;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentFrequency(): number {
    return this.currentFrequency;
  }
}

export const soundEngine = new SoundEngine();
