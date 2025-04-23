import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter, Redirect } from "expo-router";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function ProtectedLayout() {
  const session = useAuthStore((state) => state.session);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/(welcome)");
    }
  }, [session]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(stack)" options={{ presentation: "modal" }} />
      <Stack.Screen name="index" redirect={true} />
    </Stack>
  );
}
