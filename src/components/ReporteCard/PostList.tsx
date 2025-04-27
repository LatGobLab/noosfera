import React, { useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { PostCard } from "./PostCard";
import { useRouter } from "expo-router";
import useNearbyPosts from "@/src/hooks/useNearbyPosts";
import { FlashList } from "@shopify/flash-list";
import { useHeaderVisibility } from "@/src/contexts/HeaderVisibilityContext";

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
  const { handleScroll } = useHeaderVisibility();

  const flatData = data?.pages?.flatMap((page) => page.data) ?? [];

  // Handle end reached to implement infinite scrolling
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    }

    if (!hasNextPage && flatData.length > 0) {
      return (
        <Text className="text-center text-gray-500 dark:text-gray-400 py-3">
          No hay más reportes
        </Text>
      );
    }

    return null;
  };

  // Manejar el evento de scroll para controlar la visibilidad del header
  const handleScrollEvent = useCallback(
    ({ nativeEvent }: { nativeEvent: any }) => {
      const offsetY = nativeEvent.contentOffset.y;
      handleScroll(offsetY);
    },
    [handleScroll]
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
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlashList
        data={flatData}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id_reporte.toString()}
        estimatedItemSize={300}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <Text className="text-center text-gray-600 dark:text-gray-300 py-8">
            No se encontraron reportes cercanos.
          </Text>
        }
        showsVerticalScrollIndicator={false}
        onScroll={handleScrollEvent}
        scrollEventThrottle={16} // Para un mejor rendimiento
      />
    </View>
  );
};
