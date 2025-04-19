import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function StackLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#171717" : "#ffffff",
        },
        headerTintColor: isDark ? "#ffffff" : "#000000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="details"
        options={{
          title: "Detalles",
          headerShown: true,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
