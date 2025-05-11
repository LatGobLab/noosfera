import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { StyleSheet, View } from "react-native";

export default function StackLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "#171717" : "#ffffff";

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
            headerTitleAlign: "center",
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
        <Stack.Screen
          name="comentarios"
          options={{
            headerShown: false,
            presentation: "formSheet",
            gestureDirection: "vertical",
            animation: "slide_from_bottom",
            gestureEnabled: false,
            sheetGrabberVisible: false,
            sheetInitialDetentIndex: 0,
            sheetAllowedDetents: [0.9],
            sheetCornerRadius: 20,
            sheetExpandsWhenScrolledToEdge: false,
            sheetElevation: 24,
          }}
        />
      </Stack>
    </View>
  );
}
