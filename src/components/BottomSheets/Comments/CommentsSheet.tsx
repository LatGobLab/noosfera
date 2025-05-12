import React, {
  forwardRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  Alert,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";

// Import our custom components and hooks
import { useInfiniteComments } from "@/src/hooks/useComments";
import { useAddComment } from "@/src/hooks/useAddComment";
import type { PaginatedCommentsResponse } from "@/src/types/comments";
import { InfiniteData } from "@tanstack/react-query";
import { useUserProfile } from "@/src/hooks/useUserProfile";
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
  const [commentText, setCommentText] = useState("");
  const { profile } = useUserProfile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  // Create internal ref we can safely use
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  // Forward the internal ref methods to the parent
  useImperativeHandle(ref, () => ({
    ...bottomSheetRef.current!,
    present: () => {
      bottomSheetRef.current?.present();
      setShouldFetchData(true);
    },
  }));

  // Use the infinite comments hook with explicit typing
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteComments(id_reporte, 20, {
    enabled: shouldFetchData,
  });

  // Use the add comment mutation
  const { mutate: addComment, isPending: isAddingComment } = useAddComment();

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

  // Track sheet open/close state
  const handleSheetChange = useCallback((index: number) => {
    setIsSheetOpen(index >= 0);
    // Reset fetching flag when closed
    if (index === -1) {
      setShouldFetchData(false);
    }
  }, []);

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

  const handleSubmitComment = useCallback(() => {
    if (!commentText.trim()) return;

    if (!profile || !profile.id) {
      Alert.alert("Error", "Debes iniciar sesión para comentar");
      return;
    }

    // Add the new comment
    addComment(
      {
        reportId: id_reporte,
        userId: profile.id,
        content: commentText.trim(),
        parentId: null, // No parent comment for now
      },
      {
        onSuccess: () => {
          // Clear the input on success
          setCommentText("");
        },
        onError: (error) => {
          console.error("Error al agregar comentario:", error);
          Alert.alert(
            "Error",
            "No se pudo agregar el comentario. Inténtalo de nuevo."
          );
        },
      }
    );
  }, [commentText, profile, id_reporte, addComment]);

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

  // Check if data exists and has pages
  const hasData =
    data && (data as InfiniteData<PaginatedCommentsResponse>).pages.length > 0;

  // Loading indicator component
  const LoadingIndicator = () => (
    <View className="flex-1 justify-center items-center py-8">
      <ActivityIndicator size="large" color={isDark ? "#FFFFFF" : "#0d0f15"} />
      <Text className="mt-2 text-gray-600 dark:text-gray-300">
        Cargando comentarios...
      </Text>
    </View>
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
    >
      <BottomSheetView className="flex-1 px-2 pt-4" style={{ flex: 1 }}>
        <Text className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">
          Comentarios
        </Text>

        <View className="flex-1">
          {isLoading && shouldFetchData ? (
            <LoadingIndicator />
          ) : (
            <CommentsList
              comments={comments}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasData={!!hasData}
              error={error ? (error as Error) : null}
              onEndReached={loadMoreComments}
              onLikeComment={handleLikeComment}
              onReplyComment={handleReplyComment}
              isDark={isDark}
            />
          )}
        </View>

        <CommentInput
          commentText={commentText}
          onChangeText={setCommentText}
          onSubmit={handleSubmitComment}
          isSubmitting={isAddingComment}
          isDark={isDark}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});
