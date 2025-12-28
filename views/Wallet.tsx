
import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../types';
import { STORAGE_KEYS } from '../constants';

const BkashLogo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-2">
    <path d="M85.06,17.91c-1.12-2.31-3.13-4.14-5.55-5.06c-2.42-0.92-5.09-0.89-7.48,0.08L14.7,35.4c-3.79,1.54-6.03,5.63-5.23,9.59 c0.41,2.02,1.61,3.77,3.37,4.92l45.47,29.7c1.47,0.96,3.2,1.47,4.96,1.47c1.78,0,3.53-0.52,5.03-1.52l22.4-14.88 c3.31-2.2,4.88-6.19,3.87-10.03c-0.52-1.97-1.74-3.66-3.41-4.75l-22.14-14.4c-1.13-0.74-2.43-1.13-3.75-1.13 c-1.32,0-2.62,0.39-3.75,1.13l-13.88,9.03c-1.89,1.23-2.44,3.74-1.21,5.64c1.23,1.89,3.74,2.44,5.64,1.21l10.13-6.59l11.08,7.21 c0.23,0.15,0.4,0.38,0.47,0.65c0.14,0.53-0.08,1.09-0.53,1.39L46.6,67.63c-0.2,0.13-0.44,0.2-0.68,0.2c-0.24,0-0.47-0.07-0.67-0.2 L17.51,49.52c-0.24-0.16-0.4-0.4-0.46-0.67c-0.11-0.54,0.2-1.1,0.72-1.31l57.32-22.47c0.33-0.13,0.69-0.13,1.02-0.01 c0.33,0.13,0.61,0.38,0.76,0.7c0.21,0.44,0.12,0.96-0.23,1.3l-14.46,14.46l-0.04,0.04c-1.56,1.56-1.56,4.09,0,5.65 c1.56,1.56,4.09,1.56,5.65,0l17.29-17.29c0.23-0.23,0.39-0.53,0.47-0.85C86.1,24.8,86.08,21,85.06,17.91z" fill="currentColor" />
  </svg>
);

const NagadLogo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-1.5">
    <path d="M50,95c-24.81,0-45-20.19-45-45s20.19-45,45-45s45,20.19,45,45S74.81,95,50,95z M50,15.79 c-18.86,0-34.21,15.35-34.21,34.21S31.14,84.21,50,84.21S84.21,68.86,84.21,50S68.86,15.79,50,15.79z" fill="none" />
    <path d="M69.04,49.33l-5.83-8.15c-0.34-0.48-0.92-0.77-1.54-0.77h-8.33c-0.62,0-1.2,0.29-1.54,0.77l-5.83,8.15 c-0.34,0.48-0.34,1.13,0,1.61l5.83,8.15c0.34,0.48,0.92,0.77,1.54,0.77h8.33c0.62,0,1.2-0.29,1.54-0.77l5.83-8.15 C69.38,50.46,69.38,49.81,69.04,49.33z M60.83,57.48h-6.66l-4.66-6.51l4.66-6.51h6.66l4.66,6.51L60.83,57.48z" fill="currentColor" />
    <path d="M43.16,50c0-1.28-1.04-2.32-2.32-2.32h-8.33c-1.28,0-2.32,1.04-2.32,2.32c0,1.28,1.04,2.32,2.32,2.32h8.33 C42.12,52.32,43.16,51.28,43.16,50z" fill="currentColor" />
    <path d="M43.16,58.33c0-1.28-1.04-2.32-2.32-2.32h-3.33c-1.28,0-2.32,1.04-2.32,2.32c0,1.28,1.04,2.32,2.32,2.32h3.33 C42.12,60.65,43.16,59.61,43.16,58.33z" fill="currentColor" />
    <path d="M43.16,41.67c0-1.28-1.04-2.32-2.32-2.32h-3.33c-1.28,0-2.32,1.04-2.32,2.32c0,1.28,1.04,2.32,2.32,2.32h3.33 C42.12,43.99,43.16,42.95,43.16,41.67z" fill="currentColor" />
  </svg>
);

