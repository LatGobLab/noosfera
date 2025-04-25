import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { View, StyleSheet } from "react-native";

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
          animationDuration: 200,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
