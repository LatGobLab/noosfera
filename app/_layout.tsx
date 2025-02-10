import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useLayoutEffect, useState } from "react";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export default function RootLayout() {
  const { effectiveColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useLayoutEffect(() => {
    setAndroidNavigationBar(effectiveColorScheme);
    setIsColorSchemeLoaded(true);
  }, [effectiveColorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} translucent />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Starter Base",
            headerRight: () => <ThemeToggle />,
            headerTransparent: true,
          }}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
