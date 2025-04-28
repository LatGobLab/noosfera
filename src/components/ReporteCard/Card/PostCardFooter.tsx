import React from "react";
import { View, Text } from "react-native";
import formatRelativeDate from "@/src/lib/formatRelativeDate";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { formatNumber } from "@/src/lib/formatNumber";

type PostCardFooterProps = {
  descripcion: string;
  likes_count: number;
  comments_count: number;
  distance_meters: number;
  fecha_creacion: string;
  num_eventos: number;
  tipo_nombre: string;
};

// Función para formatear números

export const PostCardFooter = ({
  descripcion,
  likes_count,
  comments_count,
  distance_meters,
  fecha_creacion,
  num_eventos,
  tipo_nombre,
}: PostCardFooterProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#e5e7eb" : "#374151"; // gray-200 for dark, gray-800 for light

  return (
    <View className="px-4 pb-4">
      <View className="flex-row flex-wrap gap-6 mb-2">
        <View className="flex-row items-center">
          <AntDesign name="hearto" size={22} color={iconColor} />
          <Text className="text-sm text-gray-800 dark:text-gray-200 ml-1">
            {formatNumber(likes_count)}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={22} color={iconColor} />
          <Text className="text-sm text-gray-800 dark:text-gray-200 ml-1">
            {formatNumber(comments_count)}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between">
        <View className="mb-2">
          <Text className="text-sm text-black dark:text-gray-200">
            {descripcion}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between">
        <View className="mb-2">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {formatRelativeDate(fecha_creacion)}
          </Text>
        </View>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          Distancia:{" "}
          {distance_meters
            ? `${(distance_meters / 1000).toFixed(1)} km`
            : "N/A"}
        </Text>
      </View>
    </View>
  );
};
