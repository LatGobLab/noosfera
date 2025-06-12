import React from "react";
import { View, Text } from "react-native";

type ReportErrorStateProps = {
  error?: Error | null;
  reportId?: number | null;
};

export const ReportErrorState = ({
  error,
  reportId,
}: ReportErrorStateProps) => {
  return (
    <View className="flex-1 items-center justify-center py-8 px-4">
      <Text className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
        Error al cargar el reporte
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-center">
        {error?.message || "No se pudieron cargar los detalles del reporte"}
      </Text>
      {reportId && (
        <Text className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          ID del reporte: {reportId}
        </Text>
      )}
    </View>
  );
};
