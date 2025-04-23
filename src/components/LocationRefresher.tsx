import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocationStore } from "@/src/stores/useLocationStore";

export default function LocationRefresher() {
  const { latitude, longitude, errorMsg, isLoading, refreshLocation } =
    useLocationStore();

  return (
    <View className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg m-4 shadow-sm">
      <Text className="text-lg font-semibold mb-2 dark:text-white">
        Ubicación actual
      </Text>

      {isLoading ? (
        <ActivityIndicator size="small" className="my-2" />
      ) : (
        <View>
          {errorMsg ? (
            <Text className="text-red-500">{errorMsg}</Text>
          ) : (
            <View className="mb-3">
              <Text className="dark:text-gray-300">
                Latitud:{" "}
                {latitude !== null ? latitude.toFixed(6) : "No disponible"}
              </Text>
              <Text className="dark:text-gray-300">
                Longitud:{" "}
                {longitude !== null ? longitude.toFixed(6) : "No disponible"}
              </Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={refreshLocation}
        className="bg-blue-500 py-2 px-4 rounded-md items-center mt-2"
        disabled={isLoading}
      >
        <Text className="text-white font-medium">
          {isLoading ? "Actualizando..." : "Actualizar ubicación"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
