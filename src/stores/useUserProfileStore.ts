import { create } from 'zustand';
import { UserProfile } from '../types/user';


interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearProfile: () => set({ profile: null, error: null }),
})); 