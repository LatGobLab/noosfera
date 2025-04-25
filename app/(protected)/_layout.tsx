import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useUserProfile } from "@/src/hooks/useUserProfile";

export default function ProtectedLayout() {
  const session = useAuthStore((state) => state.session);
  const { profile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/(auth)");
      return;
    }

    if (!isLoading && profile && profile.username === null) {
      router.push("/(protected)/complete-profile");
    }
  }, [session, profile, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(stack)" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="complete-profile"
        options={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen name="index" redirect={true} />
    </Stack>
  );
}
