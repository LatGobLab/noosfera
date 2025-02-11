import React, { useState } from "react";
import {
  Alert,
  View,
  TextInput,
  Pressable,
  Text,
  AppState,
} from "react-native";
import supabase from "@/lib/supabase";

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
      <View className="mb-6">
        <TextInput
          className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:text-white dark:bg-[#2E2E2E]"
          placeholder="email@address.com"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View className="mb-6">
        <TextInput
          className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:text-white dark:bg-[#2E2E2E]"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
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
