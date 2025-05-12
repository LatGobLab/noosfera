import React, { forwardRef, useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

// Import our custom components and hooks
import { CommentItem } from "./CommentItem";
import { useInfiniteComments } from "@/src/hooks/useComments";
import type { Comment, PaginatedCommentsResponse } from "@/src/types/comments";
import { InfiniteData } from "@tanstack/react-query";

type CommentsBottomSheetProps = {
  id_reporte: number;
};

export const CommentsBottomSheet = forwardRef<
  BottomSheetModal,
  CommentsBottomSheetProps
>(({ id_reporte }, ref) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [commentText, setCommentText] = useState("");

  // Use the infinite comments hook with explicit typing
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = useInfiniteComments(id_reporte);

  // Flatten the comments from all pages with proper type handling
  const comments = useMemo(() => {
    if (!data) return [];
    return (data as InfiniteData<PaginatedCommentsResponse>).pages.flatMap(
      (page) => page.comments
    );
  }, [data]);

  // Load more comments when user reaches end of list
  const loadMoreComments = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle like and reply actions
  const handleLikeComment = useCallback((commentId: number) => {
    // Implement like logic here
    console.log(`Like comment ${commentId}`);
  }, []);

  const handleReplyComment = useCallback((commentId: number) => {
    // Implement reply logic here
    console.log(`Reply to comment ${commentId}`);
  }, []);

  const handleSubmitComment = useCallback(() => {
    if (commentText.trim()) {
      // Implement submit comment logic here
      console.log(`Submitting comment: ${commentText}`);
      setCommentText("");
    }
  }, [commentText]);

  // Configure points for bottom sheet
  const snapPoints = useMemo(() => ["100%"], []);

  // Estilo personalizado para el handle (barra superior)
  const handleIndicatorStyle = useMemo(
    () => ({
      backgroundColor: isDark ? "#FFFFFF" : "#0d0f15",
      width: 50,
      height: 5,
    }),
    [isDark]
  );

  // Estilo para el header completo
  const handleStyle = useMemo(
    () => ({
      backgroundColor: isDark ? "#25292c" : "#F3F4F6",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }),
    [isDark]
  );

  // Renderizador personalizado para el backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} opacity={0.7} pressBehavior="close" />
    ),
    []
  );

  // Render item for the comments list
  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentItem
        comment={item}
        onLike={handleLikeComment}
        onReply={handleReplyComment}
      />
    ),
    [handleLikeComment, handleReplyComment]
  );

  // Render footer with loading indicator when fetching next page
  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color={isDark ? "#FFF" : "#000"} />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, isDark]);

  // Check if data exists and has pages
  const hasData =
    data && (data as InfiniteData<PaginatedCommentsResponse>).pages.length > 0;

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleIndicatorStyle={handleIndicatorStyle}
      handleStyle={handleStyle}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      animateOnMount={true}
      overDragResistanceFactor={0.5}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: isDark ? "#25292c" : "#FFFFFF",
      }}
      backgroundComponent={({ style }) => (
        <View
          style={[style, { borderTopLeftRadius: 30, borderTopRightRadius: 30 }]}
          className="bg-background dark:bg-[#25292c]"
        />
      )}
    >
      <BottomSheetView className="flex-1 px-2 pt-4">
        <Text className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">
          Comentarios
        </Text>

        {isLoading && !hasData ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={isDark ? "#FFF" : "#000"} />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-red-500">
              Error al cargar comentarios: {error.message}
            </Text>
          </View>
        ) : (
          <BottomSheetFlatList
            data={comments}
            keyExtractor={(item) => item.id_comentario.toString()}
            renderItem={renderItem}
            onEndReached={loadMoreComments}
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
          />
        )}

        {/* Comment input box */}
        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#25292c] border-t border-gray-200 dark:border-gray-700 px-4 py-6">
          <View className="flex-row items-center ">
            <TextInput
              className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-4 text-gray-800 dark:text-gray-200 "
              placeholder="Escribe un comentario..."
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <Pressable
              onPress={handleSubmitComment}
              className="ml-2 p-2 rounded-full bg-blue-500 items-center justify-center"
              disabled={!commentText.trim()}
            >
              <Ionicons name="send" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
