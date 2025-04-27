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
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useEffect } from "react";
import { Image } from "expo-image";
import {
  HeaderVisibilityProvider,
  useHeaderVisibility,
} from "@/src/contexts/HeaderVisibilityContext";

type IconName = "home" | "map" | "person" | "settings-outline";

function TabsLayoutContent() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { profile, isLoading } = useUserProfile();
  const router = useRouter();
  const { scrollY, headerHeight } = useHeaderVisibility();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, -headerHeight],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.8],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity: opacity,
    };
  });

  useEffect(() => {
    if (!isLoading && profile && profile.username === null) {
      router.replace("/(protected)/complete-profile");
    }
  }, [profile, isLoading]);

  const handleProfilePress = () => {
    router.push("/(protected)/(stack)/profile");
  };

  const AnimatedHeaderContainer = Animated.View;

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
        header: ({ options, route, navigation }) => {
          const title = options.title || route.name;
          return (
            <AnimatedHeaderContainer
              style={[
                styles.headerBase,
                { backgroundColor: isDark ? "#171717" : "#ffffff" },
                headerAnimatedStyle,
              ]}
            >
              <View
                style={[
                  styles.headerContentContainer,
                  { borderBottomColor: isDark ? "#222222" : "#f0f0f0" },
                ]}
              >
                <Text
                  style={[
                    styles.headerTitle,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  {title}
                </Text>
                {route.name === "index" && (
                  <View>
                    {isLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={isDark ? "#FFFFFF" : "#000000"}
                      />
                    ) : profile?.avatar_url ? (
                      <Pressable onPress={handleProfilePress}>
                        <Image
                          source={{ uri: profile.avatar_url }}
                          style={styles.avatarImage}
                          contentFit="cover"
                        />
                      </Pressable>
                    ) : (
                      <Pressable onPress={handleProfilePress}>
                        <View
                          style={styles.placeholderAvatar}
                          className="bg-gray-300 dark:bg-gray-600 mr-2"
                        >
                          <Ionicons
                            name="person"
                            size={20}
                            color={isDark ? "#171717" : "#666666"}
                          />
                        </View>
                      </Pressable>
                    )}
                  </View>
                )}
              </View>
            </AnimatedHeaderContainer>
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
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <HeaderVisibilityProvider>
      <TabsLayoutContent />
    </HeaderVisibilityProvider>
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
        size={24}
        color={focused ? "#000000" : color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBase: {
    width: "100%",
    height: 56,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: "hidden",
  },
  headerContentContainer: {
    height: "100%",
    width: "100%",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
