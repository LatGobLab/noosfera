import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  TextInput,
  Pressable,
  Text,
  AppState,
} from "react-native";
import supabase from "@/src/lib/supabase";
import { useColorScheme } from "nativewind";
import * as SystemUI from "expo-system-ui";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const backgroundColor = colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF";
    SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [colorScheme]);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View className="flex-1 p-24 bg-white dark:bg-[#1E1E1E]">
      {/* --- Input de Email --- */}
      <View className="mb-6">
        <TextInput
          className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:text-white dark:bg-[#2E2E2E]"
          placeholder="email@address.com"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
        />
      </View>
      {/* --- Input de Contraseña --- */}
      <View className="mb-6">
        <TextInput
          className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:text-white dark:bg-[#2E2E2E]"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
        />
      </View>
      {/* --- Botones --- */}
      <Pressable
        className="w-full p-3 bg-[#1E1E1E] rounded-lg items-center justify-center dark:bg-white"
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text className="text-white font-bold dark:text-black">
          {loading ? "Loading..." : "Sign in"}
        </Text>
      </Pressable>
      <Pressable
        className="w-full p-3 mt-4 border border-[#1E1E1E] rounded-lg items-center justify-center dark:border-white"
        onPress={signUpWithEmail}
        disabled={loading}
      >
        <Text className="text-[#1E1E1E] font-bold dark:text-white">
          {loading ? "Loading..." : "Sign up"}
        </Text>
      </Pressable>
    </View>
  );
}
