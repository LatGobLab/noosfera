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
    <View className="bg-background dark:bg-background-dark">
      <View className="">
        <PostCardHeader
          profile_avatar_url={post.profile_avatar_url ?? ""}
          profile_username={post.profile_username ?? ""}
          profile_rol_nombre={post.profile_rol_nombre ?? ""}
          estatus={post.estatus ?? false}
        />
        <PostCardGallery foto_reporte={post.foto_reporte} />
        <PostCardFooter
          descripcion={post.descripcion}
          likes_count={post.likes_count}
          comments_count={post.comments_count}
          distance_meters={post.distance_meters}
          fecha_creacion={post.fecha_creacion}
          num_eventos={post.num_eventos}
          tipo_nombre={post.tipo_nombre ?? ""}
        />
      </View>
    </View>
  );
};
