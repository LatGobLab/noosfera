import { useInfiniteQuery } from '@tanstack/react-query';
import supabase from '@/src/lib/supabase'; 
import { useLocationStore } from '@/src/stores/useLocationStore'; 

const POSTS_PAGE_LIMIT = 10; // Cuántos posts cargar por página

export default function useNearbyPosts() {
  const { latitude, longitude } = useLocationStore();

  const fetchPosts = async ({ pageParam = 0 }) => {
    if (!latitude || !longitude) {
        return { data: [], nextPage: undefined };
    }

    const offset = pageParam * POSTS_PAGE_LIMIT;

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

    return {
      data: data || [], 
      nextPage: data && data.length === POSTS_PAGE_LIMIT ? pageParam + 1 : undefined,
    };
  };

  const queryResult = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['nearbyPosts', latitude, longitude], 
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!latitude && !!longitude, // Solo activar la query cuando la ubicación esté lista
    // staleTime: 5 * 60 * 1000, // Cachear por 5 minutos, por ejemplo
    // refetchOnWindowFocus: true, // Refrescar al volver a la app
  });

  return {
      ...queryResult,
  };
}