
import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const [notice, setNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    const savedNotice = localStorage.getItem(STORAGE_KEYS.NOTICE);
    if (savedNotice) setNotice(savedNotice);
  }, []);

  const handleSaveNotice = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.NOTICE, notice);
      setIsSaving(false);
      alert("Ticker message updated for all players.");
    }, 800);
  };

  return (
    <div className="p-6 bg-[#050b1a] min-h-screen pb-32 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10 px-2">
        <Link to="/admin" className="w-12 h-12 rounded-2xl bg-[#0f172a] text-slate-400 flex items-center justify-center border border-slate-800 shadow-xl active:scale-90 transition-all">
           <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">System</h2>
      </div>
      
      <div className="space-y-8">
        {/* Global Notice Card */}
        <div className="bg-[#111827] p-10 rounded-[3.5rem] shadow-2xl border border-slate-800/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-5 mb-8 relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[#1e293b] text-amber-400 flex items-center justify-center text-2xl border border-slate-700/30">
              <i className="fa-solid fa-bullhorn"></i>
            </div>
            <div>
              <h3 className="font-black text-white uppercase text-sm tracking-widest italic">Global Notice</h3>
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">Marquee Message</p>
            </div>
          </div>
          
          <div className="space-y-6 relative z-10">
            <textarea 
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              placeholder="Enter ticker message..."
              className="w-full bg-[#050b1a] border-none rounded-[2rem] p-6 font-black text-white text-xs min-h-[140px] focus:ring-2 focus:ring-amber-400 shadow-inner resize-none leading-relaxed"
            />
            <button 
              onClick={handleSaveNotice}
              disabled={isSaving}
              className={`w-full py-6 rounded-[1.8rem] font-black uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                isSaving ? 'bg-slate-800 text-slate-600' : 'bg-amber-400 text-slate-900 shadow-amber-400/20'
              }`}
            >
              {isSaving ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Update Ticker'}
            </button>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-[#111827] p-10 rounded-[3.5rem] shadow-2xl border border-slate-800/50 flex items-center justify-between group transition-all">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl border transition-colors ${maintenance ? 'bg-rose-900/20 text-rose-500 border-rose-500/10' : 'bg-slate-800 text-slate-500 border-slate-700/20'}`}>
              <i className="fa-solid fa-power-off"></i>
            </div>
            <div>
              <h3 className="font-black text-white uppercase text-sm tracking-widest italic">Arena Lock</h3>
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">Maintenance Mode</p>
            </div>
          </div>
          
          <button 
            onClick={() => setMaintenance(!maintenance)}
            className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${maintenance ? 'bg-rose-500' : 'bg-slate-800'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${maintenance ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </button>
        </div>

        {/* Info Card */}
        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] leading-relaxed">
            System Changes push instantly to all active warrior sessions via Taka-Shield Sync.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
