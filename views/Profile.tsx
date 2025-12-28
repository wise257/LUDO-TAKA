
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: User;
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, toggleTheme, currentTheme }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name,
    gameName: user.gameName,
    phone: user.phone
  });

  const handleLogout = () => {
    localStorage.setItem(STORAGE_KEYS.USER, '');
    setUser(null);
    navigate('/login');
  };

  const startVerification = async () => {
    setShowVerify(true);
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access for verification.");
      setShowVerify(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setCameraActive(false);
        alert("Verification photo captured! Our team will review your ID within 24 hours.");
        setShowVerify(false);
      }
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const optimizedBase64 = event.target?.result as string;
      const updatedUser = { ...user, avatar: optimizedBase64 };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      // Update Registry
      const registry: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const updatedRegistry = registry.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedRegistry));
      
      setIsUploading(false);
    };
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      const registry: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const updatedRegistry = registry.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedRegistry));
      
      setIsSaving(false);
      setShowConfig(false);
    }, 600);
  };

  return (
    <div className="p-6 pb-40 min-h-screen bg-[#050b1a] animate-in fade-in duration-500">
      <div className="bg-[#0f172a] rounded-[3.5rem] p-10 mb-8 text-center shadow-2xl border border-slate-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl"></div>
        <div className="relative w-36 h-36 mx-auto mb-8">
          <div className="w-full h-full rounded-[2.5rem] bg-slate-800 border-4 border-slate-700 shadow-2xl overflow-hidden relative">
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-[-2px] right-[-2px] w-12 h-12 bg-amber-400 text-slate-900 rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#0f172a] active:scale-90 transition-all z-30">
            <i className="fa-solid fa-camera text-lg"></i>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <h2 className="text-3xl font-black text-white leading-none mb-3 uppercase tracking-tight">{user.gameName}</h2>
        <p className="text-[10px] bg-amber-400 text-slate-900 px-5 py-2 rounded-full font-black uppercase tracking-[0.2em] inline-block shadow-lg mb-8">@{user.name}</p>
        
        <div className="flex items-center justify-center gap-4 px-2">
          <button onClick={startVerification} className="flex-1 bg-blue-600 text-white px-4 py-4 rounded-full font-black text-[9px] uppercase shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-id-card text-base"></i> VERIFY ID
          </button>
          <Link to="/history" className="flex-1 bg-slate-800 text-white px-4 py-4 rounded-full font-black text-[9px] uppercase shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-700">
            <i className="fa-solid fa-clock-rotate-left text-base"></i> HISTORY
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <button onClick={() => setShowConfig(true)} className="w-full h-20 bg-[#111827] rounded-[2rem] px-8 flex items-center justify-between border border-slate-800/30 shadow-xl active:scale-[0.98] transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-xl border border-slate-700/20">
              <i className="fa-solid fa-user-gear"></i>
            </div>
            <span className="font-black text-xs text-white uppercase tracking-[0.2em]">Account Config</span>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-700 text-xs"></i>
        </button>

        <button onClick={toggleTheme} className="w-full h-20 bg-[#111827] rounded-[2rem] px-8 flex items-center justify-between border border-slate-800/30 shadow-xl active:scale-[0.98] transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-xl border border-slate-700/20">
              <i className={`fa-solid ${currentTheme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
            </div>
            <span className="font-black text-xs text-white uppercase tracking-[0.2em]">Appearance</span>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${currentTheme === 'dark' ? 'bg-amber-400' : 'bg-slate-700'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${currentTheme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </div>
        </button>

        <button onClick={handleLogout} className="w-full h-20 bg-[#1a1016] rounded-[2rem] px-8 flex items-center border border-rose-900/30 shadow-xl active:scale-[0.98] transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-rose-950/20 flex items-center justify-center text-rose-500 text-xl">
              <i className="fa-solid fa-power-off"></i>
            </div>
            <span className="font-black text-xs text-rose-500 uppercase tracking-[0.2em]">Sign Out</span>
          </div>
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.5em] opacity-60">LUDO TAKA PREMIUM • V2.5</p>
      </div>
      
      {showConfig && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-end justify-center">
          <div className="bg-[#111827] w-full max-w-md rounded-t-[4rem] p-10 pb-20 shadow-2xl animate-in slide-in-from-bottom-full duration-300 border-t border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white uppercase italic">Account Settings</h3>
              <button onClick={() => setShowConfig(false)} className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 block tracking-widest">Display Name</label>
                <input type="text" value={formData.gameName} required onChange={e => setFormData({...formData, gameName: e.target.value})} className="w-full bg-slate-800 border-none rounded-[1.5rem] p-5 font-black text-white focus:ring-2 focus:ring-amber-400" />
              </div>
              <button type="submit" className="w-full py-6 rounded-[1.5rem] bg-amber-400 text-slate-900 font-black uppercase tracking-[0.3em] shadow-xl text-xs">SAVE CHANGES</button>
            </form>
          </div>
        </div>
      )}

      {showVerify && (
        <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col p-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-white uppercase italic">Identity Verification</h3>
            <button onClick={() => { setCameraActive(false); setShowVerify(false); }} className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          <div className="flex-1 bg-black rounded-[3rem] overflow-hidden relative border-2 border-amber-400/20">
            {cameraActive && (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            )}
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 border-[20px] border-slate-950/80 pointer-events-none">
              <div className="w-full h-full border-2 border-amber-400/50 rounded-2xl border-dashed"></div>
            </div>
            <p className="absolute bottom-10 left-0 w-full text-center text-amber-400 font-black uppercase text-[10px] tracking-widest">Position your face inside the frame</p>
          </div>
          <button onClick={capturePhoto} className="w-24 h-24 bg-white rounded-full mx-auto mt-10 mb-10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-90 transition-all">
            <div className="w-20 h-20 rounded-full border-4 border-slate-900"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
