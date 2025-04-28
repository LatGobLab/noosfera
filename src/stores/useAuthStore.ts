import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { userProfileStorage, PROFILE_STORAGE_KEY } from '@/src/lib/mmkvStorage';

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  signOut: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  signOut: () => {
    userProfileStorage.delete(PROFILE_STORAGE_KEY);
    set({ session: null });
  },
}));