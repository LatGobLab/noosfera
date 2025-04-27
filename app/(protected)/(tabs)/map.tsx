import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

function MapScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const initialRegion = {
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 5,
    longitudeDelta: 5,
  };

  const reports = [
    {
      id: 1,
      latitude: 19.45,
      longitude: -99.15,
      title: "Semáforo descompuesto",
    },
    { id: 2, latitude: 19.4, longitude: -99.1, title: "Bache peligroso" },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        zoomEnabled={true}
        zoomControlEnabled={true}
      >
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          zIndex={1}
        />

        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            title={report.title}
            onPress={() => {
              console.log("Marcador presionado:", report.title);
            }}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
