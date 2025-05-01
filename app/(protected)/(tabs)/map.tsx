import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function App() {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
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
    marginTop: 100,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
