class VoiceAlertService {
  private lastAlertTime: Record<string, number> = {};
  private cooldownMs: number;

  constructor(cooldownMs = 6000) {
    this.cooldownMs = cooldownMs;
  }

  speakViolation(message: string, type: string) {
    if (!window.speechSynthesis) return;

    const now = Date.now();
    const lastTime = this.lastAlertTime[type] || 0;

    if (now - lastTime < this.cooldownMs) {
      return; // Still in cooldown
    }

    // Cancel any currently speaking messages so this one plays immediately
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onerror = () => {}; // Silence browser console errors for interrupted speech

    window.speechSynthesis.speak(utterance);
    this.lastAlertTime[type] = now;
  }
  
  cancel() {
    if (window.speechSynthesis) {
       window.speechSynthesis.cancel();
    }
  }
}

export const voiceAlertService = new VoiceAlertService();
