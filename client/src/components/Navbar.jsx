import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';

export default function Navbar({ onMenuClick }) {
  const { theme, toggle } = useTheme();
  const { user } = useAuth?.() || { user: null };
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  
  return (
    <div className="sticky top-0 z-50 w-full px-4 md:px-6 py-3 backdrop-blur border-b border-zinc-200 dark:border-white/10 flex items-center justify-between bg-white/70 dark:bg-white/5">
      <div className="flex items-center gap-2">
        <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg">
          <Menu size={24} />
        </button>
        <div className="font-extrabold text-base md:text-lg tracking-tight flex items-center gap-2">
          ExpenseTracker 💰
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-full border border-zinc-300 dark:border-white/10 bg-white/80 dark:bg-transparent">
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm" title="Profile">
          {initials}
        </div>
      </div>
    </div>
  );
}


