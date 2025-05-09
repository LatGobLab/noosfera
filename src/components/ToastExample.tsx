import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useToast } from "@/src/contexts/ToastContext";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ToastButtonProps {
  type: "success" | "error" | "info" | "warning";
  label: string;
  message: string;
  icon: any;
  bgColor: string;
  textColor: string;
  duration?: number;
}

function ToastButton({
  type,
  label,
  message,
  icon,
  bgColor,
  textColor,
  duration,
}: ToastButtonProps) {
  const { showToast } = useToast();

  return (
    <TouchableOpacity
      className={`flex-row items-center ${bgColor} p-3 rounded-lg my-1`}
      onPress={() => showToast(message, type, duration)}
    >
      <Ionicons name={icon} size={20} color="white" />
      <Text className={`${textColor} ml-2 font-medium`}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ToastExample() {
  return (
    <View className="mt-6 space-y-2">
      <Text className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
        Ejemplos de Toast
      </Text>

      <ToastButton
        type="success"
        label="Notificación de éxito"
        message="Operación completada con éxito"
        icon="checkmark-circle"
        bgColor="bg-green-600"
        textColor="text-white"
      />

      <ToastButton
        type="error"
        label="Notificación de error"
        message="Ha ocurrido un error al procesar la solicitud"
        icon="close-circle"
        bgColor="bg-red-600"
        textColor="text-white"
      />

      <ToastButton
        type="info"
        label="Notificación informativa"
        message="Información importante para el usuario"
        icon="information-circle"
        bgColor="bg-blue-600"
        textColor="text-white"
      />

      <ToastButton
        type="warning"
        label="Notificación de advertencia"
        message="Atención: acción requerida por el usuario"
        icon="warning"
        bgColor="bg-yellow-600"
        textColor="text-white"
      />

      <ToastButton
        type="info"
        label="Duración personalizada (6s)"
        message="Este toast permanece visible durante 6 segundos"
        icon="time"
        bgColor="bg-purple-600"
        textColor="text-white"
        duration={6000}
      />
    </View>
  );
}
