import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const statusBarColor = isDarkMode ? "#171717" : "#ffffff";
  const statusBarStyle = isDarkMode ? "light" : "dark";

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-neutral-900" : "bg-white"}`}>
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
            headerStyle: {
              backgroundColor: isDarkMode ? "#171717" : "#ffffff",
            },
            headerTintColor: isDarkMode ? "#ffffff" : "#000000",
            statusBarBackgroundColor: isDarkMode ? "#171717" : "#ffffff",
            statusBarStyle: statusBarStyle,
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
        <Stack.Screen name="register" />
      </Stack>
    </View>
  );
}
