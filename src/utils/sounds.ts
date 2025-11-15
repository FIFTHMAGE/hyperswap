export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('sounds-enabled') !== 'false';
    }
  }

  loadSound(name: string, url: string) {
    if (typeof window === 'undefined') return;
    
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
  }

  play(name: string, volume: number = 0.5) {
    if (!this.enabled || typeof window === 'undefined') return;
    
    const sound = this.sounds.get(name);
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sounds-enabled', this.enabled.toString());
    }
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();

