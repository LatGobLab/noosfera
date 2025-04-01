import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/theme";
import { useTheme } from "@/context/theme";
import { StatusBar } from "expo-status-bar";
import "../global.css";

function RootLayoutNav() {
  const { activeTheme } = useTheme();

  return (
    <>
      <StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
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
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
