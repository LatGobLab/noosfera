// googleAuth.tsx
import { Alert } from "react-native";
import { router } from "expo-router";
import supabase from "./supabase";
import * as Google from "expo-auth-session/providers/google";

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    iosClientId: "",
    // clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    // redirectUri: makeRedirectUri("http://localhost:8081"),
  });

  const signInWithGoogle = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      // First initiate the Google authentication flow
      const result = await promptAsync();
      if (result.type !== 'success') {
        return { success: false, error: "Autenticación de Google cancelada" };
      }

      // Then sign in with Supabase using the Google provider
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        Alert.alert("Error al iniciar sesión", error.message);
        return { success: false, error: error.message };
      }

      // Check if the sign-in was successful
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/(protected)");
        return { success: true };
      }

      return { success: false, error: "No se pudo iniciar sesión" };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      Alert.alert("Error inesperado", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    request,
    response,
    signInWithGoogle
  };
};

