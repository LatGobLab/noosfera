import { Tabs, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useEffect } from "react";
import { Image } from "expo-image";
import {
  HeaderVisibilityProvider,
  useHeaderVisibility,
} from "@/src/contexts/HeaderVisibilityContext";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import React from "react";

function TabsLayoutContent() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { profile, isLoading } = useUserProfile();
  const router = useRouter();
  const { headerTranslateY, headerHeight } = useHeaderVisibility();

  useEffect(() => {
    if (!isLoading && profile && profile.username === null) {
      router.replace("/(protected)/complete-profile");
    }
  }, [profile, isLoading]);

  const handleProfilePress = () => {
    router.push("/(protected)/(stack)/profile");
  };

  const handleReportPress = () => {
    router.push("/(protected)/(stack)/report");
  };

  const animatedHeaderContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  return (
    <>
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
          header: ({ options, route }) => {
            const title = options.title ?? route.name;
            return (
              <Animated.View
                style={[
                  styles.outerHeaderContainer,
                  animatedHeaderContainerStyle,
                  {
                    backgroundColor: isDark ? "#171717" : "#ffffff",
                    height: headerHeight,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.headerBase,
                    { backgroundColor: isDark ? "#171717" : "#ffffff" },
                  ]}
                >
                  <View style={styles.headerContent}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: isDark ? "#ffffff" : "#000000",
                      }}
                    >
                      {title}
                    </Text>

                    <View>
                      {isLoading ? (
                        <ActivityIndicator size="small" color={"#3b82f6"} />
                      ) : profile?.avatar_url ? (
                        <Pressable onPress={handleProfilePress}>
                          <Image
                            source={{ uri: profile.avatar_url }}
                            style={styles.profileImage}
                            contentFit="cover"
                          />
                        </Pressable>
                      ) : (
                        <Pressable onPress={handleProfilePress}>
                          <View
                            style={[
                              styles.profilePlaceholder,
                              {
                                backgroundColor: isDark ? "#555" : "#e0e0e0",
                              },
                            ]}
                          >
                            <Ionicons
                              name="person"
                              size={20}
                              color={isDark ? "#ccc" : "#666666"}
                            />
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </Animated.View>
              </Animated.View>
            );
          },
          headerTintColor: isDark ? "#ffffff" : "#000000",
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#666666",
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
        {/* Asegúrate de tener pantallas para 'person' y 'settings-outline' si las usas en TabBarIcon */}
      </Tabs>

      {/* Botón de reporte en la esquina inferior derecha */}
      <Pressable
        style={[
          styles.reportButton,
          { backgroundColor: isDark ? "#171717" : "#171717" },
        ]}
        onPress={handleReportPress}
      >
        <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
      </Pressable>
    </>
  );
}

export default function TabsLayout() {
  return (
    <HeaderVisibilityProvider>
      <TabsLayoutContent />
    </HeaderVisibilityProvider>
  );
}

type IconName = "home" | "map" | "person" | "settings-outline";

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
  const iconContainerClass = `items-center justify-center rounded-full w-10 h-10 flex ${
    focused ? "bg-white dark:bg-neutral-200" : "bg-transparent" // Ajuste de color dark
  }`;
  const iconColor = focused ? "#000000" : color;

  return (
    <View className={iconContainerClass}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as any)} // Asume patrón outline para inactivo
        size={24}
        color={iconColor}
      />
    </View>
  );
}

// Estilos con StyleSheet
const styles = StyleSheet.create({
  outerHeaderContainer: {
    overflow: "hidden", // Prevents content spill during animation
    position: "absolute", // Make the outer container absolute to lift off the content flow
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Ensure it's above other content
    borderBottomWidth: 1, // Keep the border on the outer container
    borderBottomColor: "transparent", // Adjust color as needed or based on theme
  },
  headerBase: {},
  headerContent: {
    height: 56, // Altura fija del contenido
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    // paddingTop: 5, // No necesario si la altura es fija
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Mitad del ancho/alto
    marginRight: 10,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10, // Ajustado para consistencia
  },
  reportButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 50,
  },
});
