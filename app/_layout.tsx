import { Stack } from "expo-router";
import "../global.css";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/src/services/queryClient";
import * as WebBrowser from "expo-web-browser";
import { useColorScheme } from "nativewind";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RootLayoutNavigation />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNavigation() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const statusBarColor = isDarkMode ? "#171717" : "#ffffff";
  const statusBarStyle = isDarkMode ? "light" : "dark";

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: isDarkMode ? "#ffffff" : "#ffffff",
        },
        statusBarBackgroundColor: statusBarColor,
        statusBarStyle: statusBarStyle,
        statusBarHidden: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(protected)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
