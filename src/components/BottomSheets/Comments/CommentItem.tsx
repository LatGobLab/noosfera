import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Comment } from "@/src/types/comments";

type CommentItemProps = {
  comment: Comment;
  onReply?: (commentId: number) => void;
  onLike?: (commentId: number) => void;
};

export const CommentItem = ({ comment, onReply, onLike }: CommentItemProps) => {
  // Format date manually since date-fns might not be installed
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const formattedDate = formatDate(comment.fecha_creacion);
  // Assuming the Comment type doesn't have user_has_liked property
  const hasLiked = false; // This should be replaced with actual logic if available

  return (
    <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      <View className="flex-row justify-between">
        <Text className="font-bold text-gray-800 dark:text-gray-200">
          {comment.profiles?.username || "Usuario anónimo"}
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {formattedDate}
        </Text>
      </View>

      <Text className="mt-1 text-gray-800 dark:text-gray-200">
        {comment.contenido}
      </Text>

      <View className="flex-row mt-2 space-x-4">
        <Pressable
          onPress={() => onLike?.(comment.id_comentario)}
          className="flex-row items-center"
        >
          <Ionicons
            name={hasLiked ? "heart" : "heart-outline"}
            size={16}
            color={hasLiked ? "#ef4444" : "#6b7280"}
          />
          <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
            {comment.likes_count || 0}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onReply?.(comment.id_comentario)}
          className="flex-row items-center"
        >
          <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
          <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
            Responder
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
