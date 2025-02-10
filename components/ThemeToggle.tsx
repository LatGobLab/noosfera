import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <View className="flex-row justify-center items-center space-x-4 p-4 gap-14">
      <Pressable
        onPress={() => setTheme("light")}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
      >
        <Text className="text-black dark:text-white">Light</Text>
      </Pressable>
      <Pressable
        onPress={() => setTheme("dark")}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
      >
        <Text className="text-black dark:text-white">Dark</Text>
      </Pressable>
      <Pressable
        onPress={() => setTheme("system")}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
      >
        <Text className="text-black dark:text-white">System</Text>
      </Pressable>
    </View>
  );
}
