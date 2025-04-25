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
    // Clear user profile from MMKV
    userProfileStorage.delete(PROFILE_STORAGE_KEY);
    // Clear session
    set({ session: null });
  },
}));