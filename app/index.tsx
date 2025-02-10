import { View, Text, Pressable } from "react-native";
import ThemeToggle from "../components/ThemeToggle";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  const { theme, setTheme } = useTheme();

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <StatusBar style="auto" />
      <Text className="text-black dark:text-white text-2xl font-bold">
        Modo Oscuro
      </Text>
    </View>
  );
}
