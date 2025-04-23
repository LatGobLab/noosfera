import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/src/services/queryClient";
import { Platform, AppState } from "react-native";
import * as Network from "expo-network";

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
          name="login"
          options={{
            headerShown: true,
            headerBackTitle: "Volver",
            headerTitleAlign: "center",

            headerTitleStyle: {
              fontSize: 22,
            },
            headerStyle: {
              backgroundColor: isDarkMode ? "#171717" : "#ffffff",
            },
            headerShadowVisible: false,
            headerTintColor: isDarkMode ? "#ffffff" : "#171717",
            title: "Bienvenido de vuelta",
            animation: "ios_from_right",
            animationDuration: 200,
            gestureEnabled: true,
            animationTypeForReplace: "pop",
          }}
        />
        <Stack.Screen
          name="welcome"
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
          name="register"
          options={{
            headerShown: true,
            headerBackTitle: "Volver",
            headerTransparent: true,
            headerTintColor: isDarkMode ? "#ffffff" : "#171717",
            title: "Registrate",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontSize: 22,
            },
            headerShadowVisible: false,
            animation: "ios_from_right",
            animationDuration: 200,
            gestureEnabled: true,
            animationTypeForReplace: "pop",
          }}
        />
      </Stack>
    </View>
  );
}
