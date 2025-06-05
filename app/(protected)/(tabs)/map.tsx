import React, { useCallback, useMemo } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import useMapPins from "@/src/hooks/useMapPins";
import { useLocationStore } from "@/src/stores/useLocationStore";
import { MapPin } from "@/src/components/Map/MapPin";
import { ReportePin } from "@/src/types/reportePin";

// Componente memoizado para los markers para evitar re-renders innecesarios
const MemoizedMarker = React.memo(
  ({
    pin,
    onPinPress,
  }: {
    pin: ReportePin;
    onPinPress: (pin: ReportePin) => void;
  }) => (
    <Marker
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

export default function MapScreen() {
  const { data: pins, isLoading, error, refreshPins } = useMapPins();
  const { latitude, longitude } = useLocationStore();

  console.log("pins count:", pins?.length, "isLoading:", isLoading);

  // Memoizar los pins para evitar re-renders cuando no han cambiado
  const stablePins = useMemo(
    () => pins,
    [pins?.map((p) => p.id_reporte).join(",")]
  );

  // Memoizar la región inicial para evitar re-renders innecesarios
  const initialRegion = useMemo(
    () => ({
      latitude: latitude || 19.4326, // Coordenadas de CDMX como fallback
      longitude: longitude || -99.1332,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    []
  ); // Array vacío para que solo se calcule una vez

  // Memoizar el handler para evitar re-renders de los Markers
  const handlePinPress = useCallback((pin: ReportePin) => {
    Alert.alert(
      pin.nombre_categoria,
      `Reporte #${pin.id_reporte}\nCategoría: ${pin.nombre_categoria}`,
      [
        { text: "Cerrar", style: "cancel" },
        {
          text: "Ver detalles",
          onPress: () => {
            // Aquí podrías navegar a la pantalla de detalles del reporte
            console.log(`Navegar a reporte ${pin.id_reporte}`);
          },
        },
      ]
    );
  }, []); // Array vacío porque no depende de props o state

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-foreground dark:text-foreground-dark">
          Cargando mapa...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-background-dark p-4">
        <Text className="text-red-500 text-center font-semibold">
          Error al cargar el mapa
        </Text>
        <Text className="text-foreground dark:text-foreground-dark text-center mt-2">
          {error.message}
        </Text>
      </View>
    );
  }

  // Memoizar todo el MapView para evitar re-renders
  const memoizedMapView = useMemo(
    () => (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={false}
        showsCompass={false}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={true}
        zoomEnabled={true}
        userLocationUpdateInterval={15000} // Actualizar ubicación cada 15 segundos
        userLocationFastestInterval={10000} // Mínimo 10 segundos entre actualizaciones
        userLocationAnnotationTitle="Mi ubicación"
        loadingEnabled={true}
        loadingIndicatorColor="#3b82f6"
        loadingBackgroundColor="transparent"
        moveOnMarkerPress={false} // No mover el mapa cuando se presiona un marker
        toolbarEnabled={false}
      >
        {stablePins?.map((pin) => (
          <MemoizedMarker
            key={pin.id_reporte}
            pin={pin}
            onPinPress={handlePinPress}
          />
        ))}
      </MapView>
    ),
    [initialRegion, stablePins, handlePinPress]
  );

  return <View style={styles.container}>{memoizedMapView}</View>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    marginTop: 50,
    width: "100%",
    height: "100%",
  },
});
