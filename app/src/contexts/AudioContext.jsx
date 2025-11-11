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

  const loadTrack = useCallback((src) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    setCurrentTrack(src);
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err);
      });
      setIsPlaying(true);
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
