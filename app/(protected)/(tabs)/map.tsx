import React, { useMemo, useState, useEffect } from "react";
import { View } from "react-native";
import useMapPins from "@/src/hooks/useMapPins";
import { useMapLogic } from "@/src/components/Map/useMapLogic";
import { MapViewComponent } from "@/src/components/Map/MapViewComponent";
import { MapLoadingState, MapErrorState } from "@/src/components/Map/MapStates";

export default function MapScreen() {
  const {
    data: pins,
    isLoading: isPinsLoading,
    error,
    refreshPins,
  } = useMapPins();
  const { initialRegion, handlePinPress } = useMapLogic();

  // Estado local para controlar cuando el mapa está completamente listo
  const [isMapReady, setIsMapReady] = useState(false);
  const [areMarkersReady, setAreMarkersReady] = useState(false);

  // Memoizar los pins para evitar re-renders cuando no han cambiado
  const stablePins = useMemo(
    () => pins || [],
    [pins?.map((p) => p.id_reporte).join(",")]
  );

  // Resetear estados cuando cambian los pins
  useEffect(() => {
    if (pins && pins.length > 0) {
      setAreMarkersReady(false); // Los markers necesitan renderizarse de nuevo
    } else if (pins && pins.length === 0) {
      setAreMarkersReady(true); // No hay markers que renderizar
    }
    // Si pins es undefined (aún cargando), no cambiar el estado
  }, [pins?.map((p) => p.id_reporte).join(",")]);

  // Función para manejar cuando el mapa está listo
  const handleMapReady = () => {
    console.log("🗺️ Mapa está listo");
    setIsMapReady(true);
  };

  // Función para manejar cuando los markers están listos
  const handleMarkersReady = () => {
    console.log("📍 Markers están listos");
    setAreMarkersReady(true);
  };

  console.log(
    "pins count:",
    pins?.length,
    "isPinsLoading:",
    isPinsLoading,
    "isMapReady:",
    isMapReady,
    "areMarkersReady:",
    areMarkersReady
  );

  // Determinar si debemos mostrar loading
  // Mostrar loading mientras:
  // 1. Los pins están cargando
  // 2. El mapa no está listo
  // 3. Tenemos pins pero los markers no están listos
  const isCompletelyLoading =
    isPinsLoading ||
    !isMapReady ||
    (pins && pins.length > 0 && !areMarkersReady);

  if (error) {
    return <MapErrorState error={error} />;
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Renderizar el mapa siempre para que se cargue en el fondo */}
      <MapViewComponent
        initialRegion={initialRegion}
        pins={stablePins}
        onPinPress={handlePinPress}
        onMapReady={handleMapReady}
        onMarkersReady={handleMarkersReady}
      />

      {/* Pantalla de carga superpuesta */}
      {isCompletelyLoading && (
        <View className="absolute inset-0 z-50">
          <MapLoadingState />
        </View>
      )}
    </View>
  );
}
