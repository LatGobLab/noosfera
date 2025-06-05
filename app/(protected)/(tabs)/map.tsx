import React from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import useMapPins from "@/src/hooks/useMapPins";
import { useLocationStore } from "@/src/stores/useLocationStore";
import { MapPin } from "@/src/components/Map/MapPin";
import { ReportePin } from "@/src/types/reportePin";

export default function MapScreen() {
  const { data: pins, isLoading, error, refreshPins } = useMapPins();
  const { latitude, longitude } = useLocationStore();

  const handlePinPress = (pin: ReportePin) => {
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
  };

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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: latitude || 19.4326, // Coordenadas de CDMX como fallback
          longitude: longitude || -99.1332,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {pins?.map((pin) => (
          <Marker
            key={pin.id_reporte}
            coordinate={{
              latitude: pin.latitud,
              longitude: pin.longitud,
            }}
            title={pin.nombre_categoria}
            description={`Reporte #${pin.id_reporte}`}
            onPress={() => handlePinPress(pin)}
          >
            <MapPin pin={pin} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
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
