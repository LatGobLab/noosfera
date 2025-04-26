import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { BackHandler } from "react-native";

export default function ProtectedLayout() {
  const session = useAuthStore((state) => state.session);
  const { profile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/(auth)");
      return;
    }
  }, [session]);

  return (
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
  );
}
