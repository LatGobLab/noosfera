import React, { useRef, useEffect } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCommentsBottomSheetStore } from "@/src/stores/commentsBottomSheetStore";
import { CommentsBottomSheet } from "./CommentsBottomSheet";

export const GlobalCommentsBottomSheet = () => {
  const { isOpen, reporteId, close } = useCommentsBottomSheetStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["100%"];

  useEffect(() => {
    if (isOpen && bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    }
  }, [isOpen]);

  if (!isOpen || reporteId === null) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={close}
      index={0}
      handleStyle={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#ddd",
        width: 40,
      }}
    >
      <CommentsBottomSheet id_reporte={reporteId} />
    </BottomSheet>
  );
};
