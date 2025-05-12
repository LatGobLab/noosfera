import React from "react";
import { View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CommentInputProps = {
  commentText: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDark: boolean;
};

export const CommentInput = ({
  commentText,
  onChangeText,
  onSubmit,
  isSubmitting,
  isDark,
}: CommentInputProps) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#25292c] border-t border-gray-200 dark:border-gray-700 px-4 py-6">
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-4 text-gray-800 dark:text-gray-200"
          placeholder="Escribe un comentario..."
          placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
          value={commentText}
          onChangeText={onChangeText}
          multiline
          editable={!isSubmitting}
        />
        <Pressable
          onPress={onSubmit}
          className={`ml-2 p-2 rounded-full items-center justify-center ${
            !commentText.trim() || isSubmitting
              ? "bg-blue-300 dark:bg-blue-800"
              : "bg-blue-500"
          }`}
          disabled={!commentText.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send" size={20} color="white" />
          )}
        </Pressable>
      </View>
    </View>
  );
};
