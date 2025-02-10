import { useColorScheme as useDeviceColorScheme } from "react-native";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { ColorScheme, ThemeMode } from "~/types/types";
import { useEffect } from "react";
import { setAndroidNavigationBar } from "./android-navigation-bar";

export function useColorScheme() {
  const deviceColorScheme = useDeviceColorScheme() ?? "light";
  const { colorScheme, setColorScheme } = useNativewindColorScheme();

  // Determinar el esquema efectivo basado en la selección del usuario
  const effectiveColorScheme =
    colorScheme === "system" ? deviceColorScheme : (colorScheme as ThemeMode);

  useEffect(() => {
    if (!colorScheme) {
      setColorScheme("system"); // Establecer "system" como predeterminado
    }
  }, []);

  // Sincronizar con el sistema operativo cuando el modo es "system"
  useEffect(() => {
    if (colorScheme === "system") {
      setAndroidNavigationBar(deviceColorScheme);
    }
  }, [deviceColorScheme, colorScheme]);

  return {
    colorScheme: (colorScheme ?? "system") as ColorScheme,
    effectiveColorScheme,
    isDarkColorScheme: effectiveColorScheme === "dark",
    setColorScheme,
  };
}
