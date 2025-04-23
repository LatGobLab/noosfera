import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";

// Define valid icon names for type safety
type IconName = "home" | "map" | "person" | "settings-outline";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          width: "30%",
          bottom: 20,
          left: 20,
          right: 20,
          marginLeft: "5%",
          elevation: 50,
          borderRadius: 30,
          height: 56,
          backgroundColor: "#171717",
          borderTopWidth: 0,
          paddingHorizontal: 0,
          overflow: "hidden",
          paddingTop: 7,
        },
        tabBarItemStyle: {
          flex: 1,
          height: 56,
          alignItems: "center",
          justifyContent: "center",
        },
        headerStyle: {
          backgroundColor: isDark ? "#171717" : "#ffffff",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerTintColor: isDark ? "#ffffff" : "#000000",
        tabBarActiveTintColor: "#FFFFFF", // Blanco para el ícono activo
        tabBarInactiveTintColor: "#666666", // Gris para los inactivos
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name="home"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name="map"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name="person"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          headerRight: () => (
            <Pressable className="mr-4" onPress={() => {}}>
              <Ionicons
                name="settings-outline"
                size={24}
                color={isDark ? "#ffffff" : "#000000"}
              />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}

function TabBarIcon({
  name,
  color,
  size,
  focused,
}: {
  name: IconName;
  color: string;
  size: number;
  focused: boolean;
}) {
  return (
    <View
      className={`items-center justify-center ${
        focused ? "bg-white dark:bg-white" : "bg-transparent"
      } rounded-full w-10 h-10 flex`}
    >
      <Ionicons
        name={focused ? name : (`${name}` as any)}
        size={24} // Tamaño fijo para asegurar consistencia
        color={focused ? "#000000" : color} // Negro si está activo, sino el color pasado
      />
    </View>
  );
}
