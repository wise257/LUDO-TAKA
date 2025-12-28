
import React, { useState, useEffect } from 'react';
import { User, Tournament } from '../types';
import TournamentCard from '../components/TournamentCard';
import { STORAGE_KEYS } from '../constants';
import { Link } from 'react-router-dom';

interface HomeProps {
  user: User;
  setUser: (user: User) => void;
}

const Home: React.FC<HomeProps> = ({ user, setUser }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<'available' | 'live' | 'complete'>('available');
  const [joiningMatch, setJoiningMatch] = useState<Tournament | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notice, setNotice] = useState<string>('');

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    if (data) setTournaments(JSON.parse(data));
    const savedNotice = localStorage.getItem(STORAGE_KEYS.NOTICE);
    if (savedNotice) setNotice(savedNotice);
  }, []);

  const handleConfirmJoin = () => {
    if (!joiningMatch) return;

    if (user.wallet < joiningMatch.entryFee) {
      alert("Insufficient wallet balance. Please add money.");
      setJoiningMatch(null);
      return;
    }

    // Correctly update ONLY the target tournament with the joining user's name
    const updatedTournaments = tournaments.map(t => {
      if (t.id === joiningMatch.id) {
        const currentParticipants = t.participantNames || [];
        // Prevent double joining if clicked twice
        if (currentParticipants.includes(user.name)) return t;
        
        return { 
          ...t, 
          slotsFilled: t.slotsFilled + 1,
          participantNames: [...currentParticipants, user.name]
        };
      }
      return t;
    });
    
    setTournaments(updatedTournaments);
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(updatedTournaments));
    
    const updatedUser = { 
      ...user, 
      wallet: user.wallet - joiningMatch.entryFee,
      joinedMatchIds: Array.from(new Set([...(user.joinedMatchIds || []), joiningMatch.id]))
    };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    setIsSuccess(true);
    setTimeout(() => {
      setJoiningMatch(null);
      setIsSuccess(false);
    }, 2000);
  };

  const filteredTournaments = tournaments.filter(t => t.status === filter);

  return (
    <div className="p-5">
      {/* Brand Banner */}
      <div className="bg-[#0f172a] dark:bg-slate-900 rounded-[3rem] p-10 mb-6 text-white relative overflow-hidden shadow-2xl border border-amber-500/10 transition-colors">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-sm">LIVE NOW</span>
            <h2 className="text-4xl font-black tracking-tighter italic">TAKA ARENA</h2>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em] mb-10">Battle for Glory & Gold</p>
          
          <div className="flex items-center gap-5">
            <Link to="/history" className="bg-white dark:bg-slate-100 text-slate-900 px-8 py-5 rounded-full font-black text-xs uppercase shadow-2xl active:scale-95 transition-all flex items-center gap-4">
              <i className="fa-solid fa-clock-rotate-left text-xl"></i> HISTORY
            </Link>
            <Link to="/rules" className="bg-[#1e293b] dark:bg-slate-800 text-white px-8 py-5 rounded-full font-black text-xs uppercase shadow-2xl active:scale-95 transition-all flex items-center gap-4 border border-slate-700/50">
              <i className="fa-solid fa-book-open text-xl"></i> RULES
            </Link>
          </div>
        </div>
        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 rotate-12 pointer-events-none">
           <i className="fa-solid fa-shield-cat text-[15rem]"></i>
        </div>
      </div>

      {/* Notice */}
      {notice && (
        <div className="bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 p-1.5 mb-10 shadow-sm flex items-center overflow-hidden">
          <div className="bg-[#0f172a] dark:bg-amber-400 text-amber-400 dark:text-slate-900 px-5 py-2.5 rounded-full z-10 flex items-center gap-3 shrink-0 shadow-sm">
            <i className="fa-solid fa-bullhorn text-xs"></i>
            <span className="text-[11px] font-black uppercase tracking-widest">Notice</span>
          </div>
          <div className="flex-1 whitespace-nowrap overflow-hidden relative">
            <div className="inline-block animate-[marquee_30s_linear_infinite] pl-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {notice} &nbsp; • &nbsp; {notice}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-10 px-2 overflow-x-auto pb-3 scrollbar-hide items-center">
        {(['available', 'live', 'complete'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 border whitespace-nowrap ${
              filter === tab 
              ? 'bg-[#0f172a] dark:bg-amber-400 text-white dark:text-slate-900 border-[#0f172a] dark:border-amber-400 shadow-2xl scale-105' 
              : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tournaments List */}
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-2">
        {filteredTournaments.map(t => (
          <TournamentCard 
            key={t.id} 
            tournament={t} 
            onJoin={() => setJoiningMatch(t)} 
            isJoined={user.joinedMatchIds?.includes(t.id)}
          />
        ))}
        {filteredTournaments.length === 0 && (
          <div className="text-center py-28 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-black uppercase text-sm tracking-widest">Arena Empty</p>
          </div>
        )}
      </div>

      {/* Join Confirmation Modal */}
      {joiningMatch && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[4rem] p-12 shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-slate-800">
            {isSuccess ? (
              <div className="py-16 text-center">
                <div className="w-28 h-28 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white dark:border-slate-800 shadow-xl">
                  <i className="fa-solid fa-check text-6xl"></i>
                </div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3">JOINED!</h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Warrior ID: @{user.name}</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <div className="w-24 h-24 bg-amber-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-400/20 rotate-6">
                    <i className="fa-solid fa-shield-cat text-slate-900 text-5xl"></i>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase leading-tight mb-3">Join Battle?</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{joiningMatch.title}</p>
                </div>
                <div className="space-y-5 mb-12">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Entry Fee</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">৳{joiningMatch.entryFee}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={handleConfirmJoin} className="w-full py-6 bg-[#0f172a] dark:bg-amber-400 text-white dark:text-slate-900 rounded-full font-black uppercase tracking-[0.3em] active:scale-95 transition-all text-base shadow-xl shadow-slate-200 dark:shadow-slate-950">PAY & CONFIRM</button>
                  <button onClick={() => setJoiningMatch(null)} className="w-full py-5 text-slate-400 font-black uppercase text-xs tracking-[0.3em]">DISMISS</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
