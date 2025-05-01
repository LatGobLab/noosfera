import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useLocationStore } from "@/src/stores/useLocationStore";
import { submitReport } from "@/src/services/reportService";

export const useReport = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  
  const session = useAuthStore((state) => state.session);
  const { latitude, longitude, refreshLocation } = useLocationStore();
  const router = useRouter();

  const handleCapture = (uri: string) => {
    setPhotoUri(uri);
    setShowCamera(false);
  };

  const handleSubmitReport = async () => {
    if (!photoUri || !description.trim()) {
      Alert.alert("Error", "Debes añadir una foto y una descripción");
      return;
    }

    if (!session?.user) {
      Alert.alert("Error", "No hay sesión activa");
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert("Error", "No se pudo obtener tu ubicación actual");
      return;
    }

    try {
      setIsSubmitting(true);
      
      await submitReport(
        {
          photoUri,
          description,
          latitude,
          longitude,
        },
        session
      );

      // Show success message and go back
      Alert.alert("Éxito", "Reporte enviado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    photoUri,
    setPhotoUri,
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
    hasLocation: !!latitude && !!longitude,
  };
}; 