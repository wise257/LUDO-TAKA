
import React, { useState, useEffect } from 'react';
import { Tournament } from '../types';
import { STORAGE_KEYS } from '../constants';
import { Link } from 'react-router-dom';

const ManageTournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    entryFee: '',
    prizePool: '',
    slots: '4',
    type: '4player',
    status: 'available',
    roomCode: ''
  });

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    if (data) setTournaments(JSON.parse(data));
  }, []);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = tournaments.map(t => {
        if (t.id === editingId) {
          return {
            ...t,
            title: formData.title,
            entryFee: Number(formData.entryFee),
            prizePool: Number(formData.prizePool),
            slots: Number(formData.slots),
            status: formData.status as any,
            roomCode: formData.roomCode,
            type: formData.type as any
          };
        }
        return t;
      });
      setTournaments(updated);
      localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(updated));
      setEditingId(null);
    } else {
      const newT: Tournament = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        entryFee: Number(formData.entryFee),
        prizePool: Number(formData.prizePool),
        slots: Number(formData.slots),
        slotsFilled: 0,
        startTime: new Date(Date.now() + 3600000).toISOString(),
        status: formData.status as any,
        map: 'Classic',
        type: formData.type as any,
        roomCode: formData.roomCode,
        participantNames: []
      };
      const updated = [newT, ...tournaments];
      setTournaments(updated);
      localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(updated));
    }
    setShowAdd(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', entryFee: '', prizePool: '', slots: '4', type: '4player', status: 'available', roomCode: '' });
  };

  const startEdit = (t: Tournament) => {
    setFormData({
      title: t.title,
      entryFee: String(t.entryFee),
      prizePool: String(t.prizePool),
      slots: String(t.slots),
      type: t.type,
      status: t.status,
      roomCode: t.roomCode || ''
    });
    setEditingId(t.id);
    setShowAdd(true);
  };

  const deleteTournament = (id: string) => {
    if (!window.confirm('Delete this arena? This cannot be undone.')) return;
    const updated = tournaments.filter(t => t.id !== id);
    setTournaments(updated);
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(updated));
  };

  return (
    <div className="p-6 pb-32 bg-[#050b1a] min-h-screen">
      <div className="flex justify-between items-center mb-10 px-2">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="w-12 h-12 rounded-2xl bg-[#0f172a] text-slate-400 flex items-center justify-center border border-slate-800 shadow-xl">
             <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">Arenas</h2>
        </div>
        <button 
          onClick={() => { setShowAdd(true); setEditingId(null); resetForm(); }}
          className="bg-amber-400 text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
      </div>

      <div className="space-y-6 px-1">
        {tournaments.map(t => (
          <div key={t.id} className="bg-[#111827] rounded-[3rem] p-8 border border-slate-800/50 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 -mr-16 -mt-16 rounded-full ${
              t.status === 'live' ? 'bg-blue-500' : t.status === 'available' ? 'bg-amber-400' : 'bg-slate-500'
            }`}></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                   <span className={`w-2 h-2 rounded-full ${t.status === 'live' ? 'bg-blue-400 animate-pulse' : t.status === 'available' ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
                   <h4 className="font-black text-white text-lg uppercase tracking-tight">{t.title}</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">#{t.id}</span>
                  <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.type}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(t)} className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center active:scale-90 transition-all border border-slate-700">
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button onClick={() => deleteTournament(t.id)} className="w-12 h-12 rounded-2xl bg-rose-900/20 text-rose-500 flex items-center justify-center active:scale-90 transition-all border border-rose-500/10">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
               <div className="bg-[#1e293b]/40 p-4 rounded-3xl border border-slate-800/30 text-center">
                 <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Entry</p>
                 <p className="font-black text-white text-sm">৳{t.entryFee}</p>
               </div>
               <div className="bg-[#1e293b]/40 p-4 rounded-3xl border border-slate-800/30 text-center">
                 <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Prize</p>
                 <p className="font-black text-green-400 text-sm">৳{t.prizePool}</p>
               </div>
               <div className="bg-[#1e293b]/40 p-4 rounded-3xl border border-slate-800/30 text-center">
                 <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Warriors</p>
                 <p className="font-black text-white text-sm">{t.slotsFilled}/{t.slots}</p>
               </div>
            </div>

            {t.roomCode && (
              <div className="mt-4 p-4 bg-slate-900 rounded-[1.5rem] border border-blue-500/20 flex justify-between items-center group/code">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Room Code: {t.roomCode}</span>
                <i className="fa-solid fa-link text-slate-700 text-xs"></i>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-end justify-center">
          <div className="bg-[#111827] w-full max-w-md rounded-t-[4rem] p-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 border-t border-slate-800">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">{editingId ? 'Edit Match' : 'New Match'}</h3>
              <button onClick={() => setShowAdd(false)} className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleAction} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase ml-4 block tracking-widest">Arena Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  required
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#1e293b] border-none rounded-[2rem] p-6 font-black text-white focus:ring-2 focus:ring-amber-400 shadow-inner"
                  placeholder="e.g., Daily Mega Cup"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-4 block tracking-widest">Entry Fee</label>
                  <input 
                    type="number" 
                    value={formData.entryFee}
                    required
                    onChange={e => setFormData({...formData, entryFee: e.target.value})}
                    className="w-full bg-[#1e293b] border-none rounded-[2rem] p-6 font-black text-white focus:ring-2 focus:ring-amber-400 shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-4 block tracking-widest">Prize Pool</label>
                  <input 
                    type="number" 
                    value={formData.prizePool}
                    required
                    onChange={e => setFormData({...formData, prizePool: e.target.value})}
                    className="w-full bg-[#1e293b] border-none rounded-[2rem] p-6 font-black text-white focus:ring-2 focus:ring-amber-400 shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-4 block tracking-widest">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-[#1e293b] border-none rounded-[2rem] p-6 font-black text-white focus:ring-2 focus:ring-amber-400 shadow-inner appearance-none"
                  >
                    <option value="available">Available</option>
                    <option value="live">Live</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-4 block tracking-widest">Room Code</label>
                  <input 
                    type="text" 
                    value={formData.roomCode}
                    onChange={e => setFormData({...formData, roomCode: e.target.value})}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-[2rem] p-6 font-black text-blue-400 tracking-[0.2em] focus:ring-2 focus:ring-blue-400 shadow-inner"
                    placeholder="77821"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-7 bg-amber-400 text-slate-900 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all text-base mt-4"
              >
                {editingId ? 'Save Changes' : 'Create Arena'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTournaments;
