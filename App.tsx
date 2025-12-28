
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Home from './views/Home';
import Wallet from './views/Wallet';
import Profile from './views/Profile';
import MyTournaments from './views/MyTournaments';
import GameHistoryView from './views/GameHistory';
import RulesView from './views/Rules';
import NotificationsView from './views/Notifications';
import AdminDashboard from './views/Admin';
import ManageTournaments from './views/ManageTournaments';
import ManageUsers from './views/ManageUsers';
import Settings from './views/Settings';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import { User, Tournament } from './types';
import { STORAGE_KEYS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    } else {
      // Default to dark for premium feel
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    }

    // User session
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Init User Registry
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const adminUser: User = {
        id: 'admin-001',
        name: 'admin',
        gameName: 'Arena Master',
        email: 'admin@ludotaka.com',
        phone: '01700000000',
        wallet: 5000,
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        joinedMatchIds: []
      };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
    }

    // Init Mock Tournaments
    if (!localStorage.getItem(STORAGE_KEYS.TOURNAMENTS)) {
      const now = new Date();
      const mockTournaments: Tournament[] = [
        { 
          id: '1001', 
          title: 'Daily Mega Cup', 
          entryFee: 50, 
          prizePool: 180, 
          slots: 4, 
          slotsFilled: 2, 
          startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), 
          status: 'available', 
          map: 'Classic', 
          type: '4player', 
          roomCode: '77821',
          participantNames: ['tarek_ludo', 'sakib_boss']
        },
        { 
          id: '1002', 
          title: 'Quick Duel', 
          entryFee: 20, 
          prizePool: 35, 
          slots: 2, 
          slotsFilled: 1, 
          startTime: new Date(now.getTime() + 45 * 60 * 1000).toISOString(), 
          status: 'available', 
          map: 'Classic', 
          type: '1vs1',
          participantNames: ['rahim_hero']
        },
      ];
      localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(mockTournaments));
    }

    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#050b1a] text-white">
      <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-6"></div>
      <div className="font-black uppercase tracking-[0.4em] text-[10px] italic animate-pulse">Entering Arena...</div>
    </div>
  );

  return (
    <HashRouter>
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col relative shadow-2xl border-x border-gray-100 dark:border-slate-800 transition-colors duration-300">
        {user && <Header user={user} />}
        <main className={`flex-1 overflow-y-auto pb-24 ${!user ? '' : 'pt-2'}`}>
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/login" />} />
            <Route path="/wallet" element={user ? <Wallet user={user} setUser={setUser} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} toggleTheme={toggleTheme} currentTheme={theme} /> : <Navigate to="/login" />} />
            <Route path="/history" element={user ? <GameHistoryView /> : <Navigate to="/login" />} />
            <Route path="/rules" element={user ? <RulesView /> : <Navigate to="/login" />} />
            <Route path="/notifications" element={user ? <NotificationsView /> : <Navigate to="/login" />} />
            <Route path="/my-tournaments" element={user ? <MyTournaments user={user} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/admin/tournaments" element={user?.role === 'admin' ? <ManageTournaments /> : <Navigate to="/" />} />
            <Route path="/admin/users" element={user?.role === 'admin' ? <ManageUsers user={user} setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/admin/settings" element={user?.role === 'admin' ? <Settings /> : <Navigate to="/" />} />
          </Routes>
        </main>
        {user && <BottomNav role={user.role} />}
      </div>
    </HashRouter>
  );
};

export default App;
