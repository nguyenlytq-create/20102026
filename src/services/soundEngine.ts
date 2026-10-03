// Web Audio API Synthesizer for high-quality game sound effects

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;
  private activeNodes: AudioNode[] = [];

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public stopAll() {
    if (this.activeNodes.length > 0) {
      this.activeNodes.forEach(node => {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {}
      });
      this.activeNodes = [];
    }
  }

  public playTone(
    freq: number,
    duration = 0.15,
    type: OscillatorType = 'sine',
    startTime = 0,
    gainLevel = 0.12
  ) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime + startTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(gainLevel, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);

      this.activeNodes.push(osc);
      osc.onended = () => {
        const idx = this.activeNodes.indexOf(osc);
        if (idx !== -1) this.activeNodes.splice(idx, 1);
      };
    } catch {}
  }

  public playCorrect() {
    if (!this.enabled) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.25, 'triangle', idx * 0.06, 0.14);
    });
  }

  public playWrong() {
    if (!this.enabled) return;
    this.init();
    this.playTone(220, 0.15, 'sawtooth', 0, 0.1);
    this.playTone(180, 0.22, 'sawtooth', 0.1, 0.1);
  }

  public playChestOpen() {
    if (!this.enabled) return;
    this.init();
    this.playTone(392, 0.12, 'sine', 0, 0.1);
    this.playTone(587.33, 0.16, 'sine', 0.08, 0.1);
    this.playTone(783.99, 0.22, 'triangle', 0.15, 0.12);
  }

  public playKeyEarned() {
    if (!this.enabled) return;
    this.init();
    const fanfare = [523.25, 659.25, 783.99, 1046.5];
    fanfare.forEach((f, i) => {
      this.playTone(f, 0.32, 'triangle', i * 0.11, 0.16);
    });
  }

  public playCelebrationFanfare() {
    if (!this.enabled) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.5, 880, 1046.5, 1318.51];
    const times = [0, 0.12, 0.24, 0.38, 0.52, 0.68, 0.9];
    notes.forEach((f, i) => {
      this.playTone(f, 0.45, 'triangle', times[i], 0.2);
    });
  }

  public playClick() {
    if (!this.enabled) return;
    this.playTone(800, 0.04, 'sine', 0, 0.05);
  }

  public playSlotPlace() {
    if (!this.enabled) return;
    this.playTone(659.25, 0.12, 'triangle', 0, 0.2);
  }

  public playSlotClear() {
    if (!this.enabled) return;
    this.playTone(400, 0.1, 'sine', 0, 0.15);
  }
}

export const sound = new SoundEngine();
