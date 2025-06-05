import React from "react";
import { View, Text } from "react-native";
import { ReportePin } from "@/src/types/reportePin";

interface MapPinProps {
  pin: ReportePin;
  onPress?: () => void;
}

export const MapPin: React.FC<MapPinProps> = ({ pin, onPress }) => {
  // Función para determinar el color del pin basado en la categoría
  const getPinColor = (categoriaId: number): string => {
    switch (categoriaId) {
      case 1:
        return "#ef4444"; // Rojo para emergencias
      case 2:
        return "#f97316"; // Naranja para infraestructura
      case 3:
        return "#eab308"; // Amarillo para limpieza
      case 4:
        return "#22c55e"; // Verde para medio ambiente
      case 5:
        return "#3b82f6"; // Azul para servicios públicos
      default:
        return "#6b7280"; // Gris por defecto
    }
  };

  return (
    <View
      className="items-center justify-center"
      style={{
        backgroundColor: getPinColor(pin.fk_categoria_reporte),
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Text className="text-white text-xs font-bold">
        {pin.fk_categoria_reporte}
      </Text>
    </View>
  );
};
