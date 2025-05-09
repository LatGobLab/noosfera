import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

interface IconAndColorProps {
  icon: any;
  bgColor: string;
  textColor: string;
  borderColor: string;
  darkBgColor: string;
  darkTextColor: string;
  darkBorderColor: string;
}

const getIconAndColorClasses = (type: ToastType): IconAndColorProps => {
  switch (type) {
    case "success":
      return {
        icon: "checkmark-circle",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        borderColor: "border-green-500",
        darkBgColor: "dark:bg-green-900",
        darkTextColor: "dark:text-green-300",
        darkBorderColor: "dark:border-green-600",
      };
    case "error":
      return {
        icon: "close-circle",
        bgColor: "bg-red-50",
        textColor: "text-red-800",
        borderColor: "border-red-500",
        darkBgColor: "dark:bg-red-900",
        darkTextColor: "dark:text-red-300",
        darkBorderColor: "dark:border-red-600",
      };
    case "warning":
      return {
        icon: "warning",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-500",
        darkBgColor: "dark:bg-yellow-900",
        darkTextColor: "dark:text-yellow-300",
        darkBorderColor: "dark:border-yellow-600",
      };
    case "info":
    default:
      return {
        icon: "information-circle",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
        borderColor: "border-blue-500",
        darkBgColor: "dark:bg-blue-900",
        darkTextColor: "dark:text-blue-300",
        darkBorderColor: "dark:border-blue-600",
      };
  }
};

const { width } = Dimensions.get("window");

export default function Toast({
  visible,
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animating = useRef(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (visible) {
      // Limpiar cualquier temporizador anterior
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Animación de entrada
      animating.current = true;
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        animating.current = false;
      });

      // Auto ocultar después de la duración establecida
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    } else {
      // Si cambia a no visible y no estamos animando, aseguramos valores iniciales
      if (!animating.current) {
        translateY.setValue(-100);
        opacity.setValue(0);
      }
    }

    // Limpieza
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, duration]);

  const hideToast = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    animating.current = true;
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animating.current = false;
      // Utilizamos un setTimeout para evitar actualización de estado durante la renderización
      setTimeout(() => {
        onClose();
      }, 0);
    });
  };

  if (!visible && !animating.current) return null;

  const colors = getIconAndColorClasses(type);
  const iconColor = isDark ? "#ffffff" : colors.textColor.replace("text-", "");

  return (
    <Animated.View
      className="absolute top-10 left-0 right-0 z-50 items-center"
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        className={`flex-row items-center px-4 py-3 rounded-lg shadow-md border-l-4 w-[90%] max-w-md
          ${colors.bgColor} ${colors.darkBgColor} ${colors.borderColor} ${colors.darkBorderColor}`}
      >
        <Ionicons name={colors.icon} size={24} color={iconColor} />
        <Text
          className={`flex-1 mx-3 text-sm font-medium ${colors.textColor} ${colors.darkTextColor}`}
        >
          {message}
        </Text>
        <TouchableOpacity onPress={hideToast} className="p-1 rounded-full">
          <Ionicons name="close" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
