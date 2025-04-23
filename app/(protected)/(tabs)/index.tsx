import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useLocationStore } from "@/src/stores/useLocationStore";
import LocationRefresher from "@/src/components/LocationRefresher";

export default function Home() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const { latitude, longitude } = useLocationStore();

  const goToDetails = (id: string) => {
    router.push(`/(protected)/(stack)/details?id=${id}`);
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Bienvenido: {latitude} {longitude}
          </Text>
          <LocationRefresher />
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Explora tu dashboard y descubre nuevas posibilidades
          </Text>
        </View>

        {/* Featured Card */}
        <View className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-semibold text-blue-800 dark:text-blue-300">
              Destacado
            </Text>
            <TouchableOpacity onPress={() => goToDetails("featured")}>
              <Text className="text-blue-600 dark:text-blue-400">Ver más</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-gray-700 dark:text-gray-300 mb-4">
            Descubre las últimas actualizaciones y novedades de la plataforma.
          </Text>
        </View>

        {/* Activity Section */}
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Actividad reciente
          </Text>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-row items-center py-3 border-b border-gray-200 dark:border-gray-800"
              onPress={() => goToDetails(`activity-${item}`)}
            >
              <View className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-gray-100 font-medium">
                  Actividad {item}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Hace {item} hora{item > 1 ? "s" : ""}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Actividad reciente
          </Text>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-row items-center py-3 border-b border-gray-200 dark:border-gray-800"
              onPress={() => goToDetails(`activity-${item}`)}
            >
              <View className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-gray-100 font-medium">
                  Actividad {item}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Hace {item} hora{item > 1 ? "s" : ""}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Actividad reciente
          </Text>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-row items-center py-3 border-b border-gray-200 dark:border-gray-800"
              onPress={() => goToDetails(`activity-${item}`)}
            >
              <View className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-gray-100 font-medium">
                  Actividad {item}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Hace {item} hora{item > 1 ? "s" : ""}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Actividad reciente
          </Text>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-row items-center py-3 border-b border-gray-200 dark:border-gray-800"
              onPress={() => goToDetails(`activity-${item}`)}
            >
              <View className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-gray-100 font-medium">
                  Actividad {item}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Hace {item} hora{item > 1 ? "s" : ""}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Actividad reciente
          </Text>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-row items-center py-3 border-b border-gray-200 dark:border-gray-800"
              onPress={() => goToDetails(`activity-${item}`)}
            >
              <View className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-gray-100 font-medium">
                  Actividad {item}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Hace {item} hora{item > 1 ? "s" : ""}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Actividad reciente
          </Text>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-row items-center py-3 border-b border-gray-200 dark:border-gray-800"
              onPress={() => goToDetails(`activity-${item}`)}
            >
              <View className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-gray-100 font-medium">
                  Actividad {item}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Hace {item} hora{item > 1 ? "s" : ""}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* Quick Actions */}
        <View>
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Acciones rápidas
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {["Perfil", "Mapa", "Configuración", "Ayuda"].map((action) => (
              <TouchableOpacity
                key={action}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-3 w-[48%]"
                onPress={() => goToDetails(action.toLowerCase())}
              >
                <Text className="text-center text-gray-800 dark:text-gray-200">
                  {action}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
