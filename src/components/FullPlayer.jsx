import ReactDOM from 'react-dom';
import { useMusic } from '../context/PlayerContext';
import { usePlayer } from '../hooks/usePlayer';
import { 
  ChevronDown, Heart, Share2, MoreHorizontal, Disc, 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 
} from 'lucide-react';

const FullPlayer = ({ song, isOpen, onClose }) => {
  const { handleNext, handlePrev, isShuffle, setIsShuffle, isRepeat, setIsRepeat } = useMusic();
  const { isPlaying, progress, duration, volume, setVolume, togglePlay, seek } = usePlayer(song, handleNext, handlePrev);

  if (!isOpen || !song) return null;

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return ReactDOM.createPortal(
    <div className={`fixed inset-0 z-[9999] bg-neutral-50 dark:bg-[#020202] text-neutral-900 dark:text-white flex flex-col items-center p-6 lg:p-10 transition-colors duration-700 overflow-hidden animate-in slide-in-from-bottom`}>
      
      {/* Dynamic Background Blur */}
      <div className="absolute inset-0 opacity-10 dark:opacity-30 blur-[120px] pointer-events-none scale-150 transition-all duration-1000">
        {song.albumArt ? <img src={song.albumArt} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-cyan-200 dark:bg-cyan-900" />}
      </div>
      
      {/* Premium Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] pointer-events-none z-0 opacity-5 dark:opacity-[0.03] select-none w-full flex justify-center mix-blend-overlay">
        <h1 className="text-[20vw] lg:text-[24vw] font-black tracking-tighter text-black dark:text-white whitespace-nowrap">BEATSYNC</h1>
      </div>
      
      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center z-10 pt-4">
        <button onClick={onClose} className="p-4 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 transition-all text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white shadow-lg border border-black/5 dark:border-white/5 group">
          <ChevronDown size={28} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 dark:bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600 dark:bg-cyan-500"></span>
            </span>
            <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400 font-bold">Now Playing from Playlist</p>
          </div>
          <p className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-widest">{song.album || 'Unknown Album'}</p>
        </div>
        <button className="p-4 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 transition-all text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white shadow-lg border border-black/5 dark:border-white/5">
          <MoreHorizontal size={28} />
        </button>
      </header>
      
      {/* Central Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center z-10 w-full max-w-6xl gap-12 lg:gap-24 py-8">
        <div className={`w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 transition-all duration-700 transform ${isPlaying ? 'animate-beat' : 'scale-[0.98] shadow-[0_20px_80px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.8)]'}`}>
          {song.albumArt ? <img src={song.albumArt} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900"><Disc size={150} className="text-neutral-400 dark:text-neutral-700 animate-[spin_10s_linear_infinite]" /></div>}
        </div>

        <div className="text-center lg:text-left flex flex-col items-center lg:items-start max-w-xl w-full h-full justify-center">
          <div className="w-full h-[120px] sm:h-[150px] lg:h-[170px] flex flex-col justify-end items-center lg:items-start pb-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 dark:text-white mb-3 line-clamp-2 leading-[1.1] drop-shadow-lg">{song.title}</h1>
            <p className="text-xl sm:text-2xl text-cyan-600 dark:text-cyan-400 font-semibold tracking-wide drop-shadow-md">{song.artist}</p>
          </div>
          
          <div className="w-full mt-6 sm:mt-10 space-y-8">
            <div className="space-y-3 group">
              <div className="relative w-full h-2 group-hover:h-2.5 transition-all bg-black/10 dark:bg-white/10 rounded-full cursor-pointer flex items-center shadow-inner">
                <div 
                  className="absolute left-0 h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full relative" 
                  style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-black dark:bg-white rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100 translate-x-1/2"></div>
                </div>
                <input 
                  type="range" min="0" max={duration || 0} value={progress} 
                  onChange={(e) => seek(e.target.value)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </div>
              <div className="flex justify-between text-sm font-mono text-neutral-500 dark:text-neutral-400 tracking-tighter font-medium">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <button onClick={() => setIsShuffle(!isShuffle)} className={`p-3 rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/5 ${isShuffle ? 'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}>
                <Shuffle size={24} />
              </button>
              
              <div className="flex items-center gap-6 sm:gap-10">
                <button onClick={handlePrev} className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-all hover:scale-110 active:scale-95 p-2"><SkipBack size={36} fill="currentColor" /></button>
                <button onClick={togglePlay} className="bg-black text-white dark:bg-white dark:text-black rounded-full p-5 sm:p-6 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all active:scale-95 group">
                  {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1 sm:ml-2 group-hover:drop-shadow-md" />}
                </button>
                <button onClick={handleNext} className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-all hover:scale-110 active:scale-95 p-2"><SkipForward size={36} fill="currentColor" /></button>
              </div>

              <button onClick={() => setIsRepeat(!isRepeat)} className={`p-3 rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/5 ${isRepeat ? 'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}>
                <Repeat size={24} />
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-6 px-2">
              <button className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                <Share2 size={24} />
              </button>
              <div className="flex items-center gap-4 w-48 sm:w-64 group bg-black/5 dark:bg-white/5 px-4 py-2 rounded-full backdrop-blur-md border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <Volume2 size={20} className="text-neutral-500 group-hover:text-cyan-600 dark:text-neutral-400 dark:group-hover:text-cyan-400 transition-colors" />
                <div className="relative flex-1 h-1.5 group-hover:h-2 transition-all bg-neutral-200 dark:bg-neutral-800 rounded-full cursor-pointer flex items-center">
                  <div className="absolute left-0 h-full bg-cyan-500 dark:bg-cyan-400 rounded-full relative" style={{ width: `${volume * 100}%` }}>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-black dark:bg-white rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 translate-x-1/2"></div>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01" value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <button className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-neutral-500 hover:text-pink-500 group">
                <Heart size={24} className="group-hover:fill-pink-500 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FullPlayer;