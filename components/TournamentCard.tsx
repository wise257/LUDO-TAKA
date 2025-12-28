
import React, { useState } from 'react';
import { Tournament } from '../types';
import CountdownTimer from './CountdownTimer';

interface TournamentCardProps {
  tournament: Tournament;
  onJoin: (id: string) => void;
  isJoined?: boolean;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onJoin, isJoined = false }) => {
  const [copied, setCopied] = useState(false);
  const progress = (tournament.slotsFilled / tournament.slots) * 100;
  
  const handleGetRoomId = () => {
    if (tournament.roomCode) {
      navigator.clipboard.writeText(tournament.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="bg-[#0f172a] dark:bg-slate-900 rounded-[3rem] p-8 mb-8 shadow-2xl border border-slate-800/50 overflow-hidden relative group transition-all">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-8">
        <div className="max-w-[60%]">
          <span className="inline-block px-4 py-1.5 bg-slate-800 text-slate-400 text-[9px] font-black rounded-xl uppercase mb-3 tracking-widest border border-slate-700/50">
            {tournament.type} • {tournament.map}
          </span>
          <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{tournament.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Grand Prize</p>
          <p className="text-4xl font-black text-[#22c55e] leading-none italic tracking-tighter flex items-center justify-end">
            <span className="text-xl mr-1 font-sans not-italic">৳</span>{tournament.prizePool}
          </p>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1e293b]/40 dark:bg-slate-800/40 p-5 rounded-[2.5rem] flex items-center gap-4 border border-slate-800/30">
          <div className="w-12 h-12 rounded-2xl bg-[#334155] dark:bg-slate-700 flex items-center justify-center text-amber-500 shadow-lg shrink-0">
            <i className="fa-solid fa-ticket text-xl"></i>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-black uppercase leading-none mb-1 tracking-widest">Entry</p>
            <p className="font-black text-white text-lg">৳{tournament.entryFee}</p>
          </div>
        </div>
        <div className="bg-[#1e293b]/40 dark:bg-slate-800/40 p-5 rounded-[2.5rem] flex items-center gap-4 border border-slate-800/30">
          <div className="w-12 h-12 rounded-2xl bg-[#1d4ed8]/20 flex items-center justify-center text-blue-400 shadow-lg shrink-0">
            <i className="fa-solid fa-clock text-xl"></i>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] text-slate-500 font-black uppercase leading-none mb-1 tracking-widest">Start</p>
            <div className="font-black text-white text-base leading-none">
              {tournament.status === 'available' ? (
                <CountdownTimer targetDate={tournament.startTime} compact={true} />
              ) : (
                <span className="uppercase text-slate-500 text-xs">Ended</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slots & Progress */}
      <div className="mb-10 px-1">
        <div className="flex justify-between text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
          <span>{tournament.slotsFilled}/{tournament.slots} Warriors Ready</span>
          <span className="text-amber-500">{tournament.slots - tournament.slotsFilled} Open Slots</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0 border border-slate-800 shadow-inner">
          <div 
            className="bg-amber-400 h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_15px_rgba(251,191,36,0.3)]" 
            style={{ width: `${progress}%` }}
          >
             <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {isJoined ? (
        tournament.status === 'live' ? (
          <button
            type="button"
            onClick={handleGetRoomId}
            className="w-full py-6 rounded-full font-black text-sm uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 bg-amber-400 text-slate-900 shadow-amber-400/30 flex items-center justify-center gap-4"
          >
            <i className={`fa-solid ${copied ? 'fa-check-double' : 'fa-copy'} text-lg`}></i>
            {copied ? 'ROOM COPIED' : 'GET ROOM ID'}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-6 rounded-full font-black text-sm uppercase tracking-[0.4em] bg-slate-800 text-slate-500 cursor-default border border-slate-700"
          >
            {tournament.status === 'complete' ? 'BATTLE ENDED' : 'JOINED • WAITING'}
          </button>
        )
      ) : (
        <button
          type="button"
          onClick={() => onJoin(tournament.id)}
          disabled={tournament.slotsFilled >= tournament.slots || tournament.status !== 'available'}
          className={`w-full py-6 rounded-full font-black text-sm uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 ${
            (tournament.slotsFilled >= tournament.slots || tournament.status !== 'available')
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
            : 'bg-white text-[#0f172a] hover:bg-slate-100 shadow-white/10'
          }`}
        >
          {tournament.slotsFilled >= tournament.slots 
            ? 'BATTLE FULL' 
            : tournament.status === 'live' 
              ? 'BATTLE LIVE' 
              : tournament.status === 'complete' 
                ? 'BATTLE ENDED' 
                : 'JOIN ARENA'}
        </button>
      )}
    </div>
  );
};

export default TournamentCard;
