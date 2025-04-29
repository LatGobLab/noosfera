import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { useColorScheme } from "nativewind";
import { Image } from "expo-image";

type CameraCaptureProps = {
  onCapture?: (uri: string) => void;
  onClose?: () => void;
};

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [taking, setTaking] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<any>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    // Request permissions when component mounts
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          size="large"
          color={isDark ? "#ffffff" : "#000000"}
        />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text
          className={`text-lg mb-4 text-center ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          Necesitamos tu permiso para mostrar la cámara
        </Text>
        <TouchableOpacity
          className={`py-3 px-6 rounded-lg ${
            isDark ? "bg-blue-600" : "bg-blue-500"
          }`}
          onPress={requestPermission}
        >
          <Text className="text-white font-medium">Otorgar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady) return;

    try {
      setTaking(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        exif: false,
      });
      setPhoto(photo.uri);
      if (onCapture) {
        onCapture(photo.uri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    } finally {
      setTaking(false);
    }
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  const handleCameraReady = () => {
    console.log("Camera is ready");
    setCameraReady(true);
  };

  if (photo) {
    return (
      <View className="flex-1">
        <Image source={{ uri: photo }} className="flex-1" contentFit="cover" />
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-between p-6">
          <TouchableOpacity
            className={`py-3 px-6 rounded-lg ${
              isDark ? "bg-red-600" : "bg-red-500"
            }`}
            onPress={retakePicture}
          >
            <Text className="text-white font-medium">Repetir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-3 px-6 rounded-lg ${
              isDark ? "bg-green-600" : "bg-green-500"
            }`}
            onPress={onClose}
          >
            <Text className="text-white font-medium">Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        onCameraReady={handleCameraReady}
      >
        <TouchableOpacity
          className="absolute top-6 right-6 bg-black/30 p-3 rounded-full z-10"
          onPress={onClose}
        >
          <Text className="text-white text-lg">✕</Text>
        </TouchableOpacity>

        <View className="absolute bottom-0 left-0 right-0 flex flex-row justify-between items-center p-6 z-10">
          <TouchableOpacity
            className="bg-black/30 p-3 rounded-full"
            onPress={toggleCameraFacing}
          >
            <Text className="text-white text-2xl">⟲</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-full p-1"
            onPress={takePicture}
            disabled={taking || !cameraReady}
          >
            <View
              className={`h-16 w-16 rounded-full border-4 ${
                taking || !cameraReady ? "border-gray-400" : "border-white"
              } ${taking || !cameraReady ? "bg-gray-400" : "bg-white"}`}
            />
          </TouchableOpacity>

          <View className="w-12" />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
});
