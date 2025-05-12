import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import type { Comment } from "@/src/types/comments";
import { CommentItem } from "./CommentItem";

type CommentsListProps = {
  comments: Comment[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasData: boolean;
  error: Error | null | undefined;
  onEndReached: () => void;
  onLikeComment: (commentId: number) => void;
  onReplyComment: (commentId: number) => void;
  isDark: boolean;
};

export const CommentsList = ({
  comments,
  isLoading,
  isFetchingNextPage,
  hasData,
  error,
  onEndReached,
  onLikeComment,
  onReplyComment,
  isDark,
}: CommentsListProps) => {
  // Render item for the comments list
  const renderItem = ({ item }: { item: Comment }) => (
    <CommentItem
      comment={item}
      onLike={onLikeComment}
      onReply={onReplyComment}
    />
  );

  // Render footer with loading indicator when fetching next page
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color={isDark ? "#FFF" : "#000"} />
        </View>
      );
    }
    return null;
  };

  if (isLoading && !hasData) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={isDark ? "#FFF" : "#000"} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">
          Error al cargar comentarios: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <BottomSheetFlatList
      data={comments}
      keyExtractor={(item) => item.id_comentario.toString()}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-10">
          <Text className="text-gray-500 dark:text-gray-400">
            No hay comentarios aún.
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={true}
      bounces={true}
    />
  );
};
