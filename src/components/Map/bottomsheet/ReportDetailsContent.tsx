import React from "react";
import { ScrollView, View, Text } from "react-native";
import { UserInfoSection } from "./UserInfoSection";
import { ReportInfoSection } from "./ReportInfoSection";

type ReportDetailsContentProps = {
  reporteDetails: {
    id_reporte: number;
    profile_avatar_url?: string | null;
    profile_username?: string | null;
    nombre_organizacion?: string | null;
    tipo_nombre?: string | null;
    fk_reporte_users?: string | number | null;
  };
};

export const ReportDetailsContent = ({
  reporteDetails,
}: ReportDetailsContentProps) => {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
      <UserInfoSection
        profileAvatarUrl={reporteDetails.profile_avatar_url}
        profileUsername={reporteDetails.profile_username}
        nombreOrganizacion={reporteDetails.nombre_organizacion}
      />

      {/* Información del reporte */}
      <ReportInfoSection
        tipoNombre={reporteDetails.tipo_nombre}
        fkReporteUsers={reporteDetails.fk_reporte_users}
      />

      {/* Espacio adicional */}
      <View className="mb-8">
        <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">
          Más detalles próximamente...
        </Text>
      </View>
    </ScrollView>
  );
};
