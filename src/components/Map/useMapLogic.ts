import { useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { useLocationStore } from "@/src/stores/useLocationStore";
import { ReportePin } from "@/src/types/reportePin";
import { useMapDetails } from "@/src/hooks/useMapDetails";

export const useMapLogic = () => {
  const { latitude, longitude } = useLocationStore();

  // Memoizar la región inicial para evitar re-renders innecesarios
  const initialRegion = useMemo(
    () => ({
      latitude: latitude || 19.4326, // Coordenadas de CDMX como fallback
      longitude: longitude || -99.1332,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [latitude, longitude]
  );

  // Memoizar el handler para evitar re-renders de los Markers
  const handlePinPress = useCallback((pin: ReportePin) => {
    const { data, isLoading, error } = useMapDetails(pin.id_reporte);
    console.log(data);
  }, []);

  // Estabilizar los pins para evitar re-renders cuando no han cambiado
  const getStablePins = useCallback((pins: ReportePin[] | undefined) => {
    return pins;
  }, []);

  return {
    initialRegion,
    handlePinPress,
    getStablePins,
  };
}; 