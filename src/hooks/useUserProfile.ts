import { useEffect } from 'react';
import { useUserProfileStore, UserProfile } from '@/src/stores/useUserProfileStore';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { userProfileStorage, PROFILE_STORAGE_KEY } from '@/src/lib/mmkvStorage';
import supabase from '@/src/lib/supabase';

export function useUserProfile() {
  const session = useAuthStore((state) => state.session);
  const { 
    profile, 
    isLoading, 
    error, 
    setProfile, 
    setLoading, 
    setError, 
    clearProfile 
  } = useUserProfileStore();

  const fetchUserProfile = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      
      // Check if profile exists in MMKV storage
      const storedProfileJson = userProfileStorage.getString(PROFILE_STORAGE_KEY);
      
      if (storedProfileJson) {
        // If profile exists in storage, parse and load it
        try {
          const storedProfile = JSON.parse(storedProfileJson);
          // Make sure the stored profile is for the current user
          if (storedProfile && storedProfile.id === session.user.id) {
            setProfile(storedProfile);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing stored profile', error);
          // Continue to fetch from API if parsing fails
        }
      }
      
      // If profile doesn't exist in storage or is for a different user, fetch from Supabase
      const { data, error: supabaseError, status } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', session.user.id)
        .single();
      
      console.log("Solicitud de perfil de usuario:", data);
      if (supabaseError && status !== 406) {
        throw supabaseError;
      }

      // Create profile object with user ID
      const userProfile: UserProfile = {
        id: session.user.id,
        username: data?.username || null,
        full_name: data?.full_name || null,
        avatar_url: data?.avatar_url || null
      };
      
      // Save to Zustand store
      setProfile(userProfile);
      
      // Save to MMKV storage
      userProfileStorage.set(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error instanceof Error ? error : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // Clear profile when user signs out
  const clearUserProfile = () => {
    clearProfile();
    userProfileStorage.delete(PROFILE_STORAGE_KEY);
  };

  // Fetch profile when session changes
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    } else {
      clearUserProfile();
    }
  }, [session?.user?.id]);

  return {
    profile,
    isLoading,
    error,
    refreshProfile: fetchUserProfile,
    clearUserProfile
  };
} 