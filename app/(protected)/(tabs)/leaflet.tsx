import React, { useRef, useState, useCallback, useMemo } from "react";
import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

// Interfaces para tipado fuerte
interface MarkerData {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
}

// Tipos para los mensajes entre WebView y React Native
type WebViewMessageType = "MAP_READY" | "MARKER_CLICK";

interface WebViewMessage {
  type: WebViewMessageType;
  markerId?: number;
  title?: string;
}

type WebViewCommandType = "ADD_MARKER" | "CENTER_MAP";

interface WebViewCommandBase {
  type: WebViewCommandType;
}

interface AddMarkerCommand extends WebViewCommandBase {
  type: "ADD_MARKER";
  id: number;
  latitude: number;
  longitude: number;
  title: string;
}

interface CenterMapCommand extends WebViewCommandBase {
  type: "CENTER_MAP";
  latitude: number;
  longitude: number;
  zoom?: number;
}

type WebViewCommand = AddMarkerCommand | CenterMapCommand;

const LeafletMapScreen: React.FC = () => {
  const webViewRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Configuración del Mapa ---
  const initialLatitude = 19.4326;
  const initialLongitude = -99.1332;
  const initialZoom = 12;

  // Datos de marcadores iniciales (usamos useMemo por si vinieran de props/state)
  const initialMarkers = useMemo<MarkerData[]>(
    () => [
      {
        id: 1,
        latitude: 19.45,
        longitude: -99.15,
        title: "Semáforo descompuesto",
      },
      { id: 2, latitude: 19.4, longitude: -99.1, title: "Bache peligroso" },
    ],
    []
  ); // Dependencias vacías si son estáticos

  // --- Generación del HTML para el WebView ---
  // Usamos useMemo para evitar regenerar el HTML en cada render si no cambian las dependencias
  const htmlContent = useMemo(() => {
    const markersJSON = JSON.stringify(initialMarkers);
    // Inyectamos las constantes directamente para no depender de variables externas en el scope del string
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
        <style>
          html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; }
          #map { width: 100%; height: 100%; background-color: #f0f0f0; } /* Fondo mientras carga */
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Variables globales dentro del script del WebView
          let map;
          const markersMap = new Map(); // Para guardar referencia a los marcadores Leaflet

          function initMap() {
            map = L.map('map', {
                preferCanvas: true // Pequeña mejora de rendimiento para muchos marcadores
            }).setView([${initialLatitude}, ${initialLongitude}], ${initialZoom});

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
              minZoom: 5 // Limitar zoom out puede ayudar un poco
            }).addTo(map);

            // Añadir marcadores iniciales
            const initialMarkers = ${markersJSON};
            initialMarkers.forEach(addMarkerInternal); // Usar función interna

            // Notificar a React Native que el mapa está listo
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
            } else {
                // Fallback para testing en navegador web (opcional)
                console.log("Mapa listo (simulado)");
            }
          }

          // Función interna para añadir/actualizar marcadores y guardar referencia
          function addMarkerInternal(markerData) {
             // Si ya existe, lo quitamos para actualizarlo (o podrías actualizar su posición/popup)
             if (markersMap.has(markerData.id)) {
                map.removeLayer(markersMap.get(markerData.id));
             }

             const leafletMarker = L.marker([markerData.latitude, markerData.longitude])
              .addTo(map)
              .bindPopup(markerData.title);

            leafletMarker.on('click', function() {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'MARKER_CLICK',
                  markerId: markerData.id,
                  title: markerData.title
                }));
              } else {
                console.log("Click en marcador (simulado):", markerData.title);
              }
            });

            markersMap.set(markerData.id, leafletMarker); // Guardar/actualizar referencia
          }

          // Funciones expuestas para ser llamadas desde React Native via injectJavaScript
          window.addMarker = function(id, lat, lng, title) {
            addMarkerInternal({ id, latitude: lat, longitude: lng, title });
          }

          window.centerMap = function(lat, lng, zoom) {
            map.setView([lat, lng], zoom || ${initialZoom});
          }

          // Listener para mensajes desde React Native (si necesitaras enviar objetos complejos)
          // window.addEventListener('message', function(event) {
          //   try {
          //       const data = JSON.parse(event.data);
          //       if (data.type === 'ADD_MARKER') {
          //          addMarkerInternal(data);
          //       } else if (data.type === 'CENTER_MAP') {
          //          window.centerMap(data.latitude, data.longitude, data.zoom);
          //       }
          //   } catch (e) {
          //       console.error('Error parsing message from RN:', e);
          //   }
          // });

          // Inicializar mapa cuando el DOM esté listo
          document.addEventListener('DOMContentLoaded', initMap);
        </script>
      </body>
      </html>
    `;
  }, [initialMarkers, initialLatitude, initialLongitude, initialZoom]); // Dependencias del HTML

  // --- Comunicación con el WebView ---

  // Manejador de mensajes desde el WebView (memoizado con useCallback)
  const handleWebViewMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data: WebViewMessage = JSON.parse(event.nativeEvent.data);
      console.log("Mensaje recibido del WebView:", data);

      switch (data.type) {
        case "MAP_READY":
          setLoading(false);
          console.log("Mapa listo en WebView.");
          // Podrías añadir aquí marcadores dinámicos si no los pusiste en el HTML inicial
          break;
        case "MARKER_CLICK":
          console.log(
            `Marcador presionado: ${data.title} (ID: ${data.markerId})`
          );
          // Implementa la lógica que necesites al hacer clic en un marcador
          break;
        default:
          console.warn("Tipo de mensaje desconocido:", (data as any).type);
      }
    } catch (error) {
      console.error("Error procesando mensaje del WebView:", error);
    }
  }, []); // Sin dependencias, ya que solo usa console y setLoading

  // Función para enviar comandos al WebView (Tipado)
  const postCommandToWebView = useCallback(
    (command: WebViewCommand) => {
      if (!webViewRef.current) {
        console.warn("WebView no está listo para recibir comandos.");
        return;
      }

      let script = "";
      switch (command.type) {
        case "ADD_MARKER":
          // Escapar comillas en el título por si acaso
          const safeTitle = command.title.replace(/"/g, '\\"');
          script = `window.addMarker(${command.id}, ${command.latitude}, ${command.longitude}, "${safeTitle}");`;
          break;
        case "CENTER_MAP":
          script = `window.centerMap(${command.latitude}, ${
            command.longitude
          }, ${command.zoom ?? initialZoom});`;
          break;
      }

      // Injecta el script JS en el WebView
      if (script) {
        webViewRef.current.injectJavaScript(
          `(function() { ${script} })(); true;`
        );
        // El 'true;' al final es recomendado para algunas plataformas
      }
    },
    [initialZoom]
  ); // Depende de initialZoom para el default de centerMap

  // Funciones de ejemplo para interactuar con el mapa desde RN
  const addMarkerFromRN = useCallback(
    (id: number, latitude: number, longitude: number, title: string) => {
      postCommandToWebView({
        type: "ADD_MARKER",
        id,
        latitude,
        longitude,
        title,
      });
    },
    [postCommandToWebView]
  );

  const centerMapFromRN = useCallback(
    (latitude: number, longitude: number, zoom?: number) => {
      postCommandToWebView({ type: "CENTER_MAP", latitude, longitude, zoom });
    },
    [postCommandToWebView]
  );

  // --- Renderizado ---
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        originWhitelist={["*"]} // Permite la comunicación desde cualquier origen en el HTML
        javaScriptEnabled={true} // Fundamental para que Leaflet funcione
        domStorageEnabled={true} // Necesario para algunas funcionalidades web
        onMessage={handleWebViewMessage} // Recibe mensajes desde el WebView
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("Error en WebView:", nativeEvent);
          setLoading(false); // Ocultar loading en caso de error
        }}
        onLoadStart={() => setLoading(true)} // Mostrar loading al empezar a cargar
        // onLoadEnd={() => setLoading(false)} // Ojo: MAP_READY es más fiable que onLoadEnd
        // Para Android, aceleración de hardware puede ayudar, pero a veces causa problemas
        // androidHardwareAccelerationDisabled={Platform.OS === "android" ? false : undefined}
        // Evitar que el usuario haga zoom en la página web, solo en el mapa Leaflet
        scalesPageToFit={false}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {/* Ejemplo de cómo llamarías a las funciones (puedes poner botones, etc.) */}
      {/*
      <View style={styles.controls}>
        <Button title="Centrar CDMX" onPress={() => centerMapFromRN(19.4326, -99.1332)} />
        <Button title="Añadir Marcador Test" onPress={() => addMarkerFromRN(3, 19.42, -99.16, 'Nuevo Marcador')} />
      </View>
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Fondo mientras carga el webview
  },
  webview: {
    flex: 1,
    // A veces ayuda poner un color de fondo explícito por si tarda en renderizar el HTML
    backgroundColor: "transparent",
  },
  loadingContainer: {
    // Usamos StyleSheet.absoluteFill para cubrir todo
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo semitransparente
    zIndex: 10, // Asegurar que esté por encima del WebView
  },
  // Estilos para botones de ejemplo (opcional)
  // controls: {
  //   position: 'absolute',
  //   bottom: 20,
  //   left: 20,
  //   right: 20,
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  // },
});

export default LeafletMapScreen;
