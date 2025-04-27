import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { ReporteNearby } from "@/src/types/reporteNearby";

type PostCardProps = {
  post: ReporteNearby;
  onPress?: () => void;
};

export const PostCard = ({ post, onPress }: PostCardProps) => {
  const getImageUrls = () => {
    const BASE_URL =
      "https://jnlnusgalgwsclobfdxu.supabase.co/storage/v1/object/public/img_reporte/";

    try {
      if (typeof post.foto_reporte === "string") {
        const imageNames = JSON.parse(post.foto_reporte);
        if (Array.isArray(imageNames) && imageNames.length > 0) {
          return imageNames.map((name) => `${BASE_URL}${name}`);
        }
      } else if (Array.isArray(post.foto_reporte)) {
        // Direct array format
        if (post.foto_reporte.length > 0) {
          // Check if array contains objects with url property
          if (post.foto_reporte[0]?.url) {
            return post.foto_reporte.map((item) => item.url);
          }
          // Array of filenames
          return post.foto_reporte.map((name) => `${BASE_URL}${name}`);
        }
      }
      return [];
    } catch (error) {
      console.error("Error parsing image data:", error);
      return [];
    }
  };

  const imageUrls = getImageUrls();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 overflow-hidden"
    >
      <View className="p-4">
        {/* Header with user info */}
        <View className="flex-row items-center mb-3">
          {post.profile_avatar_url ? (
            <Image
              source={{ uri: post.profile_avatar_url }}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3" />
          )}
          <Text className="font-semibold text-gray-800 dark:text-gray-200">
            {post.profile_username ?? "Usuario Anónimo"}
          </Text>
        </View>

        {/* Post description */}
        <Text className="text-gray-700 dark:text-gray-300 mb-3">
          {post.descripcion}
        </Text>

        {/* Images gallery */}
        {imageUrls.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            {imageUrls.map((url, index) => (
              <Image
                key={`image-${index}`}
                source={{ uri: url }}
                style={{
                  width: 250,
                  height: 200,
                  borderRadius: 10,
                  marginRight: index < imageUrls.length - 1 ? 10 : 0,
                }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Post metadata */}
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
      </View>
    </TouchableOpacity>
  );
};
