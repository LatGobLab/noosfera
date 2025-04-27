import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ReporteNearby } from "@/src/types/reporteNearby";
import { PostCardHeader } from "./PostCardHeader";
import { PostCardGallery } from "./PostCardGallery";
import { PostCardFooter } from "./PostCardFooter";

type PostCardProps = {
  post: ReporteNearby;
};

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 overflow-hidden">
      <View className="p-4">
        <PostCardHeader post={post} />
        <PostCardGallery foto_reporte={post.foto_reporte} />
        <PostCardFooter post={post} />
      </View>
    </View>
  );
};
