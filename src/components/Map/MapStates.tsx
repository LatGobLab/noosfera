import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useColorScheme } from "nativewind";

export const MapLoadingState = React.memo(() => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 mt-14 justify-center items-center bg-background dark:bg-background-dark">
      <ActivityIndicator size="large" color={isDark ? "#60a5fa" : "#3b82f6"} />
      <Text className="mt-4 text-foreground dark:text-white">
        Cargando mapa...
      </Text>
    </View>
  );
});

export const MapErrorState = React.memo(({ error }: { error: Error }) => (
  <View className="flex-1 justify-center items-center bg-background dark:bg-background-dark p-4">
    <Text className="text-red-500 dark:text-red-400 text-center font-semibold">
      Error al cargar el mapa
    </Text>
    <Text className="text-foreground dark:text-white text-center mt-2">
      {error.message}
    </Text>
  </View>
));

MapLoadingState.displayName = "MapLoadingState";
MapErrorState.displayName = "MapErrorState";
