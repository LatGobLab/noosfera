import { Alert } from "react-native";
import { router } from "expo-router";
import supabase from "./supabase"; 
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';

export const useGoogleAuth = () => {

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'com.latgoblab.noosfera',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    // scopes: ['profile', 'email'],
    redirectUri: redirectUri, 

  });

  useEffect(() => {
    
    const handleSignInWithToken = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params; 
        if (id_token) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: id_token,
            // access_token: response.authentication?.accessToken // Opcional, si necesitas el access token también
          });

          if (error) {
            console.error("Supabase signInWithIdToken error:", error);
            Alert.alert("Error Supabase", `No se pudo iniciar sesión con Google: ${error.message}`);
          } else if (data.session) {
            console.log("Supabase session established:", data.session.user.email);
             router.replace("/(protected)"); 
          } else {
             Alert.alert("Error Supabase", "Inicio de sesión con Google exitoso, pero no se obtuvo sesión de Supabase.");
          }
        } else {
          Alert.alert("Error Google Auth", "No se recibió el ID Token de Google después de la autenticación.");
        }
      } else if (response?.type === 'error') {
        console.error("Google Auth Error:", response.error);
        Alert.alert("Error Google Auth", response.error?.message || "Ocurrió un error durante la autenticación con Google.");
      } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
        console.log("Autenticación con Google cancelada por el usuario.");
      }
    };

    handleSignInWithToken();
  }, [response]);

  const signInWithGoogle = async () => {
    try {
      await promptAsync(); 
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al iniciar Google Auth";
        console.error("Error calling promptAsync:", error);
        Alert.alert("Error inesperado", errorMessage);
    }
  };

  return {
    isAuthenticating: !!request && !response,
    signInWithGoogle 
  };
};