import { create } from 'zustand';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

// 🔸 User 型（必要に応じて拡張）
interface User {
  uid: string;
  name: string;
  email: string;
  bio: string;
  role: ('composer' | 'lyricist' | 'unknown')[];
  photoURL?: string;
}

// 🔸 Zustand ストアの型
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (uid: string, updates: Partial<User>) => Promise<void>;
  
}

// ✅ Zustand ストアの実装
export const useUserStore = create<UserState & { showEveryComp: () => void }>((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  showEveryComp: () => {
    const user = get().user;
    console.log('Current user data:', user);
  },

  updateUser: async (uid, updates) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);

    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));
