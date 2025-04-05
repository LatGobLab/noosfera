import supabase from "@/src/lib/supabase";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function InitialScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        router.replace("/welcome");
      } else {
        router.replace("/login");
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session) {
          router.replace("/(protected)");
        } else {
          router.replace("/welcome");
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Error checking auth:", error);
      router.replace("/welcome");
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-[#1E1E1E]">
      <ActivityIndicator size="large" />
    </View>
  );
}
