import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Details() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
      <Text className="text-black dark:text-white text-xl font-bold">
        Details Screen
      </Text>
      <Text className="text-black dark:text-white mt-2">Item ID: {id}</Text>
    </View>
  );
}
