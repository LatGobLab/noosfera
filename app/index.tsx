import supabase from "@/src/lib/supabase";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useLocationStore } from "@/src/stores/useLocationStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync();

export default function InitialScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const refreshLocation = useLocationStore((state) => state.refreshLocation);
  const router = useRouter();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Perform all initialization tasks
        await Promise.all([checkUser(), refreshLocation()]);
      } catch (error) {
        console.error("Error during app initialization:", error);
        router.replace("/(welcome)");
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
        router.replace("/(protected)/(tabs)");
      } else {
        router.replace("/(welcome)");
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session) {
          router.replace("/(protected)/(tabs)");
        } else {
          router.replace("/(welcome)");
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Error checking auth:", error);
      router.replace("/(welcome)");
    }
  }

  return null;
}
