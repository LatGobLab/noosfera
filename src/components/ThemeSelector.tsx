import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function ThemeSelector() {
  const { colorScheme, selectedPreference, setTheme } = useTheme();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const isDark = colorScheme === "dark";

  // Close dropdown when clicked outside
  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const themeOptions = [
    {
      value: "light",
      label: "Claro",
      icon: "sunny-outline" as const,
    },
    {
      value: "dark",
      label: "Oscuro",
      icon: "moon-outline" as const,
    },
    {
      value: "system",
      label: "Sistema",
      icon: "phone-portrait-outline" as const,
    },
  ];

  // Get current theme icon
  const getCurrentThemeIcon = () => {
    switch (selectedPreference) {
      case "light":
        return "sunny-outline" as const;
      case "dark":
        return "moon-outline" as const;
      case "system":
        return "phone-portrait-outline" as const;
      default:
        return "sunny-outline" as const;
    }
  };

  return (
    <View className="relative ">
      <TouchableOpacity
        onPress={() => setDropdownVisible(!dropdownVisible)}
        accessibilityLabel="Selector de tema"
        hitSlop={{ top: 10, bottom: 10, left: 30, right: 30 }}
      >
        <Ionicons
          name={getCurrentThemeIcon()}
          size={29}
          color={isDark ? "white" : "black"}
        />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      <Modal
        transparent={true}
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <Pressable className="flex-1" onPress={closeDropdown}>
          <View className="absolute top-12 right-4 bg-white dark:bg-gray-800 rounded-md shadow-md z-50 w-40">
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setTheme(option.value as "light" | "dark" | "system");
                  closeDropdown();
                }}
                className={`flex-row items-center p-3 border-b border-gray-100 dark:border-gray-700 ${
                  selectedPreference === option.value
                    ? "bg-blue-50 dark:bg-blue-900"
                    : ""
                }`}
              >
                <Ionicons
                  name={option.icon}
                  size={18}
                  color={
                    selectedPreference === option.value
                      ? "#3b82f6"
                      : isDark
                      ? "white"
                      : "black"
                  }
                />
                <Text
                  className={`ml-2 ${
                    selectedPreference === option.value
                      ? "font-medium text-blue-500 dark:text-blue-300"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {option.label}
                </Text>
                {selectedPreference === option.value && (
                  <View className="ml-auto">
                    <Ionicons
                      name={"checkmark" as const}
                      size={16}
                      color="#3b82f6"
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
