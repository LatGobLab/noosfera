import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { StyleSheet, View } from "react-native";

export default function StackLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "#171717" : "#ffffff";

  return (
    <View style={[styles.container, { backgroundColor }]}>
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
          animation: "fade",
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
            title: "Profile",
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
