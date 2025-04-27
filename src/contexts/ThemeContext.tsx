import React, { createContext, useContext, useEffect } from "react";
import { useColorScheme } from "nativewind";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const THEME_PREFERENCE_KEY = "themePreference";

type ThemeContextType = {
  colorScheme: "light" | "dark" | undefined;
  selectedPreference: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [selectedPreference, setSelectedPreference] = React.useState<
    "light" | "dark" | "system"
  >("system");

  useEffect(() => {
    // Carga la preferencia de tema al iniciar la app
    const loadThemePreference = () => {
      try {
        const storedPreference = storage.getString(THEME_PREFERENCE_KEY);
        if (storedPreference !== undefined) {
          const preference = storedPreference as "light" | "dark" | "system";
          setSelectedPreference(preference);
          setColorScheme(preference);
        }
      } catch (e) {
        console.error("Failed to load theme preference.", e);
      }
    };

    loadThemePreference();
  }, []);

  const setTheme = (theme: "light" | "dark" | "system") => {
    setColorScheme(theme);
    setSelectedPreference(theme);

    try {
      storage.set(THEME_PREFERENCE_KEY, theme);
    } catch (e) {
      console.error("Failed to save theme preference.", e);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        selectedPreference,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
