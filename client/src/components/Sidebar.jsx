import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg hover:bg-white/10 transition ${isActive ? 'bg-white/10' : ''}`;

export default function Sidebar() {
  return (
    <div className="w-60 p-4 border-r border-white/10 min-h-svh bg-white/5 backdrop-blur">
      <div className="mb-4 text-xs uppercase tracking-wide opacity-70">Menu</div>
      <nav className="flex flex-col gap-2 text-sm">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
        <NavLink to="/budget" className={linkClass}>Budget</NavLink>
        <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </nav>
    </div>
  );
}


