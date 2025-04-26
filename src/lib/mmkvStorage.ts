import { MMKV } from "react-native-mmkv";

export const userProfileStorage = new MMKV({
  id: 'user-profile-storage',
});

export const PROFILE_STORAGE_KEY = 'user-profile'; 