const Wallet: React.FC<{ user: User; setUser: (u: User) => void }> = ({ user, setUser }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [view, setView] = useState<'main' | 'deposit' | 'withdraw'>('main');
  const [phone, setPhone] = useState(user.phone);
  const [history, setHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    else {
      // Initial mock if empty
      const initial = [{ id: 'tx-init', amount: 100, type: 'deposit', status: 'success', date: '2023-10-25 10:00' } as Transaction];
      setHistory(initial);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initial));
    }
  }, []);

  const addTransaction = (type: 'deposit' | 'withdrawal', val: number) => {
    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      amount: val,
      type: type === 'deposit' ? 'deposit' : 'withdrawal',
      status: 'success',
      date: new Date().toLocaleString()
    };
    const updatedHistory = [newTx, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedHistory));
  };

  const handleDeposit = () => {
    const val = parseFloat(amount);
    if (!val || val < 10) {
      alert("Minimum deposit is ৳10");
      return;
    }
    const updatedUser = { ...user, wallet: user.wallet + val };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    addTransaction('deposit', val);
    setAmount('');
    setView('main');
  };

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (!val || val < 100) {
      alert("Minimum withdrawal is ৳100");
      return;
    }
    if (val > user.wallet) {
      alert("Insufficient balance!");
      return;
    }
    const updatedUser = { ...user, wallet: user.wallet - val };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    addTransaction('withdrawal', val);
    setAmount('');
    setView('main');
  };

  if (view === 'deposit' || view === 'withdraw') {
    return (
      <div className="p-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <button onClick={() => setView('main')} className="mb-10 flex items-center gap-4 text-slate-500 font-black uppercase text-sm group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Back to Wallet
        </button>
        
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-10 uppercase tracking-tight">
          {view === 'deposit' ? 'Add Money' : 'Withdraw Money'}
        </h2>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-md border border-slate-100 dark:border-slate-800 mb-8">
          <label className="text-xs font-black text-slate-400 uppercase ml-3 mb-5 block tracking-widest">Select Provider</label>
          <div className="flex gap-6">
            <button 
              onClick={() => setPaymentMethod('bkash')}
              className={`flex-1 p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${
                paymentMethod === 'bkash' ? 'border-[#E2136E] bg-[#E2136E]/5' : 'border-slate-50 dark:border-slate-800 opacity-40'
              }`}
            >
              <div className="w-16 h-16 bg-[#E2136E] rounded-full flex items-center justify-center text-white shadow-lg relative overflow-hidden">
                <BkashLogo />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'bkash' ? 'text-[#E2136E]' : 'text-slate-400'}`}>bKash</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('nagad')}
              className={`flex-1 p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${
                paymentMethod === 'nagad' ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-slate-50 dark:border-slate-800 opacity-40'
              }`}
            >
              <div className="w-16 h-16 bg-[#F7941D] rounded-full flex items-center justify-center text-white shadow-lg relative overflow-hidden">
                <NagadLogo />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'nagad' ? 'text-[#F7941D]' : 'text-slate-400'}`}>Nagad</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase ml-3 block tracking-widest">Amount (৳)</label>
            <input 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white dark:bg-[#111827] border-none rounded-[1.5rem] py-6 px-8 focus:ring-2 focus:ring-amber-400 font-black text-2xl text-slate-800 dark:text-white shadow-md border border-slate-100 dark:border-slate-800"
            />
          </div>
          <button 
            onClick={view === 'deposit' ? handleDeposit : handleWithdraw}
            className={`w-full py-6 rounded-[1.5rem] font-black uppercase tracking-[0.3em] shadow-2xl mt-10 transition-all active:scale-95 text-base ${
              paymentMethod === 'bkash' ? 'bg-[#E2136E] text-white' : 'bg-[#F7941D] text-white'
            }`}
          >
            {view === 'deposit' ? `Confirm Payment` : `Submit Payout Request`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 animate-in fade-in duration-500">
      <div className="bg-[#0f172a] dark:bg-[#111827] rounded-[3.5rem] p-12 mb-10 shadow-2xl text-center relative overflow-hidden border border-slate-800/50">
        <p className="text-slate-500 font-black text-xs uppercase tracking-[0.4em] mb-4 relative z-10">Current Balance</p>
        <h2 className="text-8xl font-black text-white tracking-tighter relative z-10 flex items-center justify-center leading-none">
          <span className="text-4xl mr-3 font-sans opacity-60">৳</span>{user.wallet}
        </h2>
        <div className="flex gap-4 mt-12 relative z-10">
           <button onClick={() => setView('deposit')} className="flex-1 bg-white text-slate-900 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
             <i className="fa-solid fa-circle-plus text-lg"></i> DEPOSIT
           </button>
           <button onClick={() => setView('withdraw')} className="flex-1 bg-amber-400 text-slate-900 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
             <i className="fa-solid fa-money-bill-transfer text-lg"></i> WITHDRAW
           </button>
        </div>
      </div>

      <div className="px-1">
        <h3 className="font-black text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-[0.4em] mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-slate-800"></span>
          Transaction History
        </h3>
        <div className="space-y-4">
          {history.map(tx => (
            <div key={tx.id} className="bg-slate-900/30 dark:bg-slate-900/40 p-6 rounded-[2.5rem] flex justify-between items-center border border-slate-800/30 backdrop-blur-sm transition-all active:scale-[0.98]">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-xl shadow-inner border ${
                  tx.type === 'winning' || tx.type === 'deposit' 
                  ? 'bg-green-900/10 text-green-500 border-green-500/10' 
                  : 'bg-rose-900/10 text-rose-500 border-rose-500/10'
                }`}>
                  <i className={`fa-solid ${tx.type === 'deposit' ? 'fa-circle-plus' : tx.type === 'winning' ? 'fa-crown' : 'fa-circle-minus'}`}></i>
                </div>
                <div>
                  <p className="font-black text-xs text-white uppercase tracking-widest leading-none mb-2">{tx.type === 'winning' ? 'BATTLE WIN' : tx.type.toUpperCase()}</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest opacity-80">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-xl tracking-tight ${tx.type === 'winning' || tx.type === 'deposit' ? 'text-green-500' : 'text-rose-500'}`}>
                  {tx.type === 'winning' || tx.type === 'deposit' ? '+' : '-'}৳{tx.amount}
                </p>
                <p className={`text-[8px] font-black uppercase tracking-[0.2em] mt-1 text-slate-600`}>{tx.status}</p>
              </div>
            </div>
          ))}
          {history.length === 0 && <p className="text-center py-10 text-slate-600 font-black uppercase text-[10px] tracking-widest">No activities recorded</p>}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
