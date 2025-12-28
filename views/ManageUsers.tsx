
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';

interface ManageUsersProps {
  user: User;
  setUser: (user: User) => void;
}

const ManageUsers: React.FC<ManageUsersProps> = ({ user, setUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [adjustingUser, setAdjustingUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  useEffect(() => {
    const registry: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    setUsers(registry);
  }, []);

  const handleWalletAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser) return;
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount)) return;

    const registry: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const updatedRegistry = registry.map(u => {
      if (u.id === adjustingUser.id) {
        return { ...u, wallet: u.wallet + amount };
      }
      return u;
    });

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedRegistry));
    setUsers(updatedRegistry);

    // If adjusting the current admin user
    if (adjustingUser.id === user.id) {
      const updatedSelf = { ...user, wallet: user.wallet + amount };
      setUser(updatedSelf);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedSelf));
    }

    setAdjustingUser(null);
    setAdjustAmount('');
  };

  const deleteUser = (id: string) => {
    if (id === user.id) {
      alert("Cannot delete your own admin account.");
      return;
    }
    if (!window.confirm("Delete this user?")) return;
    const registry: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const updated = registry.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    setUsers(updated);
  };

  return (
    <div className="p-6 bg-[#050b1a] min-h-screen pb-32 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10 px-2">
        <Link to="/admin" className="w-12 h-12 rounded-2xl bg-[#0f172a] text-slate-400 flex items-center justify-center border border-slate-800 shadow-xl active:scale-90 transition-all">
           <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">Warriors</h2>
      </div>

      <div className="space-y-4">
        {users.map(u => (
          <div key={u.id} className={`bg-[#111827] rounded-[3rem] p-6 flex items-center justify-between border shadow-xl transition-all ${u.id === user.id ? 'border-amber-400/30' : 'border-slate-800/50'}`}>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[1.2rem] bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                <img src={u.avatar} alt="U" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-white uppercase tracking-wider text-sm">@{u.name}</p>
                <p className="text-[10px] text-amber-400 font-black tracking-widest uppercase mt-0.5">৳{u.wallet.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setAdjustingUser(u)}
                className="bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-700 active:scale-95 transition-all"
              >
                Wallet
              </button>
              <button 
                onClick={() => deleteUser(u.id)}
                className="w-10 h-10 flex items-center justify-center text-rose-500 bg-rose-500/10 rounded-2xl active:scale-90"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {adjustingUser && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-end justify-center">
          <div className="bg-[#111827] w-full max-w-md rounded-t-[4rem] p-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 border-t border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Adjust Wallet</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Target: @{adjustingUser.name}</p>
              </div>
              <button onClick={() => setAdjustingUser(null)} className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleWalletAdjust} className="space-y-6">
              <div className="bg-[#050b1a] rounded-[2rem] p-6 text-center border border-slate-800/50">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Current</p>
                <p className="text-3xl font-black text-white">৳{adjustingUser.wallet}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 block tracking-widest">Amount (+/-)</label>
                <input 
                  type="number" 
                  value={adjustAmount}
                  required
                  onChange={e => setAdjustAmount(e.target.value)}
                  className="w-full bg-[#1e293b] border-none rounded-[1.5rem] p-5 font-black text-white focus:ring-2 focus:ring-amber-400 text-xl text-center"
                  placeholder="0.00"
                />
              </div>
              <button type="submit" className="w-full py-6 bg-amber-400 text-slate-900 rounded-[1.5rem] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all text-xs">
                CONFIRM ADJUSTMENT
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
