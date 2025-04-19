import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from "react-native-maps";

function MapScreen() {
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
    <MapView
      style={{ flex: 1 }}
      initialRegion={initialRegion}
      zoomEnabled={true}
      zoomControlEnabled={true}
      // Quita el provider completamente o usa un enfoque alternativo
    >
      <UrlTile
        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        zIndex={1} // Cambiado de -1 a 1 para asegurar que esté encima
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
  );
}

export default MapScreen;
