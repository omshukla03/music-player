import { createContext, useState, useContext, useMemo, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [allSongs, setAllSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playingSongUrl, setPlayingSongUrl] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  // NEW: Global state to control FullPlayer visibility [cite: 30]
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

  // Filter songs based on search input while preserving the master list [cite: 30]
  const filteredSongs = useMemo(() => {
    return allSongs.filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allSongs, searchTerm]);

  // Sync the current index when the filtered list changes so music doesn't stop [cite: 37, 38]
  useEffect(() => {
    if (playingSongUrl) {
      const newIndex = filteredSongs.findIndex(s => s.url === playingSongUrl);
      setCurrentIndex(newIndex);
    }
  }, [filteredSongs, playingSongUrl]);

  // Always derive the current song from the master list to ensure metadata is available 
  const currentSong = allSongs.find(s => s.url === playingSongUrl) || null;

  const playSong = (index) => {
    const song = filteredSongs[index];
    if (song) {
      setPlayingSongUrl(song.url);
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (filteredSongs.length === 0) return;
    
    if (isRepeat) {
      // Re-trigger the same song URL
      const currentUrl = playingSongUrl;
      setPlayingSongUrl(null);
      setTimeout(() => setPlayingSongUrl(currentUrl), 10);
      return;
    }

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * filteredSongs.length);
    } else {
      nextIndex = (currentIndex + 1) % filteredSongs.length;
    }
    playSong(nextIndex);
  };

  const handlePrev = () => {
    if (filteredSongs.length === 0) return;
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    playSong(prevIndex);
  };

  const updateSongs = (newSongs) => {
    setAllSongs(newSongs);
    setSearchTerm("");
    setPlayingSongUrl(null);
    setCurrentIndex(-1);
    setIsFullPlayerOpen(false);
  };

  return (
    <PlayerContext.Provider value={{ 
      songs: filteredSongs, 
      setSongs: updateSongs, 
      currentIndex, 
      setCurrentIndex: playSong, 
      currentSong, 
      handleNext, 
      handlePrev, 
      searchTerm, 
      setSearchTerm, 
      isShuffle, 
      setIsShuffle, 
      isRepeat, 
      setIsRepeat,
      isFullPlayerOpen, 
      setIsFullPlayerOpen 
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const useMusic = () => useContext(PlayerContext);