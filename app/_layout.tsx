import { Stack } from "expo-router";
import "../global.css";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/src/services/queryClient";
import { useColorScheme } from "nativewind";
import { HeaderVisibilityProvider } from "@/src/contexts/HeaderVisibilityContext";
import { ToastProvider } from "@/src/contexts/ToastContext";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <ThemeProvider>
              <HeaderVisibilityProvider>
                <RootLayoutNavigation />
              </HeaderVisibilityProvider>
            </ThemeProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNavigation() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const statusBarColor = isDarkMode ? "#0d0f15" : "#ffffff";
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
