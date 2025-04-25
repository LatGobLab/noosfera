import { createClient } from "@supabase/supabase-js";
import { MMKV } from "react-native-mmkv";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const storage = new MMKV({
  id: 'supabase-auth-storage', 
  encryptionKey: supabaseAnonKey
});

const mmkvStorageAdapter = {
  getItem: (key: string): string | null => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.delete(key);
  },
};



if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;

