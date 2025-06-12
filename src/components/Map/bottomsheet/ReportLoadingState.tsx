import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useColorScheme } from "nativewind";

export const ReportLoadingState = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 items-center justify-center py-8">
      <ActivityIndicator size="large" color={isDark ? "#60a5fa" : "#3b82f6"} />
      <Text className="text-gray-600 dark:text-gray-400 mt-4">
        Cargando detalles del reporte...
      </Text>
    </View>
  );
};
