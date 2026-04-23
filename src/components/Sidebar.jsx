import { useMusic } from '../context/PlayerContext';
import { Home, Search, Library, PlusCircle, Heart, Disc, Radio, LayoutGrid } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const { setSongs, setCurrentIndex } = useMusic();

  const handleFolderSelect = async () => {
    const files = await window.electronAPI.selectFolder();
    if (files.length > 0) {
      setSongs(files);
      setCurrentIndex(0);
    }
  };

  const SidebarButton = ({ icon: Icon, label, active = false, onClick = null }) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden
      ${active ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white font-medium'}`}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent border-l-[3px] border-cyan-500 dark:border-cyan-400"></div>
      )}
      {!active && (
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      <Icon size={18} className={`relative z-10 ${active ? 'text-cyan-500 dark:text-cyan-400' : 'text-neutral-400 group-hover:text-cyan-500 dark:text-neutral-500 dark:group-hover:text-cyan-300'} transition-colors duration-300`} />
      <span className="relative z-10 text-[13px] tracking-wide">{label}</span>
    </div>
  );

  return (
    <aside className="w-[280px] bg-neutral-50 dark:bg-[#020202] flex flex-col p-6 border-r border-black/5 dark:border-white/5 select-none z-10 relative shadow-[10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-colors duration-500">
      <div className="flex items-center gap-4 mb-10 pl-2 cursor-pointer group">
        <div className="relative p-1 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-black border border-black/10 dark:border-white/10 shadow-lg group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] dark:group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-500 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full"></div>
          <img src={logo} className="w-10 h-10 object-cover rounded-full relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" alt="Logo" />
        </div>
        <h1 className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-white dark:to-neutral-400">
          BeatSync
        </h1>
      </div>
      
      <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        <div>
          <div className="px-4 mb-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Discover</div>
          <div className="space-y-1">
            <SidebarButton icon={Home} label="Home" active />
            <SidebarButton icon={LayoutGrid} label="Browse" />
          </div>
        </div>

        <div>
          <div className="px-4 mb-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Library</div>
          <div className="space-y-1">
            <SidebarButton icon={PlusCircle} label="Import Folder" onClick={handleFolderSelect} />
            <SidebarButton icon={Library} label="All Tracks" />
            <SidebarButton icon={Heart} label="Favorites" />
            <SidebarButton icon={Disc} label="Albums" />
          </div>
        </div>
      </nav>

    </aside>
  );
};

export default Sidebar;