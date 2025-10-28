import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return (
    <div className="h-screen overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-black dark:to-zinc-950 dark:text-white">
      <Navbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute left-0 top-[60px] h-[calc(100vh-60px)] w-72 bg-white dark:bg-zinc-900 z-50 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <Sidebar isMobile onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="flex h-[calc(100vh-60px)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


