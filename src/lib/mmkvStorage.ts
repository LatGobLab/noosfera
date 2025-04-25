import { MMKV } from "react-native-mmkv";

// MMKV storage for user profiles
export const userProfileStorage = new MMKV({
  id: 'user-profile-storage',
});

// Key constants
export const PROFILE_STORAGE_KEY = 'user-profile'; 