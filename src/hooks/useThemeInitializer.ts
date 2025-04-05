import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

const THEME_PREFERENCE_KEY = '@MyApp:themePreference';

export function useThemeInitializer() {
  const { setColorScheme } = useColorScheme();
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (storedPreference !== null) {
          setColorScheme(storedPreference as 'light' | 'dark' | 'system');
        }
      } catch (e) {
        console.error('Failed to initialize theme.', e);
      } finally {
        setIsThemeLoading(false);
      }
    };

    initializeTheme();
  }, []);

  return isThemeLoading;
} 