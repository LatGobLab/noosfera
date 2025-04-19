import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import supabase from "@/src/lib/supabase";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function MapScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    signOut();
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Mapa
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Explora ubicaciones cercanas
          </Text>
        </View>

        {/* Map Placeholder */}
        <View className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6 items-center justify-center">
          <Ionicons
            name="map-outline"
            size={48}
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
          <Text className="text-gray-500 dark:text-gray-400 mt-2">
            Mapa en desarrollo
          </Text>
        </View>

        {/* Location Options */}
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Ubicaciones destacadas
          </Text>
          {["Ubicación 1", "Ubicación 2", "Ubicación 3"].map(
            (location, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-4 border-b border-gray-200 dark:border-gray-800"
              >
                <View className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center mr-3">
                  <Ionicons
                    name="location"
                    size={18}
                    color={isDark ? "#93c5fd" : "#3b82f6"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-gray-100 font-medium">
                    {location}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    A {(index + 1) * 2} km de distancia
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl items-center"
        >
          <Text className="text-red-600 dark:text-red-400 font-medium">
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
