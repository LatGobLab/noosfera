import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_PREFERENCE_KEY = "@MyApp:themePreference";

export default function ThemeSelector() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const [selectedPreference, setSelectedPreference] = useState("system");

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem(
          THEME_PREFERENCE_KEY
        );
        if (storedPreference !== null) {
          setSelectedPreference(
            storedPreference as "light" | "dark" | "system"
          );
        }
      } catch (e) {
        console.error("Failed to load theme preference.", e);
      }
    };
    loadPreference();
  }, []);

  const handleSetPreference = async (
    preference: "light" | "dark" | "system"
  ) => {
    setColorScheme(preference);
    setSelectedPreference(preference);

    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference);
    } catch (e) {
      console.error("Failed to save theme preference.", e);
    }
  };

  return (
    <View className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg my-4">
      <Text className="text-lg font-semibold mb-3 dark:text-white">
        Seleccionar Tema
      </Text>
      <View className="flex-row justify-around">
        {/* Botón Claro */}
        <TouchableOpacity
          onPress={() => handleSetPreference("light")}
          className={`py-2 px-4 rounded ${
            selectedPreference === "light"
              ? "bg-blue-500"
              : "bg-gray-200 dark:bg-gray-600"
          }`}
        >
          <Text
            className={`${
              selectedPreference === "light"
                ? "text-white"
                : "text-black dark:text-white"
            }`}
          >
            Claro
          </Text>
        </TouchableOpacity>

        {/* Botón Oscuro */}
        <TouchableOpacity
          onPress={() => handleSetPreference("dark")}
          className={`py-2 px-4 rounded ${
            selectedPreference === "dark"
              ? "bg-blue-500"
              : "bg-gray-200 dark:bg-gray-600"
          }`}
        >
          <Text
            className={`${
              selectedPreference === "dark"
                ? "text-white"
                : "text-black dark:text-white"
            }`}
          >
            Oscuro
          </Text>
        </TouchableOpacity>

        {/* Botón Sistema */}
        <TouchableOpacity
          onPress={() => handleSetPreference("system")}
          className={`py-2 px-4 rounded ${
            selectedPreference === "system"
              ? "bg-blue-500"
              : "bg-gray-200 dark:bg-gray-600"
          }`}
        >
          <Text
            className={`${
              selectedPreference === "system"
                ? "text-white"
                : "text-black dark:text-white"
            }`}
          >
            Sistema
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Preferencia: {selectedPreference} / Tema Activo: {colorScheme}
      </Text>
    </View>
  );
}
