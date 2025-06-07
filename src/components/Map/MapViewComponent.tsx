import React, { useMemo } from "react";
import MapView, { PROVIDER_GOOGLE, Region, Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { MapPin } from "./MapPin";
import { ReportePin } from "@/src/types/reportePin";

interface MapViewComponentProps {
  initialRegion: Region;
  pins: ReportePin[];
  onPinPress: (pin: ReportePin) => void;
}

// Componente memoizado para un marker individual
const MapMarkerItem = React.memo(
  ({
    pin,
    onPinPress,
  }: {
    pin: ReportePin;
    onPinPress: (pin: ReportePin) => void;
  }) => (
    <Marker
      key={pin.id_reporte}
      coordinate={{
        latitude: pin.latitud,
        longitude: pin.longitud,
      }}
      title={pin.nombre_categoria}
      description={`Reporte #${pin.id_reporte}`}
      onPress={() => onPinPress(pin)}
    >
      <MapPin pin={pin} />
    </Marker>
  )
);

export const MapViewComponent: React.FC<MapViewComponentProps> = React.memo(
  ({ initialRegion, pins, onPinPress }) => {
    // Memoizar las props de configuración del mapa
    const mapConfig = useMemo(
      () => ({
        showsUserLocation: true,
        showsMyLocationButton: true,
        followsUserLocation: false,
        showsCompass: false,
        rotateEnabled: false,
        pitchEnabled: false,
        scrollEnabled: true,
        zoomEnabled: true,
        userLocationUpdateInterval: 15000, // Actualizar ubicación cada 15 segundos
        userLocationFastestInterval: 10000, // Mínimo 10 segundos entre actualizaciones
        userLocationAnnotationTitle: "Mi ubicación",
        loadingEnabled: true,
        loadingIndicatorColor: "#3b82f6",
        loadingBackgroundColor: "transparent",
        moveOnMarkerPress: false, // No mover el mapa cuando se presiona un marker
        toolbarEnabled: false,
      }),
      []
    );

    return (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        {...mapConfig}
      >
        {pins.map((pin) => (
          <MapMarkerItem
            key={pin.id_reporte}
            pin={pin}
            onPinPress={onPinPress}
          />
        ))}
      </MapView>
    );
  }
);

const styles = StyleSheet.create({
  map: {
    marginTop: 50,
    width: "100%",
    height: "100%",
  },
});

MapViewComponent.displayName = "MapViewComponent";
