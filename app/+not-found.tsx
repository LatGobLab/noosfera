import React from "react";
import { View, Image } from "react-native";
import { useColorScheme } from "nativewind";
import { Stack } from "expo-router";

export default function NotFoundScreen() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Image
          source={
            isDarkMode
              ? require("@/assets/images/noosferaWhite.png")
              : require("@/assets/images/noosferaBlack.png")
          }
          className="w-52 h-52 mb-4"
          resizeMode="contain"
        />
      </View>
    </>
  );
}
