import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";

export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 items-center justify-around bg-white dark:bg-[#1E1E1E] px-4">
      <StatusBar style="auto" />
      <View className="items-center justify-center">
        <Text className="text-5xl font-bold text-black dark:text-white">
          Ciervo
        </Text>
        <Text className="text-lg mt-2 text-black dark:text-slate-300">
          Conecta, visualiza y comparte tu ciudad
        </Text>
      </View>
      <View className="mt-8 mb-6">
        <Image
          source={require("@/assets/bienvenida.png")}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
      </View>
      <View className="items-center justify-center w-full px-10 ">
        <Link href="/login" asChild>
          <Pressable className="dark:bg-white bg-[#1E1E1E] w-full py-3 rounded-2xl items-center justify-center">
            <Text className="text-white dark:text-black font-bold">
              Iniciar sesión
            </Text>
          </Pressable>
        </Link>
        <Link href="/register" asChild>
          <TouchableOpacity className="mt-8">
            <Text className="text-black dark:text-white">
              ¿Aún no tienes cuenta?
              <Text className="font-extrabold"> Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
