import React from "react";
import { View, Text } from "react-native";
import { ReporteNearby } from "@/src/types/reporteNearby";

type PostCardFooterProps = {
  post: ReporteNearby;
};

export const PostCardFooter = ({ post }: PostCardFooterProps) => {
  return (
    <View className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <View className="flex-row flex-wrap justify-between">
        <View className="mb-2">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Tipo: {post.tipo_nombre ?? "N/A"}
          </Text>
        </View>
        <View className="mb-2">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Estado: {post.estatus ? "Resuelto" : "Pendiente"}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between">
        <View className="mb-1">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Likes: {post.likes_count}
          </Text>
        </View>
        <View className="mb-1">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Comentarios: {post.comments_count}
          </Text>
        </View>
        <View className="mb-1">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Distancia:{" "}
            {post.distance_meters
              ? `${(post.distance_meters / 1000).toFixed(1)} km`
              : "N/A"}
          </Text>
        </View>
      </View>

      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Creado: {new Date(post.fecha_creacion).toLocaleDateString()}
      </Text>
    </View>
  );
};
