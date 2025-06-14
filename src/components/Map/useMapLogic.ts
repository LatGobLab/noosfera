import { useCallback, useMemo, useState, useEffect } from "react";
import * as Location from "expo-location";
import { useLocationStore } from "@/src/stores/useLocationStore";
import { ReportePin } from "@/src/types/reportePin";

export const useMapLogic = () => {
  const { latitude: storedLatitude, longitude: storedLongitude } = useLocationStore();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Función para obtener la ubicación actual
  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(newLocation);
      return newLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }, []);

  // Obtener ubicación actual al montar el componente
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Usar ubicación actual si está disponible, sino usar la almacenada, sino usar fallback
  const activeLatitude = currentLocation?.latitude || storedLatitude || 19.4326;
  const activeLongitude = currentLocation?.longitude || storedLongitude || -99.1332;

  // Memoizar la región inicial para evitar re-renders innecesarios
  const initialRegion = useMemo(
    () => ({
      latitude: activeLatitude,
      longitude: activeLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [activeLatitude, activeLongitude]
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
    getCurrentLocation,
    currentLocation,
    activeLatitude,
    activeLongitude,
  };
}; 