import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PostCard } from "@/src/components/ReporteCard/PostCard";
import { useQuery } from "@tanstack/react-query";
import supabase from "@/src/lib/supabase";
import { ReporteNearby } from "@/src/types/reporteNearby";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reportes_view")
        .select("*")
        .eq("id_reporte", id)
        .single();

      if (error) throw error;
      return data as ReporteNearby;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600 dark:text-gray-300">
          Cargando detalles del reporte...
        </Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="mb-2 text-gray-800 dark:text-gray-200 font-medium">
          Error al cargar el reporte:
        </Text>
        <Text className="text-red-500 dark:text-red-400">
          {error instanceof Error ? error.message : "No se encontró el reporte"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
      <PostCard post={post} />

      {/* Aquí se pueden añadir más detalles, como comentarios, acciones, etc. */}
    </ScrollView>
  );
}
