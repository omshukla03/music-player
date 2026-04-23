import { Search, Bell, User } from 'lucide-react';
import { useMusic } from '../context/PlayerContext';

const Header = () => {
  const { searchTerm, setSearchTerm } = useMusic();

  return (
    <header className="sticky top-0 z-40 px-6 lg:px-10 py-6 flex items-center justify-between bg-[#0a0a0a]/60 backdrop-blur-2xl border-b border-white/5 shadow-sm">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">
        Library
      </h1>
      
      <div className="flex items-center gap-6">
        <div className="relative group w-64 lg:w-80 xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors duration-300" size={18} />
          <input 
            type="text"
            placeholder="Search tracks, artists, or albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900/50 border border-white/10 rounded-full py-2 pl-11 pr-5 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-800 transition-all duration-300 placeholder:text-neutral-600 text-white shadow-inner"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-neutral-400 hover:text-white border border-white/5 relative group hidden sm:block">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#0a0a0a]"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] cursor-pointer shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;