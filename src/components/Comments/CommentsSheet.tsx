import React, {
  forwardRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import { View, Text, Alert, BackHandler } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";

// Import our custom components and hooks
import { useInfiniteComments } from "@/src/hooks/useComments";
import type { PaginatedCommentsResponse } from "@/src/types/comments";
import { InfiniteData } from "@tanstack/react-query";
import { CommentsList } from "./CommentsList";
import { CommentInput } from "./CommentInput";

type CommentsBottomSheetProps = {
  id_reporte: number;
};

export const CommentsBottomSheet = forwardRef<
  BottomSheetModal,
  CommentsBottomSheetProps
>(({ id_reporte }, ref) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  useImperativeHandle(ref, () => bottomSheetRef.current!);

  // Use the infinite comments hook with lazy loading
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isInitialLoading,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteComments(id_reporte, 20, hasBeenOpened);

  // Handle back button press to close sheet instead of app
  useEffect(() => {
    const handleBackPress = () => {
      if (isSheetOpen && bottomSheetRef.current) {
        bottomSheetRef.current.close();
        return true; // Prevent default back action
      }
      return false; // Let default back action occur
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, [isSheetOpen]);

  // Force the sheet to stay at correct position when data loads
  useEffect(() => {
    if (isSheetOpen && !isInitialLoading && data && bottomSheetRef.current) {
      // Small delay to ensure the content has rendered
      const timeoutId = setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [isSheetOpen, isInitialLoading, data]);

  // Track sheet open/close state
  const handleSheetChange = useCallback(
    (index: number) => {
      const isOpening = index >= 0;
      setIsSheetOpen(isOpening);

      // Enable data fetching when sheet opens for the first time
      if (isOpening && !hasBeenOpened) {
        setHasBeenOpened(true);
      }
    },
    [hasBeenOpened]
  );

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
    // Implement like logic here (for future implementation)
    console.log(`Like comment ${commentId}`);
  }, []);

  const handleReplyComment = useCallback((commentId: number) => {
    // Implement reply logic here (for future implementation)
    console.log(`Reply to comment ${commentId}`);
  }, []);

  // Handle successful comment submission
  const handleCommentAdded = useCallback(() => {
    refetch();
  }, [refetch]);

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

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleIndicatorStyle={handleIndicatorStyle}
      handleStyle={handleStyle}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      animateOnMount={true}
      overDragResistanceFactor={0}
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
      onChange={handleSheetChange}
      enableDynamicSizing={false}
      detached={false}
    >
      <BottomSheetView className="flex-1 px-2 pt-4" style={{ flex: 1 }}>
        <Text className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">
          Comentarios
        </Text>

        <View className="flex-1">
          <CommentsList
            comments={comments}
            isInitialLoading={isInitialLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            error={error ? (error as Error) : null}
            onEndReached={loadMoreComments}
            onLikeComment={handleLikeComment}
            onReplyComment={handleReplyComment}
            isDark={isDark}
          />
        </View>

        <CommentInput
          reportId={id_reporte}
          onCommentAdded={handleCommentAdded}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});
