
export interface User {
  id: string;
  name: string; // Unique Username
  gameName: string;
  email: string;
  phone: string;
  wallet: number;
  role: 'user' | 'admin';
  avatar: string;
  joinedMatchIds: string[]; 
}

export interface Tournament {
  id: string;
  title: string;
  entryFee: number;
  prizePool: number;
  slots: number;
  slotsFilled: number;
  startTime: string;
  status: 'available' | 'live' | 'complete';
  map: string;
  type: '1vs1' | '2vs2' | '4player';
  roomCode?: string;
  participantNames?: string[]; // Array of usernames who joined
}

export interface MatchHistory {
  id: string;
  tournamentId: string;
  title: string;
  date: string;
  entryFee: number;
  prizeWon: number;
  status: 'win' | 'loss' | 'pending';
  type: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'winning';
  status: 'pending' | 'success' | 'failed';
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'match';
  date: string;
  isRead: boolean;
}
