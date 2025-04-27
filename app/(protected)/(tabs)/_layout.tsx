import { Tabs, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View, Text, ActivityIndicator } from "react-native";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useEffect } from "react";
import { Image } from "expo-image";

type IconName = "home" | "map" | "person" | "settings-outline";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { profile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && profile && profile.username === null) {
      router.replace("/(protected)/complete-profile");
    }
  }, [profile, isLoading]);

  const handleProfilePress = () => {
    router.push("/(protected)/(stack)/profile");
  };

  const image = profile?.avatar_url ? profile.avatar_url : null;

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
          title: "Feed",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name="home"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          headerRight: () => (
            <View className="">
              {isLoading ? (
                <ActivityIndicator size="large" color={"#3b82f6"} />
              ) : profile?.avatar_url ? (
                <Pressable onPress={handleProfilePress}>
                  <Image
                    source={{ uri: profile.avatar_url }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      marginRight: 10,
                    }}
                    contentFit="cover"
                  />
                </Pressable>
              ) : (
                <Pressable onPress={handleProfilePress}>
                  <View className="h-10 w-10 rounded-full bg-gray-300 items-center justify-center mr-5">
                    <Ionicons
                      name="person"
                      size={20}
                      color={isDark ? "#171717" : "#666666"}
                    />
                  </View>
                </Pressable>
              )}
            </View>
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
