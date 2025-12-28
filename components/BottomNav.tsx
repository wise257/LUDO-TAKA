
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BottomNavProps {
  role: 'user' | 'admin';
}

const BottomNav: React.FC<BottomNavProps> = ({ role }) => {
  const location = useLocation();
  const path = location.pathname;

  const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => {
    const isActive = path === to;
    return (
      <Link 
        to={to} 
        className={`flex flex-col items-center justify-center w-full transition-all gap-1.5 ${isActive ? 'text-rose-600 dark:text-amber-400 scale-110' : 'text-gray-400 dark:text-slate-500'}`}
      >
        <i className={`${icon} text-2xl`}></i>
        <span className="text-[11px] font-black uppercase tracking-[0.15em]">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 h-24 py-3 flex justify-around items-center px-6 z-50 transition-colors shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
      <NavItem to="/" icon="fa-solid fa-home" label="Home" />
      <NavItem to="/my-tournaments" icon="fa-solid fa-gamepad" label="Matches" />
      <NavItem to="/wallet" icon="fa-solid fa-wallet" label="Wallet" />
      <NavItem to="/profile" icon="fa-solid fa-user" label="Profile" />
      {role === 'admin' && (
        <NavItem to="/admin" icon="fa-solid fa-shield-halved" label="Admin" />
      )}
    </nav>
  );
};

export default BottomNav;
