import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState([]);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    synthRef.current = window.speechSynthesis;

    const updateVoices = () => {
      setVoices(synthRef.current.getVoices());
    };

    updateVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = updateVoices;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text, preferredLanguage = 'en-US') => {
    if (!isSupported || !synthRef.current) return;

    // Stop any ongoing speech
    synthRef.current.cancel();
    setIsSpeaking(false);

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice
    if (voices.length > 0) {
      let voice = voices.find(v => v.lang === preferredLanguage) || 
                  voices.find(v => v.lang.startsWith('en-IN')) || 
                  voices.find(v => v.lang.startsWith('en-US')) ||
                  voices.find(v => v.lang.startsWith('en')) ||
                  voices[0];
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.rate = 0.95; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error', e);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, [isSupported, voices]);

  const stop = useCallback(() => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop
  };
};
