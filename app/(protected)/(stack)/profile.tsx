import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/src/stores/useAuthStore";
import ThemeSelector from "@/src/components/ThemeSelector";
import { router } from "expo-router";
import supabase from "@/src/lib/supabase";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import ToastExample from "@/src/components/ToastExample";

export default function ProfileScreen() {
  const session = useAuthStore((state) => state.session);
  const { profile, isLoading, error, refreshProfile } = useUserProfile();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const userEmail = session?.user?.email || "usuario@ejemplo.com";
  const userName = profile?.username || userEmail.split("@")[0] || "Usuario";
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    signOut();
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark pt-16">
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="items-center py-8 bg-blue-50 dark:bg-blue-900/20">
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={isDark ? "#60a5fa" : "#3b82f6"}
            />
          ) : (
            <>
              <View className="h-24 w-24 rounded-full bg-blue-200 dark:bg-blue-800 items-center justify-center mb-3">
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    className="h-24 w-24 rounded-full"
                  />
                ) : (
                  <Text className="text-3xl text-blue-600 dark:text-blue-300">
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {userName}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">
                {userEmail}
              </Text>
              {profile?.full_name && (
                <Text className="text-blue-500 dark:text-blue-400 mt-1">
                  {profile.full_name}
                </Text>
              )}
              <TouchableOpacity
                className="mt-3 p-2 bg-blue-100 dark:bg-blue-900 rounded-full"
                onPress={refreshProfile}
              >
                <Ionicons
                  name="refresh"
                  size={18}
                  color={isDark ? "#60a5fa" : "#3b82f6"}
                />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Profile Options */}
        <View className="p-4">
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Cuenta
            </Text>
            {[
              { icon: "person", label: "Información personal" },
              { icon: "notifications", label: "Notificaciones" },
              { icon: "shield-checkmark", label: "Privacidad y seguridad" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-4 border-b border-gray-200 dark:border-gray-800"
                onPress={() => router.push("/details")}
              >
                <View className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mr-3">
                  <Ionicons
                    name={`${item.icon}-outline` as any}
                    size={18}
                    color={isDark ? "#e5e7eb" : "#374151"}
                  />
                </View>
                <Text className="flex-1 text-gray-900 dark:text-gray-100">
                  {item.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Support */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Soporte
            </Text>
            {[
              { icon: "help-circle", label: "Centro de ayuda" },
              { icon: "information-circle", label: "Acerca de" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-4 border-b border-gray-200 dark:border-gray-800"
              >
                <View className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mr-3">
                  <Ionicons
                    name={`${item.icon}-outline` as any}
                    size={18}
                    color={isDark ? "#e5e7eb" : "#374151"}
                  />
                </View>
                <Text className="flex-1 text-gray-900 dark:text-gray-100">
                  {item.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Sign Out Button */}
        <View className="mb-32">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl items-center "
          >
            <Text className="text-red-600 dark:text-red-400 font-medium">
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
