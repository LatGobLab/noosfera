import React, { useMemo } from "react";
import { View } from "react-native";
import useMapPins from "@/src/hooks/useMapPins";
import { useMapLogic } from "@/src/components/Map/useMapLogic";
import { MapViewComponent } from "@/src/components/Map/MapViewComponent";
import { MapLoadingState, MapErrorState } from "@/src/components/Map/MapStates";

export default function MapScreen() {
  const { data: pins, isLoading, error, refreshPins } = useMapPins();
  const { initialRegion, handlePinPress } = useMapLogic();

  // Memoizar los pins para evitar re-renders cuando no han cambiado
  const stablePins = useMemo(
    () => pins || [],
    [pins?.map((p) => p.id_reporte).join(",")]
  );

  console.log("pins count:", pins?.length, "isLoading:", isLoading);

  if (isLoading) {
    return <MapLoadingState />;
  }

  if (error) {
    return <MapErrorState error={error} />;
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <MapViewComponent
        initialRegion={initialRegion}
        pins={stablePins}
        onPinPress={handlePinPress}
      />
    </View>
  );
}
