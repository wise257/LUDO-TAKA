
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '1,245', icon: 'fa-users', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Active Games', value: '12', icon: 'fa-gamepad', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Total Revenue', value: '৳142k', icon: 'fa-chart-line', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Withdrawals', value: '08', icon: 'fa-money-bill-transfer', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  ];

  const menu = [
    { label: 'Manage Tournaments', icon: 'fa-trophy', path: '/admin/tournaments', sub: 'Control Matches & Codes' },
    { label: 'Manage Users', icon: 'fa-users-gear', path: '/admin/users', sub: 'Wallet & Access Control' },
    { label: 'System Settings', icon: 'fa-gears', path: '/admin/settings', sub: 'Notice & Maintenance' },
  ];

  return (
    <div className="p-6 pb-24 bg-[#050b1a] min-h-screen animate-in fade-in duration-500">
      {/* Admin Header */}
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[1.5rem] bg-[#0f172a] text-amber-400 flex items-center justify-center shadow-2xl border border-amber-500/20 ring-1 ring-slate-800">
            <i className="fa-solid fa-shield-halved text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase leading-none tracking-tight italic">Admin Hub</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Arena Console V2</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[9px] text-green-500 font-black tracking-widest uppercase">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-5 mb-12">
        {stats.map(s => (
          <div key={s.label} className={`p-6 rounded-[2.5rem] border ${s.bg} backdrop-blur-md relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <i className={`fa-solid ${s.icon} text-5xl`}></i>
            </div>
            <p className="text-2xl font-black text-white leading-none mb-2">{s.value}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Control Navigation */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] mb-4 ml-4">Management Console</h3>
        <div className="space-y-5">
          {menu.map(item => (
            <Link 
              key={item.label}
              to={item.path} 
              className="w-full h-24 bg-[#111827] rounded-[3rem] px-8 flex items-center justify-between border border-slate-800/50 shadow-xl active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.8rem] bg-[#1e293b] flex items-center justify-center text-slate-400 text-2xl group-hover:text-amber-400 transition-colors border border-slate-700/30">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <div>
                  <span className="font-black text-sm text-white uppercase tracking-[0.2em] block">{item.label}</span>
                  <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.1em] mt-1">{item.sub}</span>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-700 text-xs"></i>
            </Link>
          ))}
          
          <Link 
            to="/"
            className="w-full h-24 bg-white/5 rounded-[3rem] px-8 flex items-center justify-center border border-white/5 active:scale-[0.98] transition-all"
          >
             <span className="font-black text-[11px] text-slate-500 uppercase tracking-[0.4em]">Exit to Player Mode</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
