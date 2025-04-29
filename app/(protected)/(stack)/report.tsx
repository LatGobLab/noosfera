import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
    TextInput,
    Alert,
    ActivityIndicator,
  } from "react-native";
  import { useColorScheme } from "nativewind";
  import { Stack, useRouter } from "expo-router";
  import { useState, useEffect } from "react";
  import { CameraCapture } from "../../../src/components/Camera/CameraCapture";
  import { Image } from "expo-image";
  import supabase from "../../../src/lib/supabase";
  import { useAuthStore } from "../../../src/stores/useAuthStore";
  import { useLocationStore } from "../../../src/stores/useLocationStore";
  import queryClient from "../../../src/services/queryClient";
  
  export default function ReportScreen() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const [showCamera, setShowCamera] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [showFullImage, setShowFullImage] = useState(false);
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const screenWidth = Dimensions.get("window").width;
    const session = useAuthStore((state) => state.session);
    const { latitude, longitude, refreshLocation } = useLocationStore();
    const router = useRouter();
  
    // Obtener la ubicación al cargar la pantalla
    useEffect(() => {
      refreshLocation();
    }, []);
  
    const handleCapture = (uri: string) => {
      setPhotoUri(uri);
      setShowCamera(false);
    };
  
    // Función para subir la imagen al Storage de Supabase
    const uploadImageToSupabase = async (uri: string) => {
      if (!session?.user) {
        Alert.alert("Error", "No hay sesión activa");
        return null;
      }
  
      try {
        setIsUploading(true);
  
        // Convertir URI local a ArrayBuffer
        const arrayBuffer = await fetch(uri).then((res) => res.arrayBuffer());
  
        // Generar un nombre aleatorio para la imagen
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString();
        const filename = `${timestamp}-${randomSuffix}.jpeg`;
  
        // Subir a Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from("reporte")
          .upload(filename, arrayBuffer, {
            contentType: `image/jpeg`,
            upsert: true,
          });
  
        if (uploadError) {
          throw uploadError;
        }
  
        // Obtener URL pública (aunque no la usaremos directamente ahora)
        const {
          data: { publicUrl },
        } = supabase.storage.from("reporte").getPublicUrl(filename);
  
        return filename; // Devolvemos solo el nombre del archivo
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        Alert.alert("Error", "No se pudo subir la imagen. Inténtalo de nuevo.");
        return null;
      } finally {
        setIsUploading(false);
      }
    };
  
    // Función para insertar el reporte en la tabla reporte
    const createReporteEntry = async (imagePath: string) => {
      if (!session?.user || !latitude || !longitude) {
        throw new Error("Faltan datos necesarios (sesión o ubicación)");
      }
  
      // Crear el array directamente en formato raw (sin serializar)
      // Esto permite que Supabase lo almacene correctamente como '[filename]'
      const fotoReporteArray = [imagePath];
  
      // Insertar en la tabla reporte
      const { data, error } = await supabase.from("reporte").insert({
        fk_reporte_users: session.user.id,
        descripcion: description,
        latitud: latitude,
        longitud: longitude,
        fk_reporte_tipo: 1, // Valor fijo como solicitado
        foto_reporte: fotoReporteArray,
      });
  
      if (error) {
        throw error;
      }
  
      return data;
    };
  
    // Función para enviar el reporte completo
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
  
        // Subir la imagen a Supabase Storage
        const imagePath = await uploadImageToSupabase(photoUri);
  
        if (!imagePath) {
          throw new Error("No se pudo subir la imagen");
        }
  
        // Crear el registro en la tabla reporte
        await createReporteEntry(imagePath);
  
        // Invalidar queries para recargar datos
        queryClient.invalidateQueries({ queryKey: ["reports", "locations"] });
        queryClient.invalidateQueries({ queryKey: ["nearbyPosts"] });
  
        // Mostrar mensaje de éxito y volver atrás
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
        style={{ backgroundColor: isDark ? "#171717" : "#ffffff" }}
      >
        <Stack.Screen
          options={{
            title: "Reportar",
            headerTintColor: isDark ? "#ffffff" : "#000000",
            headerStyle: {
              backgroundColor: isDark ? "#171717" : "#ffffff",
            },
          }}
        />
  
        <ScrollView className="flex-1 p-4">
          <Text
            className="mb-6"
            style={{ color: isDark ? "#cccccc" : "#333333" }}
          >
            Aquí podrás reportar cualquier problema o incidente que hayas
            encontrado durante tu viaje.
          </Text>
  
          {photoUri ? (
            <View className="mb-6">
              <Text
                className="text-lg font-medium mb-2"
                style={{ color: isDark ? "#ffffff" : "#000000" }}
              >
                Foto del incidente
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowFullImage(true)}
              >
                <Image
                  source={{ uri: photoUri }}
                  style={{
                    width: screenWidth - 32, // Full width minus padding
                    height: screenWidth - 32, // Make it square
                    borderRadius: 8,
                  }}
                  contentFit="cover"
                  className="mb-3"
                />
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-2 px-4 rounded-lg self-end ${
                  isDark ? "bg-blue-600" : "bg-blue-500"
                }`}
                onPress={() => setShowCamera(true)}
              >
                <Text className="text-white">Tomar otra foto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mb-6">
              <Text
                className="text-lg font-medium mb-2"
                style={{ color: isDark ? "#ffffff" : "#000000" }}
              >
                Sube una foto del incidente
              </Text>
              <TouchableOpacity
                className={`py-3 px-4 rounded-lg items-center border ${
                  isDark ? "border-gray-700" : "border-gray-300"
                } mb-2`}
                onPress={() => setShowCamera(true)}
              >
                <Text
                  className="text-center"
                  style={{ color: isDark ? "#cccccc" : "#333333" }}
                >
                  Toca para tomar una foto
                </Text>
              </TouchableOpacity>
            </View>
          )}
  
          {/* Campo de descripción */}
          <View className="mb-6">
            <Text
              className="text-lg font-medium mb-2"
              style={{ color: isDark ? "#ffffff" : "#000000" }}
            >
              Descripción del incidente
            </Text>
            <TextInput
              className={`border rounded-lg p-3 min-h-[120px] text-base ${
                isDark
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300 bg-gray-50 text-black"
              }`}
              placeholder="Describe lo que ocurrió..."
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
  
          {/* Mostrar coordenadas (opcional, para desarrollo) */}
          {latitude && longitude && (
            <View className="mb-4">
              <Text
                className="text-xs opacity-50"
                style={{ color: isDark ? "#cccccc" : "#666666" }}
              >
                Ubicación: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>
            </View>
          )}
  
          {/* Botón para enviar el reporte */}
          <TouchableOpacity
            className={`py-3 px-4 rounded-lg items-center mb-8 ${
              photoUri &&
              description.trim().length > 0 &&
              !isSubmitting &&
              !isUploading &&
              latitude &&
              longitude
                ? isDark
                  ? "bg-green-600"
                  : "bg-green-500"
                : isDark
                ? "bg-gray-700"
                : "bg-gray-300"
            }`}
            disabled={
              !photoUri ||
              description.trim().length === 0 ||
              isSubmitting ||
              isUploading ||
              !latitude ||
              !longitude
            }
            onPress={handleSubmitReport}
          >
            {isSubmitting || isUploading ? (
              <View className="flex-row items-center">
                <ActivityIndicator
                  color={isDark ? "#9ca3af" : "#6b7280"}
                  size="small"
                />
                <Text
                  className="text-center font-medium ml-2"
                  style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                >
                  {isUploading ? "Subiendo imagen..." : "Enviando..."}
                </Text>
              </View>
            ) : (
              <Text
                className="text-center font-medium"
                style={{
                  color:
                    photoUri &&
                    description.trim().length > 0 &&
                    latitude &&
                    longitude
                      ? "white"
                      : isDark
                      ? "#9ca3af"
                      : "#6b7280",
                }}
              >
                Enviar reporte
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
  
        {/* Modal para ver imagen completa */}
        <Modal
          visible={showFullImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFullImage(false)}
        >
          <View className="flex-1 bg-black/90 justify-center items-center">
            <TouchableOpacity
              className="absolute top-10 right-6 z-10"
              onPress={() => setShowFullImage(false)}
            >
              <Text className="text-white text-xl">✕</Text>
            </TouchableOpacity>
  
            <Image
              source={{ uri: photoUri || "" }}
              style={{
                width: screenWidth,
                height: screenWidth * 1.3,
              }}
              contentFit="contain"
            />
          </View>
        </Modal>
      </View>
    );
  }
  