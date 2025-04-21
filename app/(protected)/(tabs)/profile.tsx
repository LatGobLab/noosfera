import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/src/stores/useAuthStore";
import ThemeSelector from "@/src/components/themeSelector";
import { router } from "expo-router";
import supabase from "@/src/lib/supabase";
import { useTheme } from "@/src/context/ThemeContext";

export default function ProfileScreen() {
  const session = useAuthStore((state) => state.session);
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const userEmail = session?.user?.email || "usuario@ejemplo.com";
  const userName = userEmail.split("@")[0] || "Usuario";
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    signOut();
  };
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="items-center py-8 bg-blue-50 dark:bg-blue-900/20">
          <View className="h-24 w-24 rounded-full bg-blue-200 dark:bg-blue-800 items-center justify-center mb-3">
            <Text className="text-3xl text-blue-600 dark:text-blue-300">
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {userName}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">{userEmail}</Text>
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

          {/* Appearance */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Apariencia
            </Text>
            <ThemeSelector />
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
