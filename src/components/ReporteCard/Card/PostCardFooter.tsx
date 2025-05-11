import React, { useRef, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import formatRelativeDate from "@/src/lib/formatRelativeDate";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { formatNumber } from "@/src/lib/formatNumber";
import { useLike } from "@/src/hooks/useLike";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { CommentsBottomSheet } from "../../BottomSheets/CommentsSheet";

type PostCardFooterProps = {
  id_reporte: number;
  descripcion: string;
  likes_count: number;
  comments_count: number;
  distance_meters: number;
  fecha_creacion: string;
  num_eventos: number;
  tipo_nombre: string;
};

export const PostCardFooter = ({
  id_reporte,
  descripcion,
  likes_count: initialLikesCount,
  comments_count,
  distance_meters,
  fecha_creacion,
  num_eventos,
  tipo_nombre,
}: PostCardFooterProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#e5e7eb" : "#374151"; // gray-200 for dark, gray-800 for light

  // Use the like hook
  const { isLiked, isPending, toggleLike, optimisticLikesCount } = useLike(
    id_reporte,
    initialLikesCount
  );

  // Ref for the bottom sheet modal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Handle the like button press
  const handleLikePress = () => {
    if (!isPending) {
      toggleLike();
    }
  };

  // Handle comments press
  const handleCommentsPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View className="px-4 pb-4">
      <View className="flex-row flex-wrap gap-6 mb-2">
        <Pressable
          onPress={handleLikePress}
          className="flex-row items-center"
          disabled={isPending}
        >
          <AntDesign
            name={isLiked ? "heart" : "hearto"}
            size={22}
            color={isLiked ? "#ef4444" : iconColor} // red-500 if liked
          />
          <Text className="text-sm text-gray-800 dark:text-gray-200 ml-1">
            {formatNumber(optimisticLikesCount)}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleCommentsPress}
          className="flex-row items-center"
        >
          <Ionicons name="chatbubble-outline" size={22} color={iconColor} />
          <Text className="text-sm text-gray-800 dark:text-gray-200 ml-1">
            {formatNumber(comments_count)}
          </Text>
        </Pressable>
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

      {/* CommentsBottomSheet component */}
      <CommentsBottomSheet ref={bottomSheetModalRef} id_reporte={id_reporte} />
    </View>
  );
};
