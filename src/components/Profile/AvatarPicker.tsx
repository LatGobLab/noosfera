import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";

interface AvatarUploaderProps {
  currentAvatarUrl: string | null | undefined;
  onAvatarSelect: (uri: string | null) => void;
  size?: number;
  uploading?: boolean;
}

const AvatarPicker: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  onAvatarSelect,
  size = 150,
  uploading = false,
}) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Carga interna para el picker/manipulador

  // Limpiar selección si la URL actual cambia externamente (ej: al guardar)
  useEffect(() => {
    setSelectedImageUri(null);
  }, [currentAvatarUrl]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a tu galería para seleccionar una imagen."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Permite al usuario recortar/rotar
        aspect: [1, 1], // Fuerza un aspecto cuadrado
        quality: 1, // Calidad inicial alta, la reduciremos al manipular
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];

        // Redimensionar y comprimir la imagen
        const manipResult = await ImageManipulator.manipulateAsync(
          selectedAsset.uri,
          [{ resize: { width: 300 } }], // Redimensiona a un ancho máximo de 300px (ajusta según necesites)
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Comprime (0-1) y guarda como JPEG
        );

        setSelectedImageUri(manipResult.uri);
        onAvatarSelect(manipResult.uri); // Notifica al componente padre
      }
    } catch (error) {
      console.error("Error picking or manipulating image:", error);
      Alert.alert("Error", "No se pudo seleccionar o procesar la imagen.");
      onAvatarSelect(null); // Resetea si hay error
    } finally {
      setIsLoading(false);
    }
  };

  const imageSource = selectedImageUri || currentAvatarUrl;
  const showLoading = isLoading || uploading;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <TouchableOpacity
        onPress={pickImage}
        disabled={showLoading}
        style={styles.touchable}
      >
        {imageSource ? (
          <Image
            source={{ uri: imageSource }}
            style={[styles.avatar, { width: size, height: size }]}
          />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size }]}>
            <Ionicons name="camera" size={size * 0.4} color="#ccc" />
            <Text style={styles.placeholderText}>Elegir Foto</Text>
          </View>
        )}
        {showLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        {/* Ícono de edición opcional */}
        {!showLoading && (
          <View style={styles.editIconContainer}>
            <Ionicons name="pencil" size={size * 0.15} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999, // Circular
    overflow: "hidden", // Asegura que la imagen no se salga del círculo
    marginBottom: 20,
    backgroundColor: "#e0e0e0", // Color de fondo mientras carga o si no hay imagen
  },
  touchable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    borderRadius: 999, // Hace la imagen circular si es cuadrada
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 999,
  },
  placeholderText: {
    marginTop: 5,
    fontSize: 12,
    color: "#aaa",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 15,
  },
});

export default AvatarPicker;
