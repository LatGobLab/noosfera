import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from './supabaseClient'; // Tu instancia inicializada de Supabase
import { useUserLocation } from './useUserLocation'; // Hook anterior

const POSTS_PAGE_LIMIT = 10; // Cuántos posts cargar por página

function useNearbyPosts() {
  const { location, loading: locationLoading, errorMsg: locationError } = useUserLocation();

  const fetchPosts = async ({ pageParam = 0 }) => {
    // No intentar buscar si no tenemos ubicación
    if (!location) {
        // Podrías lanzar un error o devolver un array vacío
        // dependiendo de cómo quieras manejar este estado en la UI
        // console.log("Esperando ubicación para buscar posts...");
        return { data: [], nextPage: undefined };
        // throw new Error("Location not available yet.");
    }

    const offset = pageParam * POSTS_PAGE_LIMIT;

    const { data, error } = await supabase.rpc('get_posts_nearby', {
      user_lat: location.latitude,
      user_lon: location.longitude,
      page_limit: POSTS_PAGE_LIMIT,
      page_offset: offset,
    });

    if (error) {
      console.error('Error fetching nearby posts:', error);
      throw new Error(error.message);
    }

    return {
      data: data || [], // Asegurar que siempre sea un array
      nextPage: data && data.length === POSTS_PAGE_LIMIT ? pageParam + 1 : undefined,
    };
  };

  const queryResult = useInfiniteQuery({
    queryKey: ['nearbyPosts', location?.latitude, location?.longitude], // La key depende de la ubicación
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!location && !locationLoading, // Solo activar la query cuando la ubicación esté lista
    // staleTime: 5 * 60 * 1000, // Cachear por 5 minutos, por ejemplo
    // refetchOnWindowFocus: true, // Refrescar al volver a la app
  });

  return {
      ...queryResult,
      // Exponer también el estado de la localización
      locationLoading,
      locationError
  };
}