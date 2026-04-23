import { useMusic } from '../context/PlayerContext';
import { usePlayer } from '../hooks/usePlayer';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Music, Maximize2, Shuffle, Repeat 
} from 'lucide-react';

const PlayerControls = () => {
  const { 
    currentSong, handleNext, handlePrev, 
    isShuffle, setIsShuffle, isRepeat, setIsRepeat,
    setIsFullPlayerOpen 
  } = useMusic();
  
  const { isPlaying, progress, duration, volume, setVolume, togglePlay, seek } = usePlayer(currentSong?.url, handleNext);

  if (!currentSong) return (
    <div className="h-full flex items-center justify-center text-[11px] uppercase tracking-[0.3em] text-neutral-500 font-bold">
      Select a track to start playback
    </div>
  );

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] h-full items-center">
      {/* Song Info */}
      <div className="flex items-center gap-4 group cursor-pointer w-max" onClick={() => setIsFullPlayerOpen(true)}>
        <div className="relative w-14 h-14 bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-white/5 transition-transform duration-300 group-hover:scale-105">
          {currentSong.albumArt ? (
            <img src={currentSong.albumArt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-gradient-to-br from-neutral-800 to-neutral-900">
              <Music size={24} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
            <Maximize2 size={20} className="text-white drop-shadow-md" />
          </div>
        </div>
        <div className="overflow-hidden max-w-[180px] xl:max-w-[240px]">
          <p className="font-bold truncate text-[15px] text-white tracking-tight group-hover:text-cyan-400 transition-colors">{currentSong.title}</p>
          <p className="text-[12px] text-neutral-400 truncate mt-0.5 font-medium">{currentSong.artist}</p>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center gap-1.5 w-full max-w-lg mx-auto">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsShuffle(!isShuffle)} 
            className={`transition-all hover:scale-110 ${isShuffle ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-neutral-500 hover:text-white'}`}
          >
            <Shuffle size={18} />
          </button>
          
          <button onClick={handlePrev} className="text-neutral-400 hover:text-white transition-all hover:scale-110 active:scale-95">
            <SkipBack size={22} fill="currentColor" />
          </button>
          
          <button onClick={togglePlay} className="bg-white text-black rounded-full p-3 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95 group">
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1 group-hover:drop-shadow-md" />}
          </button>
          
          <button onClick={handleNext} className="text-neutral-400 hover:text-white transition-all hover:scale-110 active:scale-95">
            <SkipForward size={22} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setIsRepeat(!isRepeat)} 
            className={`transition-all hover:scale-110 ${isRepeat ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-neutral-500 hover:text-white'}`}
          >
            <Repeat size={18} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3 text-[11px] font-mono text-neutral-500 group mt-1">
           <span className="w-10 text-right">{Math.floor(progress / 60)}:{(Math.floor(progress % 60)).toString().padStart(2, '0')}</span>
           
           <div className="relative w-full h-1.5 group-hover:h-2 transition-all bg-neutral-800 rounded-full cursor-pointer flex items-center">
             <div 
               className="absolute left-0 h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full relative" 
               style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
             >
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 translate-x-1/2"></div>
             </div>
             <input 
               type="range" min="0" max={duration || 0} value={progress} 
               onChange={(e) => seek(e.target.value)} 
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
             />
           </div>

           <span className="w-10 text-left">{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-3 group">
          <Volume2 size={18} className="text-neutral-500 group-hover:text-cyan-400 transition-colors" />
          <div className="relative w-24 h-1.5 group-hover:h-2 transition-all bg-neutral-800 rounded-full cursor-pointer flex items-center">
            <div className="absolute left-0 h-full bg-cyan-400 rounded-full relative" style={{ width: `${volume * 100}%` }}>
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 translate-x-1/2"></div>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;