
import React, { useState, useEffect } from 'react';
import { AppNotification } from '../types';
import { STORAGE_KEYS } from '../constants';
import { Link } from 'react-router-dom';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (data) {
      setNotifications(JSON.parse(data));
    }
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'match': return 'fa-trophy text-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
      case 'success': return 'fa-circle-check text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'warning': return 'fa-triangle-exclamation text-rose-500 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400';
      default: return 'fa-info-circle text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-5">
          <Link to="/" className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-white shadow-md border border-slate-100 dark:border-slate-800 active:scale-90 transition-all">
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </Link>
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Alerts</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Recent Activity & Updates</p>
          </div>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-full border border-blue-100 dark:border-blue-900/30 active:scale-95 transition-all shadow-sm"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div key={notif.id} className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 shadow-md border border-slate-100 dark:border-slate-800 flex gap-6 relative transition-all active:scale-[0.98] ${!notif.isRead ? 'border-l-4 border-l-amber-400' : ''}`}>
              <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-2xl shrink-0 ${getIcon(notif.type)} shadow-sm border border-white dark:border-slate-700`}>
                <i className={`fa-solid ${getIcon(notif.type).split(' ')[0]}`}></i>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-black uppercase text-sm tracking-wide ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{notif.title}</h3>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{notif.date}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.isRead && (
                <div className="absolute top-7 right-3 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-pulse"></div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
             <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <i className="fa-solid fa-bell-slash text-slate-200 dark:text-slate-700 text-5xl"></i>
             </div>
             <p className="text-slate-400 font-black uppercase text-sm tracking-widest">No New Notifications</p>
          </div>
        )}
      </div>

      <div className="mt-16 bg-slate-900 dark:bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl border border-amber-500/10">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center scale-150 rotate-12">
           <i className="fa-solid fa-shield-cat text-[12rem] text-white"></i>
        </div>
        <div className="relative z-10">
          <p className="text-amber-400 font-black text-xs uppercase tracking-[0.5em] mb-4">Taka Shield Security</p>
          <p className="text-white text-sm font-bold leading-relaxed max-w-[250px] mx-auto opacity-80">Your account is protected by industry standard encryption and real-time monitoring.</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
