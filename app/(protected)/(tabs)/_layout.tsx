import { Tabs, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  View,
  Text,
  ActivityIndicator,
  Animated,
  StyleSheet,
  Easing,
} from "react-native";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useEffect, useRef } from "react";
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
  const { isHeaderVisible } = useHeaderVisibility();
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const headerHeight = useRef(new Animated.Value(56)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerTranslateY, {
        toValue: isHeaderVisible ? 0 : -56,
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(headerHeight, {
        toValue: isHeaderVisible ? 56 : 0,
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }),
      Animated.timing(headerOpacity, {
        toValue: isHeaderVisible ? 1 : 0,
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isHeaderVisible]);

  useEffect(() => {
    if (!isLoading && profile && profile.username === null) {
      router.replace("/(protected)/complete-profile");
    }
  }, [profile, isLoading]);

  const handleProfilePress = () => {
    router.push("/(protected)/(stack)/profile");
  };

  const AnimatedHeaderBackground = Animated.createAnimatedComponent(View);
  const AnimatedHeaderContainer = Animated.createAnimatedComponent(View);

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
              style={{
                backgroundColor: isDark ? "#171717" : "#ffffff",
                position: "relative",
                zIndex: 100,
                height: headerHeight,
                overflow: "hidden",
              }}
            >
              <AnimatedHeaderBackground
                style={[
                  styles.headerContainer,
                  {
                    transform: [{ translateY: headerTranslateY }],
                    opacity: headerOpacity,
                    backgroundColor: isDark ? "#171717" : "#ffffff",
                    borderBottomColor: isDark ? "#222222" : "#f0f0f0",
                  },
                ]}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: isDark ? "#ffffff" : "#000000",
                  }}
                >
                  {title}
                </Text>
                {route.name === "index" && (
                  <View>
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
                )}
              </AnimatedHeaderBackground>
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
  headerContainer: {
    width: "100%",
    height: 56,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 5,
    zIndex: 100,
  },
});
