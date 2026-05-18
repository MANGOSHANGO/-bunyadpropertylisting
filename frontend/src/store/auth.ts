import { create } from 'zustand';
import { supabase } from '../api/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  restoreAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  restoreAuth: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
        };
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Error restoring auth:', error);
    }
  },
}));
