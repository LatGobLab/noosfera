import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

export default function ThemeSelector() {
  const { colorScheme, selectedPreference, setTheme } = useTheme();

  return (
    <View className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg my-4">
      <Text className="text-lg font-semibold mb-3 dark:text-white">
        Seleccionar Tema
      </Text>
      <View className="flex-row justify-around">
        {/* Botón Claro */}
        <TouchableOpacity
          onPress={() => setTheme("light")}
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
          onPress={() => setTheme("dark")}
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
          onPress={() => setTheme("system")}
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
