
import React, { useState, useEffect } from 'react';
import { MatchHistory } from '../types';
import { STORAGE_KEYS } from '../constants';
import { Link } from 'react-router-dom';

const GameHistory: React.FC = () => {
  const [history, setHistory] = useState<MatchHistory[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    if (data) {
      setHistory(JSON.parse(data));
    }
  }, []);

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-5 mb-10 px-2">
        <Link to="/" className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-white shadow-md border border-slate-100 dark:border-slate-800 active:scale-90 transition-all">
          <i className="fa-solid fa-arrow-left text-lg"></i>
        </Link>
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Battle History</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Your past arena performances</p>
        </div>
      </div>

      <div className="space-y-6">
        {history.length > 0 ? (
          history.map(match => (
            <div key={match.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-md border border-slate-100 dark:border-slate-800 flex items-center gap-5 relative overflow-hidden transition-all">
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[70px] opacity-20 -mr-16 -mt-16 rounded-full ${match.status === 'win' ? 'bg-green-500' : 'bg-rose-500'}`}></div>

              <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-2xl shadow-inner border shrink-0 ${
                match.status === 'win' 
                ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:border-green-900/30 dark:text-green-400' 
                : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30 dark:text-rose-400'
              }`}>
                <i className={`fa-solid ${match.status === 'win' ? 'fa-crown' : 'fa-skull-crossbones'}`}></i>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm truncate max-w-[160px] tracking-wide">{match.title}</h3>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm ${
                    match.status === 'win' ? 'bg-green-100 text-green-700 dark:bg-green-400 dark:text-green-950' : 'bg-rose-100 text-rose-700 dark:bg-rose-400 dark:text-rose-950'
                  }`}>
                    {match.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{match.date}</p>
                  <span className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{match.type}</p>
                </div>
              </div>

              <div className="text-right pl-4 border-l border-slate-100 dark:border-slate-800 min-w-[80px]">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase leading-none mb-1.5 tracking-widest">Earnings</p>
                <p className={`font-black text-lg ${match.status === 'win' ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-600'}`}>
                  {match.status === 'win' ? `+৳${match.prizeWon}` : '৳0'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
             <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="fa-solid fa-ghost text-slate-200 dark:text-slate-700 text-5xl"></i>
             </div>
             <p className="text-slate-400 font-black uppercase text-sm tracking-widest">No Battle Records Found</p>
          </div>
        )}
      </div>

      <div className="mt-12 bg-slate-900 dark:bg-slate-900 rounded-[2.5rem] p-10 text-white border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-2 gap-8 relative z-10">
           <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Total Matches</p>
              <p className="text-4xl font-black">{history.length}</p>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Win Rate</p>
              <p className="text-4xl font-black text-amber-400">
                {history.length > 0 ? Math.round((history.filter(h => h.status === 'win').length / history.length) * 100) : 0}%
              </p>
           </div>
        </div>
        <div className="absolute right-[-10%] bottom-[-20%] opacity-10 rotate-12">
           <i className="fa-solid fa-trophy text-[12rem]"></i>
        </div>
      </div>
    </div>
  );
};

export default GameHistory;
