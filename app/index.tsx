import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/theme";

export default function InitialScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const router = useRouter();
  const { activeTheme } = useTheme();

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
        router.replace("/(protected)");
      } else {
        router.replace("/welcome");
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
      <StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
      <ActivityIndicator
        size="large"
        color={activeTheme === "dark" ? "#ffffff" : "#0000ff"}
      />
    </View>
  );
}
