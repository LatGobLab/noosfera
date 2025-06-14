import React from "react";
import { View, Text } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { UserInfoSection } from "./UserInfo";
import { ReportInfoSection } from "./InfoSection";
import { PostCardGallery } from "../../ReporteCard/Card/PostCardGallery";
import { ReporteDetails } from "@/src/types/reporteDetails";

type ReportDetailsContentProps = {
  reporteDetails: ReporteDetails;
};

export const ReportDetailsContent = ({
  reporteDetails,
}: ReportDetailsContentProps) => {
  return (
    <BottomSheetScrollView
      className="flex-1 "
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View className="mb-8 ">
        <PostCardGallery
          foto_reporte={reporteDetails.foto_reporte}
          postId={reporteDetails.id_reporte}
          isInBottomSheet={true}
        />
      </View>

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
    </BottomSheetScrollView>
  );
};
