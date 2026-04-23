import { useMusic } from '../context/PlayerContext';
import { Play, Music, Clock } from 'lucide-react';

const Playlist = () => {
  const { songs, currentIndex, setCurrentIndex } = useMusic();

  const letterIndices = {};
  songs.forEach((song, index) => {
    const letter = song.title.charAt(0).toUpperCase();
    if (/[A-Z]/.test(letter) && letterIndices[letter] === undefined) {
      letterIndices[letter] = index;
    }
  });

  const scrollToLetter = (letter) => {
    const index = letterIndices[letter];
    if (index !== undefined) {
      const element = document.getElementById(`song-row-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (songs.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-neutral-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full scale-150"></div>
          <div className="w-24 h-24 bg-neutral-900/50 rounded-full flex items-center justify-center border border-white/5 relative z-10 shadow-2xl">
            <Music size={40} strokeWidth={1.5} className="text-neutral-400 drop-shadow-lg" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-3 tracking-tight">Your Library is Empty</h2>
        <p className="text-[15px] text-neutral-400 max-w-md text-center leading-relaxed">
          Import a folder from the sidebar to start listening to your high-fidelity music collection.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pt-2">
      <div className="fixed right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-[2px] z-50 bg-black/5 dark:bg-black/40 backdrop-blur-md py-3 px-1.5 rounded-full border border-black/10 dark:border-white/10 shadow-xl hidden md:flex">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
          const hasLetter = letterIndices[letter] !== undefined;
          return (
            <button
              key={letter}
              onClick={() => hasLetter && scrollToLetter(letter)}
              className={`text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full transition-all ${
                hasLetter 
                  ? 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-cyan-500/50 cursor-pointer hover:scale-125' 
                  : 'text-neutral-300 dark:text-neutral-700/50 cursor-default'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 border-b border-black/5 dark:border-white/5 text-[11px] font-bold text-neutral-500 uppercase tracking-widest sticky top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl z-40">
        <div className="w-10 text-center">#</div>
        <div>Title</div>
        <div className="hidden md:block w-48 lg:w-64">Album</div>
        <div className="w-16 flex justify-end"><Clock size={14} /></div>
      </div>
      
      <div className="flex flex-col mt-2 space-y-1">
        {songs.map((song, index) => {
          const isActive = index === currentIndex;

          return (
            <div 
              key={index}
              id={`song-row-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`group grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-3 cursor-pointer transition-all duration-300 rounded-xl items-center
                ${isActive ? 'bg-black/5 dark:bg-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <div className="w-10 flex items-center justify-center">
                {isActive ? (
                  <div className="flex items-end gap-[3px] h-4">
                    <div className="w-1 bg-cyan-400 h-2 animate-[bounce_1s_infinite_ease-in-out]"></div>
                    <div className="w-1 bg-cyan-400 h-4 animate-[bounce_1s_infinite_0.2s_ease-in-out]"></div>
                    <div className="w-1 bg-cyan-400 h-3 animate-[bounce_1s_infinite_0.4s_ease-in-out]"></div>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-neutral-500 group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play size={16} className="hidden group-hover:block text-black dark:text-white" fill="currentColor" />
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-4 overflow-hidden pr-4">
                <div className={`w-11 h-11 rounded-md shadow-md overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-105 shadow-cyan-500/20' : 'group-hover:scale-105'}`}>
                  {song.albumArt ? (
                    <img src={song.albumArt} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-600 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900">
                      <Music size={18} />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className={`font-bold truncate text-[15px] tracking-tight transition-colors ${isActive ? 'text-cyan-500 dark:text-cyan-400' : 'text-neutral-900 group-hover:text-black dark:text-neutral-100 dark:group-hover:text-white'}`}>
                    {song.title}
                  </p>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5 font-medium">{song.artist}</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center w-48 lg:w-64 text-[13px] text-neutral-500 dark:text-neutral-400 truncate pr-4">
                <span className="truncate hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">{song.album}</span>
              </div>
              
              <div className="w-16 flex items-center justify-end text-[13px] text-neutral-500 dark:text-neutral-400 font-mono tracking-tighter">
                {Math.floor(song.duration / 60)}:{(Math.floor(song.duration % 60)).toString().padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Playlist;