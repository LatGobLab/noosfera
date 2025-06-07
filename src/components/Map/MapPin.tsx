import React, { useMemo } from "react";
import { View, Image, ImageSourcePropType } from "react-native";
import { ReportePin } from "@/src/types/reportePin";

interface MapPinProps {
  pin: ReportePin;
  onPress?: () => void;
}

// Función externa para obtener la imagen del pin según la categoría
const getPinImage = (categoriaId: number): ImageSourcePropType => {
  switch (categoriaId) {
    case 1:
      return require("@/assets/images/pins/ciudad_pin.png");
    case 2:
      return require("@/assets/images/pins/sociedad_pin.png");
    case 3:
      return require("@/assets/images/pins/economia_pin.png");
    case 4:
      return require("@/assets/images/pins/ambiente_pin.png");
    case 5:
      return require("@/assets/images/pins/salud_pin.png");
    case 6:
      return require("@/assets/images/pins/Gobernanza_pin.png");
    case 7:
      return require("@/assets/images/pins/seguridad_pin.png");
    default:
      return require("@/assets/images/pins/ciudad_pin.png"); // Default - Ciudad
  }
};

export const MapPin: React.FC<MapPinProps> = React.memo(({ pin, onPress }) => {
  // Memoizar la imagen para evitar recrearla en cada render
  const pinImage = useMemo(
    () => getPinImage(pin.fk_categoria_reporte),
    [pin.fk_categoria_reporte]
  );

  // Estilo del contenedor del pin
  const containerStyle = useMemo(
    () => ({
      width: 40,
      height: 40,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 6, // Para Android
    }),
    []
  );

  return (
    <View style={containerStyle} className="items-center justify-center">
      <Image
        source={pinImage}
        style={{
          width: 40,
          height: 40,
          resizeMode: "contain",
        }}
        accessible={true}
        accessibilityLabel={`Pin de ${pin.nombre_categoria}`}
      />
    </View>
  );
});

MapPin.displayName = "MapPin";
