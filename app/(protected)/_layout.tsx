import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { StyleSheet, View } from "react-native";
import { useColorScheme } from "nativewind";

export default function ProtectedLayout() {
  const session = useAuthStore((state) => state.session);
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "#171717" : "#ffffff";

  useEffect(() => {
    if (!session) {
      router.replace("/(auth)");
      return;
    }
  }, [session]);

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(stack)" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="complete-profile"
          options={{
            headerShown: false,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="index" redirect={true} />
      </Stack>
    </View>
  );
}
