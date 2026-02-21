
export interface Account {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  walletAddress: string;
  vsdBalance: number;
  vsdLiteBalance: number;
  status: 'Active' | 'Suspended';
  joined: string;
  roles: ('admin' | 'advertiser' | 'user')[];
  lastLoginReward?: string;
  loginStreak?: number;
  lastStreakDay?: string;
}
