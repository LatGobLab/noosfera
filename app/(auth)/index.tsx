import { Link, router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useColorScheme } from "nativewind";
export default function Welcome() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark px-4">
      <View className="flex-1 items-center justify-center">
        <Image
          source={
            isDarkMode
              ? require("@/assets/images/noosferaWhite.png")
              : require("@/assets/images/noosferaBlack.png")
          }
          className="w-52 h-52 mb-4"
          resizeMode="contain"
        />
        <Text className="text-lg mt-2 text-black dark:text-slate-300">
          Conecta, visualiza y comparte tu ciudad
        </Text>
      </View>
      <View className="items-center justify-center w-full px-10 mb-28">
        <Pressable
          className="dark:bg-white bg-[#1E1E1E] w-full py-3 rounded-2xl items-center justify-center"
          onPress={() => router.push("/login")}
        >
          <Text className="text-white dark:text-black font-semibold">
            Iniciar sesión
          </Text>
        </Pressable>
        <TouchableOpacity className="mt-8">
          <Text
            className="text-black dark:text-white"
            onPress={() => router.push("/register")}
          >
            ¿Aún no tienes cuenta?
            <Text className="font-extrabold"> Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
