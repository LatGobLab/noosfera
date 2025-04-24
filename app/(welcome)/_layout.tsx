import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function StackLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#171717" : "#ffffff",
        },
        headerTintColor: isDark ? "#ffffff" : "#000000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Bienvenido de nuevo",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
