// app/index.tsx
import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
      // Verificar sesión inicial
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        router.replace("/(protected)");
      } else {
        router.replace("/welcome");
      }

      // Suscribirse a cambios de autenticación
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

  // Mostrar un indicador de carga mientras se verifica la sesión
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <StatusBar style="dark" />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
