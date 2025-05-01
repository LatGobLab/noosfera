import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";

type ReportImageSectionProps = {
  photoUri: string | null;
  onTakePhoto: () => void;
  onViewFullImage: () => void;
};

export const ReportImageSection = ({
  photoUri,
  onTakePhoto,
  onViewFullImage,
}: ReportImageSectionProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const screenWidth = Dimensions.get("window").width;

  if (photoUri) {
    return (
      <View className="mb-6">
        <Text
          className="text-lg font-medium mb-2"
          style={{ color: isDark ? "#ffffff" : "#000000" }}
        >
          Foto del incidente
        </Text>
        <TouchableOpacity activeOpacity={0.9} onPress={onViewFullImage}>
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
          onPress={onTakePhoto}
        >
          <Text className="text-white">Tomar otra foto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
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
        onPress={onTakePhoto}
      >
        <Text
          className="text-center"
          style={{ color: isDark ? "#cccccc" : "#333333" }}
        >
          Toca para tomar una foto
        </Text>
      </TouchableOpacity>
    </View>
  );
};
