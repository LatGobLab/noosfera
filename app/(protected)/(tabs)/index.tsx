import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet, // Import StyleSheet
  Image, // Import Image for avatar
} from "react-native";
// Asumo que useNearbyPosts también devuelve 'error' e 'isLoading' directamente
import useNearbyPosts from "@/src/hooks/useNearbyPosts";
import { ReporteNearby } from "@/src/types/repotes"; // Ajusta la ruta si es necesario

// No necesitas esta interfaz aquí si usas flatMap directamente
// interface PostPage {
//   data: ReporteNearby[];
//   nextPage: number | undefined;
// }

export default function Home() {
  const {
    data,
    error, // Asegúrate que tu hook devuelva el error
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading, // Usamos isLoading directamente (o isLoadingPosts si lo renombraste así en el hook)
  } = useNearbyPosts(); // Pasamos true para habilitarlo manualmente al montar (ajusta según necesites)

  // Aplanar los datos de todas las páginas en un solo array
  // Usamos optional chaining (?.) y nullish coalescing (??) para seguridad
  const flatData: ReporteNearby[] =
    data?.pages?.flatMap((page) => page.data) ?? [];

  // --- Renderizado ---

  // 1. Estado de Carga Inicial
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Buscando reportes cercanos...</Text>
      </View>
    );
  }

  // 2. Estado de Error
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error al cargar los reportes:</Text>
        <Text style={styles.errorText}>{error.message}</Text>
        {/* Podrías añadir un botón para reintentar aquí */}
      </View>
    );
  }

  // 3. Sin Datos (después de cargar y sin errores)
  if (flatData.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No se encontraron reportes cercanos.</Text>
      </View>
    );
  }

  // 4. Mostrar Datos
  return (
    <ScrollView style={styles.container}>
      {flatData.map((post) => (
        <View key={post.id_reporte} style={styles.postContainer}>
          {/* Información del Usuario */}
          <View style={styles.userInfo}>
            {post.profile_avatar_url ? (
              <Image
                source={{ uri: post.profile_avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder} /> // Un placeholder si no hay avatar
            )}
            <Text style={styles.username}>
              {post.profile_username ?? "Usuario Anónimo"}
            </Text>
          </View>

          {/* Detalles del Reporte */}
          <Text style={styles.description}>{post.descripcion}</Text>
          {/* Puedes mostrar la primera foto si existe */}
          {post.foto_reporte && post.foto_reporte[0]?.url && (
            <Image
              source={{ uri: post.foto_reporte[0].url }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}

          {/* Metadatos */}
          <View style={styles.metadata}>
            <Text style={styles.metaText}>
              Tipo: {post.tipo_nombre ?? "N/A"}
            </Text>
            <Text style={styles.metaText}>
              Estado: {post.estatus ? "Resuelto" : "Pendiente"}
            </Text>
            <Text style={styles.metaText}>Likes: {post.likes_count}</Text>
            <Text style={styles.metaText}>
              Comentarios: {post.comments_count}
            </Text>
            <Text style={styles.metaText}>
              Distancia:{" "}
              {post.distance_meters
                ? `${(post.distance_meters / 1000).toFixed(1)} km`
                : "N/A"}
            </Text>
            <Text style={styles.metaText}>
              Creado: {new Date(post.fecha_creacion).toLocaleDateString()}
            </Text>
          </View>
        </View>
      ))}

      {/* Botón Cargar Más y Indicador */}
      {hasNextPage && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          <Text style={styles.loadMoreText}>
            {isFetchingNextPage ? "Cargando..." : "Cargar más"}
          </Text>
        </TouchableOpacity>
      )}
      {isFetchingNextPage && (
        <ActivityIndicator
          style={{ marginVertical: 10 }}
          size="small"
          color="#0000ff"
        />
      )}
      {!hasNextPage && flatData.length > 0 && (
        <Text style={styles.noMoreResults}>No hay más reportes</Text>
      )}
    </ScrollView>
  );
}

// --- Estilos Básicos ---
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0", // Un fondo ligero
  },
  postContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000", // Sombra sutil (iOS)
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Sombra sutil (Android)
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ccc", // Color mientras carga o si falla
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#e0e0e0", // Placeholder gris
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  postImage: {
    width: "100%",
    height: 200, // Altura fija para la imagen de ejemplo
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#eee", // Placeholder mientras carga
  },
  metadata: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  metaText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 3,
  },
  loadMoreButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 15,
  },
  loadMoreText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 5,
  },
  noMoreResults: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
});
