import React, { useMemo, useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Region, Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { useColorScheme } from "nativewind";
import { useLocationStore } from "@/src/stores/useLocationStore";
import { MapPin } from "./MapPin";
import { ReportePin } from "@/src/types/reportePin";
import { darkMapStyle } from "./darkMapStyle";

interface MapViewComponentProps {
  initialRegion: Region;
  pins: ReportePin[];
  onPinPress: (pin: ReportePin) => void;
  onMapReady?: () => void;
  onMarkersReady?: () => void;
}

// Componente para el marker de ubicación del usuario
const UserLocationMarker = React.memo(
  ({ latitude, longitude }: { latitude: number; longitude: number }) => (
    <Marker
      coordinate={{ latitude, longitude }}
      title="Mi ubicación"
      tracksViewChanges={false}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: "#000",
          borderWidth: 3,
          borderColor: "#000",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
        }}
      />
    </Marker>
  )
);

// Componente memoizado para un marker individual
const MapMarkerItem = React.memo(
  ({
    pin,
    onPinPress,
    tracksViewChanges,
  }: {
    pin: ReportePin;
    onPinPress: (pin: ReportePin) => void;
    tracksViewChanges: boolean;
  }) => (
    <Marker
      key={pin.id_reporte}
      tracksViewChanges={tracksViewChanges}
      coordinate={{
        latitude: pin.latitud,
        longitude: pin.longitud,
      }}
      title={pin.nombre_categoria}
      onPress={() => onPinPress(pin)}
    >
      <MapPin pin={pin} />
    </Marker>
  )
);

export const MapViewComponent: React.FC<MapViewComponentProps> = React.memo(
  ({ initialRegion, pins, onPinPress, onMapReady, onMarkersReady }) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const { latitude, longitude } = useLocationStore();

    // Estado para controlar tracksViewChanges dinámicamente
    const [tracksViewChanges, setTracksViewChanges] = useState(true);

    // Cambiar tracksViewChanges a false después de que los markers se hayan renderizado
    useEffect(() => {
      if (pins.length > 0 && tracksViewChanges) {
        // Esperar un poco para que los markers se rendericen completamente
        const timer = setTimeout(() => {
          setTracksViewChanges(false);
          // Notificar que los markers están listos
          onMarkersReady?.();
        }, 1000); // 1 segundo debería ser suficiente

        return () => clearTimeout(timer);
      } else if (pins.length === 0) {
        // Si no hay pins, los markers están "listos" inmediatamente
        onMarkersReady?.();
      }
    }, [pins.length, tracksViewChanges, onMarkersReady]);

    // Resetear tracksViewChanges cuando cambien los pins
    useEffect(() => {
      if (pins.length > 0) {
        setTracksViewChanges(true);
      }
    }, [pins.map((pin) => pin.id_reporte).join(",")]);

    // Memoizar las props de configuración del mapa según el tema
    const mapConfig = useMemo(
      () => ({
        showsUserLocation: false, // Desactivado para usar nuestro marker personalizado
        showsUserLocationAccuracyCircle: false, // Asegurar que esté desactivado
        showsMyLocationButton: true,
        followsUserLocation: false,
        showsCompass: false,
        rotateEnabled: false,
        pitchEnabled: false,
        scrollEnabled: true,
        zoomEnabled: true,
        loadingEnabled: true,
        loadingIndicatorColor: isDark ? "#60a5fa" : "#3b82f6", // Color diferente según el tema
        loadingBackgroundColor: "transparent",
        moveOnMarkerPress: false, // No mover el mapa cuando se presiona un marker
        toolbarEnabled: false,
        // Aplicar estilo personalizado solo en modo oscuro
        customMapStyle: isDark ? darkMapStyle : [],
      }),
      [isDark]
    );

    // Estilos dinámicos según el tema
    const mapStyles = useMemo(
      () => ({
        marginTop: 50,
        width: "100%" as const,
        height: "100%" as const,
        backgroundColor: isDark ? "#0f172a" : "#f8fafc", // Color de fondo según el tema
      }),
      [isDark]
    );

    // Manejar cuando el mapa está listo
    const handleMapReady = () => {
      console.log("🗺️ Mapa está listo");
      onMapReady?.();
    };

    return (
      <MapView
        style={mapStyles}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        onMapReady={handleMapReady}
        {...mapConfig}
      >
        {/* Marker personalizado para la ubicación del usuario */}
        {latitude && longitude && (
          <UserLocationMarker latitude={latitude} longitude={longitude} />
        )}

        {/* Markers de los reportes */}
        {pins.map((pin) => (
          <MapMarkerItem
            key={pin.id_reporte}
            pin={pin}
            onPinPress={onPinPress}
            tracksViewChanges={tracksViewChanges}
          />
        ))}
      </MapView>
    );
  }
);

MapViewComponent.displayName = "MapViewComponent";
