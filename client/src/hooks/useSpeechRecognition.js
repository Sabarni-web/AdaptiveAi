import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

export const useSpeechRecognition = ({ language = 'en-US', onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  // Store the latest onResult in a ref so we don't recreate the recognition instance when onResult changes
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      // We will set the language when starting listening to make it dynamic

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (onResultRef.current) {
          onResultRef.current({
            transcript: finalTranscript,
            interimTranscript,
            isFinal: finalTranscript.length > 0
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access was denied. Please allow microphone access in your browser settings to use Voice Tutor.');
          toast.error('Microphone access was denied.');
        } else if (event.error !== 'no-speech') {
          setError(`Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } catch (e) {
      console.error("Failed to initialize speech recognition", e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []); // Run once to initialize

  const startListening = useCallback((lang = language) => {
    setError(null);
    if (!isSupported) {
      toast.error('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.lang = lang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start listening', err);
      }
    }
  }, [isListening, isSupported, language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Failed to stop listening', err);
      }
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening
  };
};
