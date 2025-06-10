import { useCallback, useMemo, useState } from "react";
import { useLocationStore } from "@/src/stores/useLocationStore";
import { ReportePin } from "@/src/types/reportePin";

export const useMapLogic = () => {
  const { latitude, longitude } = useLocationStore();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

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
    setSelectedReportId(pin.id_reporte);
  }, []);

  // Function to clear selected report (when bottom sheet closes)
  const clearSelectedReport = useCallback(() => {
    setSelectedReportId(null);
  }, []);

  // Estabilizar los pins para evitar re-renders cuando no han cambiado
  const getStablePins = useCallback((pins: ReportePin[] | undefined) => {
    return pins;
  }, []);

  return {
    initialRegion,
    handlePinPress,
    getStablePins,
    selectedReportId,
    clearSelectedReport,
  };
}; 