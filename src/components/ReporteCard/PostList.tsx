import React, { useCallback, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { PostCard } from "./PostCard";
import useNearbyPosts from "@/src/hooks/useNearbyPosts";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useHeaderVisibility } from "@/src/contexts/HeaderVisibilityContext";
import Animated from "react-native-reanimated";
import { ReporteNearby } from "@/src/types/reporteNearby";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<ReporteNearby>
);

const MemoizedPostCard = React.memo(PostCard);

export const PostList = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refreshPosts,
  } = useNearbyPosts();

  const { scrollHandler } = useHeaderVisibility();

  const flatData = data?.pages?.flatMap((page) => page.data) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshPosts();
    setIsRefreshing(false);
  }, [refreshPosts]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ReporteNearby>) => {
      return <MemoizedPostCard post={item} />;
    },
    []
  ); // El array de dependencias vacío es correcto si PostCard no depende de nada más en este scope

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#3b82f6" />
        </View>
      );
    }
    // Muestra mensaje si no hay más páginas y ya hay datos cargados
    if (!hasNextPage && flatData.length > 0) {
      return (
        <Text className="text-center text-gray-500 dark:text-gray-400 py-3">
          No hay más reportes
        </Text>
      );
    }
    // No renderiza nada si hay más páginas o si no hay datos iniciales
    return null;
  }, [isFetchingNextPage, hasNextPage, flatData.length]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2.5 text-gray-600 dark:text-gray-300">
          Buscando reportes cercanos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-gray-900">
        <Text className="mb-2 font-medium text-gray-800 dark:text-gray-100">
          Error al cargar los reportes:
        </Text>
        <Text className="text-red-600 dark:text-red-400 text-center">
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <AnimatedFlashList
        className="pt-12"
        data={flatData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_reporte.toString()}
        estimatedItemSize={350}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.8} // Carga un poco antes (80% del final visible)
        ListFooterComponent={renderFooter}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        progressViewOffset={60}
        // --- Manejo de Lista Vacía ---
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-gray-900">
            <Text className="text-gray-600 dark:text-gray-300 text-center">
              No se encontraron reportes cercanos.
            </Text>
          </View>
        }
        // --- Conexión con Animación del Header ---
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        // --- Optimización y Comportamiento ---
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingTop: headerHeight.value }} // DESCOMENTA si el header se superpone al contenido

        // --- Props Avanzadas (Simplificadas/Comentadas para Debugging) ---

        // nestedScrollEnabled={true} // Solo si FlashList está DENTRO de otro ScrollView/Lista. Si no, elimínalo.
        // disableScrollViewPanResponder={true} // Solo si hay conflictos de gestos con un componente padre. Si no, elimínalo.

        /* overrideItemLayout: Es potente pero complejo. Puede causar saltos si la lógica no es perfecta
           o si las alturas reales varían. Comienza sin él y confía en estimatedItemSize.
           Si tienes problemas de rendimiento/saltos DESPUÉS de optimizar PostCard y estimatedItemSize,
           puedes reintroducirlo con cuidado.
        overrideItemLayout={(layout, item) => {
            // Asegúrate que 'item' y 'foto_reporte' existan antes de usarlos
            const hasPhoto = !!item?.foto_reporte;
            // Usa alturas consistentes o calculadas más precisamente si es posible
            layout.size = hasPhoto ? 900 : 300; // Ejemplo simplificado
        }}
        */

        /* viewabilityConfig: La configuración por defecto suele ser buena.
           Ajusta solo si tienes problemas específicos de rendimiento con elementos que entran/salen de la vista.
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50 // Por defecto es 50, prueba diferentes valores si es necesario
        }}
        */
      />
    </View>
  );
};
