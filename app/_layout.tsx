import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import supabase from "@/lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";
import "../global.css";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(protected)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
