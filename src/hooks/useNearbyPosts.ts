import { useInfiniteQuery, InfiniteData, QueryKey } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import supabase from '@/src/lib/supabase';
import { useLocationStore } from '@/src/stores/useLocationStore';
import { ReporteNearby } from '@/src/types/reporteNearby'; 

const POSTS_PAGE_LIMIT = 10;

interface FetchPostsResponse {
  data: ReporteNearby[];
  nextPage: number | undefined;
}

export default function useNearbyPosts() {
  const { latitude, longitude } = useLocationStore();
  const [stableLocation, setStableLocation] = useState<{lat: number, lng: number} | null>(null);

  // Solo actualizar la ubicación estable cuando hay cambios significativos (>100 metros aprox)
  useEffect(() => {
    if (!latitude || !longitude) return;

    if (!stableLocation || 
        Math.abs(latitude - stableLocation.lat) > 0.001 || // ~100 metros
        Math.abs(longitude - stableLocation.lng) > 0.001) {
      setStableLocation({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, stableLocation]);

  const fetchPosts = async ({ pageParam = 0 }): Promise<FetchPostsResponse> => { // Tipar el retorno
    if (!stableLocation) {
      return { data: [], nextPage: undefined };
    }

    const offset = pageParam * POSTS_PAGE_LIMIT;

    // Supabase client infiere tipos si tienes los 'database types' generados,
    // pero podemos ser explícitos si no.
    const { data, error } = await supabase.rpc('get_reporte_nearby', {
      user_lat: stableLocation.lat,
      user_lon: stableLocation.lng,
      page_limit: POSTS_PAGE_LIMIT,
      page_offset: offset,
    });

    if (error) {
      console.error('Error fetching nearby posts:', error);
      throw new Error(error.message);
    }

    // Aseguramos que data sea del tipo esperado o un array vacío
    const reportes: ReporteNearby[] = (data as any[] || []).map(item => ({
        id_reporte: item.id_reporte,
        fk_reporte_users: item.fk_reporte_users,
        fk_resuelto_por: item.fk_resuelto_por || null,
        fecha_creacion: item.fecha_creacion,
        foto_reporte: item.foto_reporte || null,
        descripcion: item.descripcion,
        num_eventos: item.num_eventos,
        fk_reporte_tipo: item.fk_reporte_tipo || null,
        latitud: item.latitud,
        longitud: item.longitud,
        estatus: item.estatus,
        likes_count: item.likes_count,
        comments_count: item.comments_count,
        fk_organizaciones: item.fk_organizaciones || null,
        profile_username: item.profile_username || null,
        profile_avatar_url: item.profile_avatar_url || null,
        nombre_organizacion: item.nombre_organizacion || null,
        tipo_nombre: item.tipo_nombre || null,
        distance_meters: item.distance_meters
    }));


    return {
      data: reportes,
      nextPage: reportes.length === POSTS_PAGE_LIMIT ? pageParam + 1 : undefined,
    };
  };

  const queryResult = useInfiniteQuery<
    FetchPostsResponse, 
    Error,             
    InfiniteData<FetchPostsResponse>, 
    QueryKey,          
    number             
  >({
    initialPageParam: 0,
    queryKey: ['nearbyPosts', stableLocation?.lat, stableLocation?.lng],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!stableLocation,
    staleTime: 10 * 60 * 1000, // 10 minutos - posts más frescos que pins
    gcTime: 20 * 60 * 1000, // 20 minutos en caché
    refetchOnWindowFocus: false,
    refetchOnMount: false, // No refetch automáticamente al montar
    refetchOnReconnect: false, // No refetch al reconectar
  });

  // Puedes añadir un selector si quieres aplanar los datos directamente
  const flatData = queryResult.data?.pages.flatMap(page => page.data);

  return {
    ...queryResult,
    // Opcionalmente, puedes devolver los datos aplanados
    posts: flatData,
    // Función para refrescar manualmente si es necesario
    refreshPosts: () => queryResult.refetch(),
  };
}