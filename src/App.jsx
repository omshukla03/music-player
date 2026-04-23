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
    <div className="flex h-screen w-full bg-white dark:bg-black text-neutral-900 dark:text-white overflow-hidden font-sans selection:bg-cyan-500/30 transition-colors duration-500">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-neutral-100 via-neutral-50 to-white dark:from-neutral-900 dark:via-[#050505] dark:to-black relative transition-colors duration-500">
        <Header />
        
        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 pb-32 relative z-0">
           <Playlist />
        </div>
      </main>

      {/* Docked Bottom Player Bar */}
      <div className="fixed bottom-0 left-[280px] right-0 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border-t border-black/10 dark:border-white/10 h-[90px] px-8 z-50 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)] transition-colors duration-500">
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