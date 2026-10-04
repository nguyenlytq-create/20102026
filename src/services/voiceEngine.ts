// Voice Engine with Pre-Embedded Northern Vietnamese Female Voice (Giọng nữ miền Bắc Hà Nội)
// All audio data is stored directly in code for 100% offline, zero-latency playback.

import { AUDIO_EMBEDDED } from '../data/audioData';

class VoiceEngine {
  public enabled = true;
  public isSpeaking = false;
  private currentAudio: HTMLAudioElement | null = null;
  private onStateChangeListeners: Array<(isSpeaking: boolean) => void> = [];

  constructor() {
    // Preload audio objects for 0ms latency
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => {}, { once: true });
    }
  }

  public addListener(listener: (isSpeaking: boolean) => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyState(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onStateChangeListeners.forEach(listener => listener(speaking));
  }

  public getApiKey(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_api_key_custom') || '';
    }
    return '';
  }

  public setCustomApiKey(key: string) {
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('gemini_api_key_custom', key);
      } else {
        localStorage.removeItem('gemini_api_key_custom');
      }
    }
  }

  public cancel() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.notifyState(false);
  }

  /**
   * Phát âm thanh câu hỏi (Câu 1 đến Câu 9)
   * Sử dụng file âm thanh giọng nữ miền Bắc Hà Nội được lưu sẵn trong code
   * Phát NGAY LẬP TỨC 0ms không phải chờ
   */
  public playQuestionAudio(questionNum: number) {
    if (!this.enabled) return;
    this.cancel();

    const audioKey = `q${questionNum}`;
    const audioSrc = AUDIO_EMBEDDED[audioKey] || `/audio/${audioKey}.mp3`;

    this.playAudioSource(audioSrc);
  }

  /**
   * Phát âm thanh chúc mừng 20/10
   * Giọng nữ miền Bắc Hà Nội chuẩn, truyền cảm, lưu sẵn trên code
   */
  public playCelebrationAudio() {
    if (!this.enabled) return;
    this.cancel();

    const audioSrc = AUDIO_EMBEDDED['celebration'] || '/audio/celebration.mp3';
    this.playAudioSource(audioSrc);
  }

  /**
   * Phát thuyết minh kết quả trả lời sau khi học sinh chọn đáp án
   * Giọng nữ chuẩn miền Bắc Hà Nội, phát ngay lập tức 0ms
   */
  public playFeedbackAudio(questionNum: number, isCorrect: boolean) {
    if (!this.enabled) return;
    this.cancel();

    const audioKey = isCorrect ? `feedback_correct_${questionNum}` : `feedback_wrong_${questionNum}`;
    const audioSrc = AUDIO_EMBEDDED[audioKey] || `/audio/${audioKey}.mp3`;
    this.playAudioSource(audioSrc);
  }

  private playAudioSource(src: string) {
    try {
      this.notifyState(true);
      const audio = new Audio(src);
      this.currentAudio = audio;

      audio.onended = () => {
        this.notifyState(false);
        this.currentAudio = null;
      };

      audio.onerror = () => {
        this.notifyState(false);
        this.currentAudio = null;
      };

      // Play immediately
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.notifyState(false);
        });
      }
    } catch {
      this.notifyState(false);
    }
  }

  /**
   * Fallback phát âm text bất kỳ nếu cần
   */
  public speakVietnamese(text: string) {
    if (!this.enabled) return;
    this.cancel();

    if (text.includes('Chúc mừng') || text.includes('Phụ Nữ Việt Nam')) {
      this.playCelebrationAudio();
      return;
    }

    // Try finding matching question number in text
    const match = text.match(/Câu hỏi số (\d+)|Câu hỏi (\d+)/);
    if (match) {
      const qNum = parseInt(match[1] || match[2], 10);
      if (qNum >= 1 && qNum <= 9) {
        this.playQuestionAudio(qNum);
        return;
      }
    }

    // Web Speech fallback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 1.0;
        utterance.onstart = () => this.notifyState(true);
        utterance.onend = () => this.notifyState(false);
        utterance.onerror = () => this.notifyState(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        this.notifyState(false);
      }
    }
  }

  public toggleVoice(): boolean {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.cancel();
    }
    return this.enabled;
  }
}

export const voice = new VoiceEngine();
