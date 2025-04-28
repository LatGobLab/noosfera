import React, { useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
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
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNearbyPosts();

  const { scrollHandler } = useHeaderVisibility();

  const flatData = data?.pages?.flatMap((page) => page.data) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ReporteNearby>) => {
      return <MemoizedPostCard post={item} />;
    },
    []
  ); // El array de dependencias vacío es correcto si PostCard no depende de nada más en este scope

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color="#3b82f6" />
        </View>
      );
    }
    // Muestra mensaje si no hay más páginas y ya hay datos cargados
    if (!hasNextPage && flatData.length > 0) {
      return <Text style={styles.footerText}>No hay más reportes</Text>;
    }
    // No renderiza nada si hay más páginas o si no hay datos iniciales
    return null;
  }, [isFetchingNextPage, hasNextPage, flatData.length]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Buscando reportes cercanos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error al cargar los reportes:</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <AnimatedFlashList
        data={flatData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_reporte.toString()}
        estimatedItemSize={350}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.8} // Carga un poco antes (80% del final visible)
        ListFooterComponent={renderFooter}
        // --- Manejo de Lista Vacía ---
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
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

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#171717",
  },
  loadingText: {
    marginTop: 10,
    // color: '#666666', // Ejemplo claro
    color: "#aaaaaa", // Ejemplo oscuro
  },
  errorTitle: {
    marginBottom: 8,
    fontWeight: "500",
    // color: '#333333', // Ejemplo claro
    color: "#eeeeee", // Ejemplo oscuro
  },
  errorText: {
    // color: '#dc2626', // red-500
    color: "#f87171", // red-400 dark
    textAlign: "center",
  },
  emptyText: {
    // color: '#666666', // Ejemplo claro
    color: "#aaaaaa", // Ejemplo oscuro
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    // backgroundColor: '#ffffff', // Ejemplo claro
    backgroundColor: "#171717", // Ejemplo oscuro
    // marginTop: 8, // Equivalente a mt-2
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    // color: '#6b7280', // gray-500
    color: "#9ca3af", // gray-400 dark
    paddingVertical: 12,
  },
});
