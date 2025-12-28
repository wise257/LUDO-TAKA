
import React from 'react';
import { User } from '../types';
import Logo from './Logo';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-[#0f172a] text-white px-5 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-slate-800 shadow-xl">
      <div className="flex items-center gap-3">
        <Logo size="sm" />
        <h1 className="font-black text-xl tracking-tight uppercase italic flex items-center gap-1.5">
          <span className="text-white">LUDO</span>
          <span className="text-amber-400">TAKA</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Link to="/notifications" className="w-10 h-10 flex items-center justify-center relative bg-slate-800/50 rounded-xl border border-slate-700/50 active:scale-90 transition-all">
          <i className="fa-solid fa-bell text-amber-400 text-lg"></i>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-slate-900"></span>
        </Link>
        
        {/* Wallet Balance Pill */}
        <Link to="/wallet" className="flex items-center gap-3 bg-[#1e293b] px-4 py-2.5 rounded-xl border border-slate-700/50 active:scale-95 transition-all">
          <i className="fa-solid fa-wallet text-amber-400 text-sm"></i>
          <span className="font-black text-sm tabular-nums tracking-wide uppercase">৳{user.wallet}</span>
        </Link>
        
        {/* Avatar */}
        <Link to="/profile" className="w-10 h-10 rounded-xl bg-slate-700 border border-slate-600 overflow-hidden active:scale-95 transition-all shadow-md">
          <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
