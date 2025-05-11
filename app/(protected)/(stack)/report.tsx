import { View, Text, ScrollView } from "react-native";
import { useColorScheme } from "nativewind";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { CameraCapture } from "@/src/components/Camera/CameraCapture";
import { useReport } from "@/src/hooks/useReport";
import { ReportImageSection } from "@/src/components/Reports/ReportImageSection";
import { ReportDescriptionSection } from "@/src/components/Reports/ReportDescriptionSection";
import { ReportSubmitButton } from "@/src/components/Reports/ReportSubmitButton";
import { FullImageModal } from "@/src/components/Reports/FullImageModal";

export default function ReportScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    photoUri,
    description,
    setDescription,
    isUploading,
    isSubmitting,
    showCamera,
    setShowCamera,
    showFullImage,
    setShowFullImage,
    handleCapture,
    handleSubmitReport,
    refreshLocation,
    hasLocation,
  } = useReport();

  useEffect(() => {
    refreshLocation();
  }, []);

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCapture}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: isDark ? "#0d0f15" : "#ffffff" }}
    >
      <ScrollView className="flex-1 p-4">
        <Text
          className="mb-6"
          style={{ color: isDark ? "#cccccc" : "#333333" }}
        >
          Aquí podrás reportar cualquier problema o incidente que hayas
          encontrado durante tu viaje.
        </Text>

        {/* Sección de la imagen */}
        <ReportImageSection
          photoUri={photoUri}
          onTakePhoto={() => setShowCamera(true)}
          onViewFullImage={() => setShowFullImage(true)}
        />

        {/* Sección de descripción */}
        <ReportDescriptionSection
          description={description}
          onChangeDescription={setDescription}
        />

        {/* Botón de envío */}
        <ReportSubmitButton
          onSubmit={handleSubmitReport}
          isValid={!!photoUri && description.trim().length > 0 && hasLocation}
          isSubmitting={isSubmitting}
          isUploading={isUploading}
        />
      </ScrollView>

      {/* Modal para vista completa de imagen */}
      <FullImageModal
        visible={showFullImage}
        imageUri={photoUri}
        onClose={() => setShowFullImage(false)}
      />
    </View>
  );
}
