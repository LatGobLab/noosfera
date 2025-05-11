import React, { forwardRef, useMemo, useCallback } from "react";
import { View, Text } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";

type CommentsBottomSheetProps = {
  id_reporte: number;
};

export const CommentsBottomSheet = forwardRef<
  BottomSheetModal,
  CommentsBottomSheetProps
>(({ id_reporte }, ref) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  // configure points for bottom sheet
  const snapPoints = useMemo(() => ["100%"], []);

  // Estilo personalizado para el handle (barra superior)
  const handleIndicatorStyle = useMemo(
    () => ({
      backgroundColor: isDark ? "#FFFFFF" : "#0d0f15",
      width: 50,
      height: 5,
    }),
    [isDark]
  );

  // Estilo para el header completo
  const handleStyle = useMemo(
    () => ({
      backgroundColor: isDark ? "#25292c" : "#F3F4F6",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }),
    [isDark]
  );

  // Renderizador personalizado para el backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} opacity={0.7} pressBehavior="close" />
    ),
    [isDark]
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleIndicatorStyle={handleIndicatorStyle}
      handleStyle={handleStyle}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      animateOnMount={true}
      overDragResistanceFactor={0.5}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: isDark ? "#25292c" : "#FFFFFF", // Color de fondo blanco por defecto
      }}
      backgroundComponent={({ style }) => (
        <View
          style={[style, { borderTopLeftRadius: 30, borderTopRightRadius: 30 }]}
          className="bg-background dark:bg-[#25292c]"
        />
      )}
    >
      <BottomSheetView className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
          Comentarios
        </Text>
        <View className="my-4">
          <Text className="text-base text-gray-800 dark:text-gray-200">
            ID del reporte: {id_reporte}
          </Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
