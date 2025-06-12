import React from "react";
import { View, Text } from "react-native";

type ReportInfoSectionProps = {
  tipoNombre?: string | null;
  fkReporteUsers?: string | number | null;
};

export const ReportInfoSection = ({
  tipoNombre,
  fkReporteUsers,
}: ReportInfoSectionProps) => {
  return (
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
            {tipoNombre || "No especificado"}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Usuario ID
          </Text>
          <Text className="text-sm text-gray-900 dark:text-gray-100 font-mono ">
            {fkReporteUsers}
          </Text>
        </View>
      </View>
    </View>
  );
};
