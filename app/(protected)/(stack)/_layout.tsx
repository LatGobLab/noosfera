import ThemeSelector from "@/src/components/ThemeSelector";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { StyleSheet, View } from "react-native";

export default function StackLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "#0d0f15" : "#ffffff";

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor,
          },
          headerTintColor: isDark ? "#ffffff" : "#000000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: { backgroundColor },
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen
          name="details"
          options={{
            title: "Detalles",
            headerShown: true,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: "Perfil",
            headerShown: true,
            presentation: "card",
            headerTransparent: true,
            headerTitleAlign: "center",
            headerRight: () => <ThemeSelector />,
          }}
        />
        <Stack.Screen
          name="report"
          options={{
            title: "Reportar Incidente",
            headerTitleAlign: "center",
            headerShown: true,
          }}
        />
      </Stack>
    </View>
  );
}
