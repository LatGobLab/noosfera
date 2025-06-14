import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import useMapPins from "@/src/hooks/useMapPins";
import { useMapLogic } from "@/src/components/Map/useMapLogic";
import { MapViewComponent } from "@/src/components/Map/MapViewComponent";
import { MapLoadingState, MapErrorState } from "@/src/components/Map/MapStates";
import { ReportDetailsSheet } from "@/src/components/Map/detailsSheet";

export default function MapScreen() {
  const { data: pins, isLoading: isPinsLoading, error } = useMapPins();
  const {
    initialRegion,
    handlePinPress,
    selectedReportId,
    clearSelectedReport,
  } = useMapLogic();

  // Ref para el bottom sheet de detalles
  const reportDetailsSheetRef = useRef<BottomSheetModal>(null);

  // Estado simple para controlar la carga completa
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  // Resetear cuando cambian los pins
  useEffect(() => {
    if (pins) {
      setIsFullyLoaded(false);
    }
  }, [pins?.length]);

  // Abrir el bottom sheet cuando se selecciona un reporte
  useEffect(() => {
    if (selectedReportId && reportDetailsSheetRef.current) {
      reportDetailsSheetRef.current.present();
    }
  }, [selectedReportId]);

  // Manejar cuando todo está listo
  const handleFullyLoaded = () => {
    setIsFullyLoaded(true);
  };

  // Mostrar loading mientras se cargan los pins o el mapa no está completamente listo
  const showLoading = isPinsLoading || !isFullyLoaded;

  if (error) {
    return <MapErrorState error={error} />;
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Renderizar el mapa siempre para que se cargue en el fondo */}
      <MapViewComponent
        initialRegion={initialRegion}
        pins={pins || []}
        onPinPress={handlePinPress}
        onMapReady={handleFullyLoaded}
        onMarkersReady={handleFullyLoaded}
      />

      {/* Pantalla de carga superpuesta */}
      {showLoading && (
        <View className="absolute inset-0 z-50">
          <MapLoadingState />
        </View>
      )}

      {/* Bottom Sheet para mostrar detalles del reporte */}
      <ReportDetailsSheet
        ref={reportDetailsSheetRef}
        reportId={selectedReportId}
        onClose={clearSelectedReport}
      />
    </View>
  );
}
