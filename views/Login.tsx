
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';
import Logo from '../components/Logo';

interface LoginProps {
  setUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', 
    gameName: '',
    phone: '',
    password: ''
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const registry: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    if (isLogin) {
      const existing = registry.find(u => u.name === formData.name);
      if (!existing) {
        setError("User not found.");
        return;
      }
    } else {
      const exists = registry.some(u => u.name === formData.name || u.phone === formData.phone);
      if (exists) {
        setError("Username or phone already registered.");
        return;
      }
    }

    if (formData.phone.length !== 11 || !/^\d{11}$/.test(formData.phone)) {
      setError("Phone number must be exactly 11 digits.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setStep('otp');
    setTimer(30);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    const registry: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    let targetUser: User;

    if (isLogin) {
      targetUser = registry.find(u => u.name === formData.name)!;
    } else {
      targetUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        gameName: formData.gameName || formData.name,
        email: `${formData.phone}@ludotaka.com`,
        phone: formData.phone,
        wallet: 100, // Welcome bonus
        role: (formData.phone === '01700000000' || formData.name.toLowerCase() === 'admin') ? 'admin' : 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        joinedMatchIds: []
      };
      registry.push(targetUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registry));
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(targetUser));
    setUser(targetUser);
  };

  const handleResend = () => {
    if (timer === 0) setTimer(30);
  };

  return (
    <div className="min-h-screen bg-[#050b1a] flex flex-col items-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-20%] w-[120%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[120%] h-[50%] bg-amber-600/5 rounded-full blur-[120px]"></div>

      <div className="mb-10 text-center relative z-10 scale-90">
        <Logo size="sm" />
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] mt-6 opacity-70">The Ultimate Arena</p>
      </div>

      <div className="bg-white w-full max-w-sm rounded-[4rem] p-10 shadow-2xl relative z-10 flex flex-col min-h-[700px] animate-in slide-in-from-bottom-10 duration-700">
        <div className="flex bg-[#f1f5f9] rounded-[2rem] p-1.5 mb-10 shadow-inner">
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-4 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${isLogin ? 'bg-white text-slate-800 shadow-xl' : 'text-slate-400'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-4 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${!isLogin ? 'bg-white text-slate-800 shadow-xl' : 'text-slate-400'}`}
          >
            Create
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-wider mb-6 animate-in fade-in zoom-in-95 border border-rose-100 flex items-center gap-3">
            <i className="fa-solid fa-circle-exclamation text-base"></i> {error}
          </div>
        )}

        {step === 'form' ? (
          <form onSubmit={handleInitialSubmit} className="space-y-6 flex-1">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4 block tracking-[0.15em]">Unique Username</label>
                  <input 
                    type="text" 
                    placeholder="e.g. warrior99" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value.toLowerCase().replace(/\s/g, '')})}
                    className="w-full bg-[#f8fafc] border border-slate-50 rounded-[2rem] py-5 px-8 focus:ring-2 focus:ring-slate-900 text-slate-800 font-bold shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4 block tracking-[0.15em]">In-Game Name</label>
                  <input 
                    type="text" 
                    placeholder="Ludo King Name" 
                    required
                    value={formData.gameName}
                    onChange={(e) => setFormData({...formData, gameName: e.target.value})}
                    className="w-full bg-[#f8fafc] border border-slate-50 rounded-[2rem] py-5 px-8 focus:ring-2 focus:ring-slate-900 text-slate-800 font-bold shadow-sm"
                  />
                </div>
              </>
            )}
            {isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 block tracking-[0.15em]">Username</label>
                <input 
                  type="text" 
                  placeholder="Your ID" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value.toLowerCase()})}
                  className="w-full bg-[#f8fafc] border border-slate-50 rounded-[2rem] py-5 px-8 focus:ring-2 focus:ring-slate-900 text-slate-800 font-bold shadow-sm"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 block tracking-[0.15em]">Phone</label>
              <input 
                type="tel" 
                placeholder="017XXXXXXXX" 
                required
                maxLength={11}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                className="w-full bg-[#f8fafc] border border-slate-50 rounded-[2rem] py-5 px-8 focus:ring-2 focus:ring-slate-900 text-slate-800 font-bold shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 block tracking-[0.15em]">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[#f8fafc] border border-slate-50 rounded-[2rem] py-5 px-8 focus:ring-2 focus:ring-slate-900 text-slate-800 font-bold shadow-sm"
              />
            </div>
            
            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full bg-[#0f172a] text-white py-6 rounded-[2.2rem] font-black uppercase tracking-[0.25em] shadow-xl active:scale-95 transition-all text-xs"
              >
                {isLogin ? 'SIGN IN' : 'REGISTER'}
              </button>
            </div>
          </form>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col flex-1">
            <button onClick={() => setStep('form')} className="text-slate-400 font-black text-[10px] uppercase mb-12 flex items-center gap-3 tracking-widest">
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
            <div className="text-center mb-12">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-3 italic">Verify OTP</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Code sent to {formData.phone}</p>
            </div>
            <form onSubmit={handleVerifyOtp} className="flex-1 flex flex-col">
              <div className="flex justify-between gap-4 mb-12">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    className="w-full aspect-square bg-[#f8fafc] rounded-[1.8rem] text-center text-3xl font-black text-slate-900 focus:ring-2 focus:ring-slate-900 shadow-inner"
                  />
                ))}
              </div>
              <button type="submit" className="mt-auto w-full bg-[#0f172a] text-white py-6 rounded-[2.2rem] font-black uppercase tracking-[0.25em] shadow-xl active:scale-95 transition-all text-xs">
                CONFIRM & ENTER
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
