import React from "react";
import { View, Text } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";

type CommentsBottomSheetProps = {
  id_reporte: number;
};

export const CommentsBottomSheet = ({
  id_reporte,
}: CommentsBottomSheetProps) => {
  return (
    <BottomSheetView className="flex-1 p-4 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center">
        <Text className="text-black dark:text-white text-lg font-semibold">
          Comentarios del reporte
        </Text>
        <Text className="text-gray-600 dark:text-gray-300 mt-2">
          ID Reporte: {id_reporte}
        </Text>
      </View>
    </BottomSheetView>
  );
};
