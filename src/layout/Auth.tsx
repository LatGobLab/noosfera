import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  TextInput,
  Text,
  AppState,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import supabase from "@/src/lib/supabase";
import { useColorScheme } from "nativewind";
import * as SystemUI from "expo-system-ui";
import { router } from "expo-router";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  const [showPassword, setShowPassword] = useState(false);

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
    <View className="flex-1">
      <View className="flex-1 ">
        <View className="flex h-28 pt-14 justify-center items-center rounded-b-full">
          <Text className="text-black dark:text-white text-2xl text-center">
            Inicia con tu cuenta
          </Text>
        </View>

        <View className=" rounded-tl-[3.0rem] flex-1  w-screen">
          <View className="space-y-4 mt-10">
            <TextInput
              className="bg-white dark:bg-neutral-800 text-black dark:text-white border border-neutral-700 dark:border-neutral-700  w-11/12 mx-auto p-4 h-14 rounded-2xl"
              placeholder="Correo Electrónico"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            {/* Campo de contraseña */}
            <View className="relative mt-10">
              <TextInput
                className="bg-white dark:bg-neutral-800 text-black dark:text-white border border-neutral-700 dark:border-neutral-700  w-11/12 mx-auto p-4 h-14 rounded-2xl"
                placeholder="Contraseña"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                className="absolute right-10 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* Botón de Iniciar Sesión */}
            <TouchableOpacity
              className="bg-black dark:bg-white  rounded-full h-14 flex items-center justify-center mt-10 w-5/6 mx-auto"
              onPress={signInWithEmail}
            >
              <Text className="text-white dark:text-black font-semibold text-lg">
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>

          {/* Separador O */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-0.5 bg-neutral-700" />
            <Text className="mx-4 text-neutral-400">O</Text>
            <View className="flex-1 h-0.5 bg-neutral-700" />
          </View>

          {/* Botones de inicio de sesión con redes sociales */}
          <View className="flex-1 justify-between ">
            <View className="space-y-3 gap-5">
              {/* Google */}
              <TouchableOpacity className="flex-row items-center justify-center bg-transparent border border-neutral-700 rounded-full h-14 w-11/12 mx-auto">
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
                  }}
                  className="w-6 h-6 mr-2"
                />
                <Text className="text-black dark:text-white font-medium">
                  Ingresa con Google
                </Text>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity className="flex-row items-center justify-center bg-transparent border border-neutral-700 rounded-full h-14 w-11/12 mx-auto">
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
                  }}
                  className="w-6 h-6 mr-2"
                />
                <Text className="text-black dark:text-white font-medium">
                  Ingresa con Facebook
                </Text>
              </TouchableOpacity>

              {/* Apple */}
              <TouchableOpacity className="flex-row items-center justify-center bg-transparent border border-neutral-700 rounded-full h-14 w-11/12 mx-auto  ">
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/0/747.png",
                  }}
                  className="w-6 h-6 mr-2"
                />
                <Text className="text-black dark:text-white font-medium">
                  Ingresa con Apple
                </Text>
              </TouchableOpacity>
            </View>

            {/* Enlace para registrarse */}
            <View className="flex-row justify-center mt-8 mb-20">
              <Text className="text-black dark:text-white text-xl">
                ¿Aún no tienes cuenta?
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className="text-black dark:text-white font-bold ml-1  text-xl">
                  regístrate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
