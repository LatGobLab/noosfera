import React from "react";
import { View, Text, Pressable, Image, Alert } from "react-native";
import type { Comment } from "@/src/types/comments";
import formatRelativeDate from "@/src/lib/formatRelativeDate";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { formatNumber } from "@/src/lib/formatNumber";
import * as Clipboard from "expo-clipboard";
import { useToast } from "@/src/contexts/ToastContext";

type CommentItemProps = {
  comment: Comment;
  onReply?: (commentId: number) => void;
  onLike?: (commentId: number) => void;
};

export const CommentItem = ({ comment, onReply, onLike }: CommentItemProps) => {
  const formattedDate = formatRelativeDate(comment.fecha_creacion);
  const hasLiked = false;
  const { showToast } = useToast();

  const handleCopyText = async () => {
    try {
      if (comment.contenido) {
        await Clipboard.setStringAsync(comment.contenido);
        showToast("Texto copiado al portapapeles", "success");
      }
    } catch (error) {
      console.error("Error al copiar texto:", error);
      showToast("Error al copiar texto", "error");
    }
  };

  return (
    <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      <View className="flex-row">
        {/* Avatar section */}
        <View className="mr-3">
          {comment.profiles?.avatar_url ? (
            <Image
              source={{ uri: comment.profiles?.avatar_url }}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}
        </View>

        {/* Content section - takes the middle space with flex-1 */}
        <View className="flex-1 justify-center">
          <Text className="font-semibold text-gray-800 dark:text-gray-200">
            {comment.profiles?.username ?? "Usuario Anónimo"}
          </Text>
          <Pressable onPress={handleCopyText}>
            <Text
              className="text-xs text-gray-600 dark:text-gray-400"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {comment.contenido ?? ""}
            </Text>
          </Pressable>

          {/* Actions row */}
          <View className="flex-row mt-3 items-center gap-5">
            <Pressable
              onPress={() => onReply?.(comment.id_comentario)}
              className="flex-row items-center"
            >
              <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
              <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                Responder
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCopyText}
              className="flex-row items-center"
            >
              <Ionicons name="copy-outline" size={16} color="#6b7280" />
              <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                Copiar
              </Text>
            </Pressable>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </Text>
          </View>
        </View>

        {/* Like button section - fixed width */}
        <View className="items-center justify-center">
          <Pressable
            onPress={() => onLike?.(comment.id_comentario)}
            className="items-center"
          >
            <AntDesign
              name={hasLiked ? "heart" : "hearto"}
              size={24}
              color={hasLiked ? "#ef4444" : "#6b7280"}
            />
          </Pressable>
          <Text className="text-xs pt-2 text-gray-500 dark:text-gray-400">
            {formatNumber(comment.likes_count || 0)}
          </Text>
        </View>
      </View>
    </View>
  );
};
