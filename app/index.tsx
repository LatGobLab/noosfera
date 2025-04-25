import supabase from "@/src/lib/supabase";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useLocationStore } from "@/src/stores/useLocationStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useUserProfile } from "@/src/hooks/useUserProfile";

// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync();

export default function InitialScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const refreshLocation = useLocationStore((state) => state.refreshLocation);
  const { refreshProfile } = useUserProfile();
  const router = useRouter();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Perform all initialization tasks
        await Promise.all([checkUser(), refreshLocation()]);
      } catch (error) {
        console.error("Error during app initialization:", error);
        router.replace("/(auth)");
      } finally {
        // Mark the app as ready
        setIsAppReady(true);
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  async function checkUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        // If we have a session, also load the user profile
        await refreshProfile();
        router.replace("/(protected)");
      } else {
        router.replace("/(auth)");
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session) {
          router.replace("/(protected)");
        } else {
          router.replace("/(auth)");
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Error checking auth:", error);
      router.replace("/(auth)");
    }
  }

  return null;
}
