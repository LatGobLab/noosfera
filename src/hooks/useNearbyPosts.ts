import { useInfiniteQuery, InfiniteData, QueryKey } from '@tanstack/react-query';
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

  const fetchPosts = async ({ pageParam = 0 }): Promise<FetchPostsResponse> => { // Tipar el retorno
    if (!latitude || !longitude) {
      return { data: [], nextPage: undefined };
    }

    const offset = pageParam * POSTS_PAGE_LIMIT;

    // Supabase client infiere tipos si tienes los 'database types' generados,
    // pero podemos ser explícitos si no.
    const { data, error } = await supabase.rpc('get_reporte_nearby', {
      user_lat: latitude,
      user_lon: longitude,
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
        foto_resuelto: item.foto_resuelto || null,
        descripcion: item.descripcion,
        num_eventos: item.num_eventos,
        fk_reporte_tipo: item.fk_reporte_tipo || null,
        latitud: item.latitud,
        longitud: item.longitud,
        estatus: item.estatus,
        likes_count: item.likes_count,
        comments_count: item.comments_count,
        profile_username: item.profile_username || null,
        profile_avatar_url: item.profile_avatar_url || null,
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
    queryKey: ['nearbyPosts', latitude, longitude],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!latitude && !!longitude
    // staleTime: 5 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });

  // Puedes añadir un selector si quieres aplanar los datos directamente
  const flatData = queryResult.data?.pages.flatMap(page => page.data);

  return {
    ...queryResult,
    // Opcionalmente, puedes devolver los datos aplanados
    posts: flatData,
  };
}