
import React, { useState, useEffect } from 'react';
import { User, Tournament } from '../types';
import { STORAGE_KEYS } from '../constants';
import CountdownTimer from '../components/CountdownTimer';

interface MyTournamentsProps {
  user: User;
}

const MyTournaments: React.FC<MyTournamentsProps> = ({ user }) => {
  const [matches, setMatches] = useState<Tournament[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Tournament | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    if (data) {
      const allTournaments: Tournament[] = JSON.parse(data);
      // Only show tournaments that the user HAS joined
      setMatches(allTournaments.filter(t => user.joinedMatchIds?.includes(t.id)));
    }
  }, [user.joinedMatchIds]);

  const copyToClipboard = (text: string, matchId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(matchId);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-10 px-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">My Battles</h2>
        <div className="w-14 h-14 rounded-[1.5rem] bg-slate-900 dark:bg-slate-800 text-amber-400 flex items-center justify-center shadow-2xl border border-amber-500/20">
          <i className="fa-solid fa-trophy text-2xl"></i>
        </div>
      </div>
      
      <div className="space-y-8">
        {matches.map(match => (
          <div key={match.id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-md border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-all active:scale-[0.98]">
             <div className="absolute top-0 right-0">
               <span className={`px-6 py-2.5 text-[11px] font-black uppercase rounded-bl-[2rem] ${
                 match.status === 'available' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                 match.status === 'live' ? 'bg-blue-600 text-white' : 
                 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
               }`}>
                 {match.status}
               </span>
             </div>
             
             <div className="flex gap-5 items-center mb-8">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner">
                  <i className="fa-solid fa-dice text-slate-900 dark:text-amber-400 text-4xl"></i>
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white uppercase text-2xl leading-tight">{match.title}</h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">ARENA ID: #{match.id}</p>
                </div>
             </div>

             <div className="flex gap-5">
                <button 
                  type="button"
                  onClick={() => setSelectedMatch(match)}
                  className="flex-1 py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all border border-amber-500/10 flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-users-viewfinder"></i> Match Lobby
                </button>
             </div>
          </div>
        ))}
        
        {matches.length === 0 && (
          <div className="text-center py-40 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <div className="w-28 h-28 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <i className="fa-solid fa-ghost text-slate-200 dark:text-slate-700 text-6xl"></i>
            </div>
            <p className="text-slate-800 dark:text-white font-black uppercase text-lg tracking-widest mb-3">Arena Empty</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 px-16">Join a battle from the Home screen to see it here.</p>
          </div>
        )}
      </div>

      {selectedMatch && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-end sm:items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[4rem] overflow-hidden animate-in slide-in-from-bottom-full duration-400 max-h-[90vh] flex flex-col shadow-2xl border dark:border-slate-800">
            <div className="p-10 pb-6 flex justify-between items-start shrink-0">
              <div>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-tight">Arena Lobby</h3>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-2">Combatant Headquarters</p>
              </div>
              <button type="button" onClick={() => setSelectedMatch(null)} className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-90 transition-all shadow-sm">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>

            <div className="p-10 pt-0 overflow-y-auto flex-1 space-y-10 scrollbar-hide">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] p-8 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 shadow-inner">
                <div className="flex justify-between items-center mb-8">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Warriors</p>
                   <span className="text-[11px] bg-white dark:bg-slate-900 px-5 py-2 rounded-full text-slate-900 dark:text-white font-black shadow-md">{selectedMatch.slotsFilled}/{selectedMatch.slots}</span>
                </div>
                <div className="space-y-6">
                  {/* DYNAMIC LIST: Show actual usernames who joined THIS specific tournament */}
                  {selectedMatch.participantNames?.map((participantId, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[1.2rem] bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 overflow-hidden shadow-md flex items-center justify-center">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participantId}`} alt="P" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-base font-black uppercase tracking-wider flex items-center gap-3 text-slate-800 dark:text-white">
                            @{participantId}
                            {participantId === user.name && <span className="text-[9px] bg-amber-400 text-slate-900 px-3 py-1 rounded font-black tracking-widest shadow-sm">YOU</span>}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                             <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">READY</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {Array.from({ length: Math.max(0, selectedMatch.slots - (selectedMatch.participantNames?.length || 0)) }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex items-center gap-5 opacity-30">
                       <div className="w-14 h-14 rounded-[1.2rem] bg-slate-100 dark:bg-slate-700 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                         <i className="fa-solid fa-user-plus text-sm text-slate-400"></i>
                       </div>
                       <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 italic">Waiting for Warrior...</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMatch.status === 'live' && selectedMatch.roomCode ? (
                <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-[2.5rem] p-8 border border-amber-500/20 shadow-2xl relative overflow-hidden">
                   <div className="relative z-10 flex justify-between items-center">
                      <div>
                        <p className="text-[11px] font-black text-amber-400 uppercase mb-3 tracking-[0.4em]">Official Room Code</p>
                        <p className="text-5xl font-black text-white tracking-[0.5em] font-mono leading-none">{selectedMatch.roomCode}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(selectedMatch.roomCode || '', selectedMatch.id)}
                        className="bg-amber-400 text-slate-900 w-16 h-16 rounded-[1.2rem] active:scale-90 transition-all shadow-xl flex items-center justify-center text-2xl"
                      >
                        <i className={`fa-solid ${copiedId === selectedMatch.id ? 'fa-check-double' : 'fa-copy'}`}></i>
                      </button>
                    </div>
                </div>
              ) : (
                <div className="text-center py-10 px-10 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-[3rem] border border-blue-100 dark:border-blue-900/20 flex flex-col items-center">
                  <div className="flex gap-4 items-center bg-slate-900 dark:bg-slate-800 px-8 py-5 rounded-[1.5rem] text-white font-black text-2xl tracking-[0.3em] shadow-2xl mb-8 border border-slate-800">
                     <i className="fa-solid fa-clock-rotate-left text-amber-400"></i>
                     <CountdownTimer targetDate={selectedMatch.startTime} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] leading-relaxed opacity-80">Room code arriving at start time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTournaments;
