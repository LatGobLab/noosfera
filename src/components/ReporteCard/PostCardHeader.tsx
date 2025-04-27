import React from "react";
import { View, Text, Image } from "react-native";
import { ReporteNearby } from "@/src/types/reporteNearby";

type PostCardHeaderProps = {
  post: ReporteNearby;
};

export const PostCardHeader = ({ post }: PostCardHeaderProps) => {
  return (
    <View>
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
    </View>
  );
};
