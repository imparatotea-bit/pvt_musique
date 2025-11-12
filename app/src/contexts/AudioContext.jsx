import { createContext, useContext, useState, useRef, useCallback } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  // Version check - IMPORTANT: Si vous voyez "VERSION: v2.0" dans la console, c'est bon
  console.log('🔧 AudioContext VERSION: v2.0 - Async Loading');

  const loadTrack = useCallback((src) => {
    return new Promise((resolve, reject) => {
      console.log('🎵 [v2.0] Début chargement audio:', src);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0.5;
      audio.preload = 'auto';

      // Attendre que l'audio soit prêt
      audio.addEventListener('canplaythrough', () => {
        console.log('✅ [v2.0] Audio chargé et prêt:', src);
        resolve();
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.error('❌ [v2.0] Erreur chargement audio:', e);
        reject(e);
      });

      audioRef.current = audio;
      setCurrentTrack(src);
      setIsPlaying(false);

      // Forcer le chargement
      audio.load();
    });
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && audioRef.current.readyState >= 2) {
      // readyState >= 2 signifie que l'audio a suffisamment de données
      audioRef.current.play().catch(err => {
        console.error('❌ Erreur lecture audio:', err.name, err.message);
      });
      setIsPlaying(true);
    } else if (audioRef.current) {
      // Si l'audio n'est pas encore prêt, attendre
      console.warn('⏳ Audio pas encore prêt, attente chargement...');
      const tryPlay = () => {
        if (audioRef.current) {
          audioRef.current.play().catch(err => {
            console.error('❌ Erreur lecture audio (après attente):', err.name, err.message);
          });
          setIsPlaying(true);
        }
      };
      audioRef.current.addEventListener('canplaythrough', tryPlay, { once: true });
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const setVolume = useCallback((volume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const value = {
    isPlaying,
    currentTrack,
    loadTrack,
    play,
    pause,
    stop,
    setVolume,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
