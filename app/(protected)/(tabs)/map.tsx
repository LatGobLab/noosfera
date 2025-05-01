import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"; // Importa PROVIDER_GOOGLE

export default function App() {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // ¡Importante para usar Google Maps en Android!
        style={styles.map}
        initialRegion={{
          latitude: 37.78825, // Latitud inicial (ej: San Francisco)
          longitude: -122.4324, // Longitud inicial
          latitudeDelta: 0.0922, // Zoom vertical
          longitudeDelta: 0.0421, // Zoom horizontal
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    // O usa StyleSheet.absoluteFillObject para que ocupe todo
    ...StyleSheet.absoluteFillObject,
  },
});
