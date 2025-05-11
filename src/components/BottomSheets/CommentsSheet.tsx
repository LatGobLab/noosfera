import React, { forwardRef } from "react";
import { View, Text } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

type CommentsBottomSheetProps = {
  id_reporte: number;
};

export const CommentsBottomSheet = forwardRef<
  BottomSheetModal,
  CommentsBottomSheetProps
>(({ id_reporte }, ref) => {
  // configure points for bottom sheet
  const snapPoints = ["100%"];

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
    >
      <BottomSheetView className="flex-1 items-center justify-center p-6 bg-background dark:bg-background-dark">
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
