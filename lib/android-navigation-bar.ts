import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { ThemeMode } from '~/types/types'

export async function setAndroidNavigationBar(theme: ThemeMode) {
  if (Platform.OS !== 'android') return;
  await NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
  await NavigationBar.setBackgroundColorAsync(
    theme === 'dark' ? NAV_THEME.dark.background : NAV_THEME.light.background
  );
}
