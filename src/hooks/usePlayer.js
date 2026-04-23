import { useState, useRef, useEffect } from 'react';

const globalAudio = new Audio();

export const usePlayer = (song, onNext, onPrev) => {
  const audioRef = useRef(globalAudio);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const audio = audioRef.current;
    if (song?.url) {
      audio.src = song.url;
      if (isPlaying) audio.play();

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.title || 'Unknown Title',
          artist: song.artist || 'Unknown Artist',
          album: song.album || 'Unknown Album',
          artwork: song.albumArt ? [{ src: song.albumArt, sizes: '512x512', type: 'image/png' }] : []
        });

        navigator.mediaSession.setActionHandler('play', () => { audio.play(); setIsPlaying(true); });
        navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); setIsPlaying(false); });
        if (onNext) navigator.mediaSession.setActionHandler('nexttrack', onNext);
        if (onPrev) navigator.mediaSession.setActionHandler('previoustrack', onPrev);
      }
    }

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setProgress(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    if (onNext) audio.addEventListener('ended', onNext);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      if (onNext) audio.removeEventListener('ended', onNext);
    };
  }, [song]);

  // Sync volume state with the actual audio element
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
  };

  return { isPlaying, progress, duration, volume, setVolume, togglePlay, seek };
};