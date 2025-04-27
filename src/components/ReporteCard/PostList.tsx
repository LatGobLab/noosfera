import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { PostCard } from "./PostCard";
import { useRouter } from "expo-router";
import useNearbyPosts from "@/src/hooks/useNearbyPosts";

export const PostList = () => {
  const router = useRouter();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNearbyPosts();

  const flatData = data?.pages?.flatMap((page) => page.data) ?? [];

  const handlePostPress = (postId: string | number) => {
    router.push(`/post/${postId.toString()}`);
  };

  // Handle scroll event to implement infinite scrolling
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const paddingToBottom = 20; // Trigger when within 20px of bottom
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600 dark:text-gray-300">
          Buscando reportes cercanos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="mb-2 text-gray-800 dark:text-gray-200 font-medium">
          Error al cargar los reportes:
        </Text>
        <Text className="text-red-500 dark:text-red-400">{error.message}</Text>
      </View>
    );
  }

  if (flatData.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="text-gray-600 dark:text-gray-300">
          No se encontraron reportes cercanos.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      onScroll={handleScroll}
      scrollEventThrottle={16} // Throttle the scroll event for better performance
    >
      {flatData.map((post) => (
        <PostCard key={post.id_reporte.toString()} post={post} />
      ))}

      {/* Loading indicator at bottom when fetching more data */}
      {isFetchingNextPage && (
        <ActivityIndicator className="my-4" size="small" color="#0000ff" />
      )}

      {/* End of list message */}
      {!hasNextPage && flatData.length > 0 && (
        <Text className="text-center text-gray-500 dark:text-gray-400 my-4">
          No hay más reportes
        </Text>
      )}
    </ScrollView>
  );
};
