import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/src/services/queryClient";

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
  const { colorScheme } = useTheme();
  const isDarkMode = colorScheme === "dark";

  const statusBarColor = isDarkMode ? "#171717" : "#ffffff";
  const statusBarStyle = isDarkMode ? "light" : "dark";

  return (
    <View className={`flex-1`}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: isDarkMode ? "#171717" : "#ffffff",
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
          name="(welcome)"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack>
    </View>
  );
}
