import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wallet, PiggyBank, TrendingUp, User, Settings, LogOut } from 'lucide-react';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm
   hover:bg-zinc-100 dark:hover:bg-white/10
   ${isActive ? 'bg-zinc-100 text-zinc-900 shadow-sm dark:bg-white/10 dark:text-white font-medium' : 'opacity-70'}`;

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: Wallet },
  { to: '/budget', label: 'Budget', icon: PiggyBank },
  { to: '/analytics', label: 'Analytics', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isMobile = false, onClose }) {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  
  function handleLogout() {
    setToken(null);
    setUser(null);
    navigate('/login');
  }

  return (
    <div className={`${!isMobile ? 'w-60 hidden md:flex' : 'w-full'} p-4 ${isMobile ? 'border-r-0' : 'border-r'} border-zinc-200 bg-white text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white h-full backdrop-blur flex flex-col`}>
      <nav className="flex flex-col gap-1 text-sm mt-2 flex-1">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 mt-2"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}


