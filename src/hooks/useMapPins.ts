import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import supabase from '@/src/lib/supabase';
import { useLocationStore } from '@/src/stores/useLocationStore';
import { ReportePin } from '@/src/types/reportePin';

export default function useMapPins() {
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

  const fetchPins = async (): Promise<ReportePin[]> => {
    if (!stableLocation) {
      return [];
    }

    // Llamada a la función RPC de Supabase usando la ubicación estable
    const { data, error } = await supabase.rpc('get_reporte_pins_nearby', {
      user_lat: stableLocation.lat,
      user_lon: stableLocation.lng,
    });

    if (error) {
      console.error('Error fetching map pins:', error);
      throw new Error(error.message);
    }

    // Mapear y tipar los datos recibidos
    const pins: ReportePin[] = (data as any[] || []).map(item => ({
      id_reporte: item.id_reporte,
              latitud: item.latitud,
        longitud: item.longitud,
        fk_categoria_reporte: item.fk_categoria_reporte,
        nombre_categoria: item.nombre_categoria,
        distance_meters: item.distance_meters,
      }));

      return pins;
    };

    const queryResult = useQuery<ReportePin[], Error>({
      queryKey: ['mapPins', stableLocation?.lat, stableLocation?.lng],
      queryFn: fetchPins,
      enabled: !!stableLocation,
      staleTime: 15 * 60 * 1000, // 15 minutos - datos considerados frescos por más tiempo
      gcTime: 30 * 60 * 1000, // 30 minutos en caché
      refetchOnWindowFocus: false,
      refetchOnMount: false, // No refetch automáticamente al montar
      refetchOnReconnect: false, // No refetch al reconectar
    });

    return {
      ...queryResult,
      // Función para refrescar manualmente si es necesario
      refreshPins: () => queryResult.refetch(),
    };
} 