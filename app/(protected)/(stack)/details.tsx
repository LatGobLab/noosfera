import React from "react";
import { View, Text, ActivityIndicator, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMapDetails } from "@/src/hooks/useMapDetails";
import { useColorScheme } from "nativewind";

export default function Details() {
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Convertir el ID a número
  const reportId = typeof id === "string" ? parseInt(id, 10) : 0;

  // Usar el hook para obtener los detalles del reporte
  const {
    data: reporteDetails,
    isLoading,
    error,
    isError,
  } = useMapDetails(reportId);

  // Estado de carga
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator
          size="large"
          color={isDark ? "#60a5fa" : "#3b82f6"}
        />
        <Text className="text-gray-600 dark:text-gray-400 mt-4">
          Cargando detalles del reporte...
        </Text>
      </View>
    );
  }

  // Estado de error
  if (isError || !reporteDetails) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark px-4">
        <Text className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          Error al cargar el reporte
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          {error?.message || "No se pudieron cargar los detalles del reporte"}
        </Text>
        <Text className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          ID del reporte: {id}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1 p-4">
        {/* Header del reporte */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Detalles del Reporte
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            ID: {reporteDetails.id_reporte}
          </Text>
        </View>

        {/* Información del usuario */}
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Información del Usuario
          </Text>

          <View className="flex-row items-center mb-3">
            {reporteDetails.profile_avatar_url ? (
              <Image
                source={{ uri: reporteDetails.profile_avatar_url }}
                className="w-12 h-12 rounded-full mr-3"
                style={{ backgroundColor: isDark ? "#374151" : "#f3f4f6" }}
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3" />
            )}

            <View className="flex-1">
              <Text className="font-semibold text-gray-900 dark:text-gray-100">
                {reporteDetails.profile_username || "Usuario Anónimo"}
              </Text>
              {reporteDetails.nombre_organizacion && (
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {reporteDetails.nombre_organizacion}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Información del reporte */}
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Detalles del Reporte
          </Text>

          <View className="space-y-2">
            <View className="flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tipo de Reporte
              </Text>
              <Text className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                {reporteDetails.tipo_nombre || "No especificado"}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Usuario ID
              </Text>
              <Text className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {reporteDetails.fk_reporte_users}
              </Text>
            </View>
          </View>
        </View>

        {/* Espacio adicional para contenido futuro */}
        <View className="mb-8">
          <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">
            Más detalles próximamente...
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
