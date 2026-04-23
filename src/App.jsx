import Sidebar from './components/Sidebar';
import Playlist from './components/Playlist';
import PlayerControls from './components/PlayerControls';
import Header from './components/Header';
import FullPlayer from './components/FullPlayer';
import { PlayerProvider, useMusic } from './context/PlayerContext';
import { useEffect } from 'react';

const AppContent = () => {
  const { currentSong, isFullPlayerOpen, setIsFullPlayerOpen, handleNext, handlePrev } = useMusic();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'MediaTrackNext') handleNext();
      else if (e.key === 'ArrowLeft' || e.key === 'MediaTrackPrevious') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-neutral-900 via-[#050505] to-black relative">
        <Header />
        
        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 pb-32 relative z-0">
           <Playlist />
        </div>
      </main>

      {/* Floating Bottom Player Bar */}
      <div className="fixed bottom-4 left-72 right-4 w-[calc(100%-19rem)] xl:left-1/2 xl:-translate-x-1/2 xl:w-full xl:max-w-6xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl h-[90px] px-6 z-50 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] transition-all">
        <PlayerControls />
      </div>

      {/* GLOBAL FULL PLAYER: Placed at the root level to escape all constraints */}
      <FullPlayer 
        song={currentSong} 
        isOpen={isFullPlayerOpen} 
        onClose={() => setIsFullPlayerOpen(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}

export default App;