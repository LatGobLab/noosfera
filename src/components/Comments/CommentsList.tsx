import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import {
  BottomSheetFlashList,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import type { Comment } from "@/src/types/comments";
import { CommentItem } from "./CommentItem";
import { CommentsSkeleton } from "./CommentsSkeleton";

type CommentsListProps = {
  comments: Comment[];
  isInitialLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  error: Error | null | undefined;
  onEndReached: () => void;
  onLikeComment: (commentId: number) => void;
  onReplyComment: (commentId: number) => void;
  isDark: boolean;
};

export const CommentsList = ({
  comments,
  isInitialLoading,
  isFetching,
  isFetchingNextPage,
  error,
  onEndReached,
  onLikeComment,
  onReplyComment,
  isDark,
}: CommentsListProps) => {
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

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

  // Empty list component
  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center pt-10">
      <Text className="text-gray-500 dark:text-gray-400">
        No hay comentarios aún.
      </Text>
    </View>
  );

  // Show skeleton loading on initial load
  if (isInitialLoading) {
    return <CommentsSkeleton isDark={isDark} itemCount={6} />;
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
    <View style={{ height: screenHeight * 0.82 }}>
      <BottomSheetFlashList
        data={comments}
        keyExtractor={(item) => item.id_comentario.toString()}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={true}
        bounces={true}
        estimatedItemSize={100}
        estimatedListSize={{
          height: screenHeight * 0.82,
          width: Dimensions.get("window").width,
        }}
      />
    </View>
  );
};
