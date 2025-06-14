import React, {
  forwardRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import { View, BackHandler } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import { useMapDetails } from "@/src/hooks/useMapDetails";
import { ReportLoadingState } from "@/src/components/Map/bottomsheet/ReportLoadingState";
import { ReportErrorState } from "@/src/components/Map/bottomsheet/ReportErrorState";
import { ReportDetailsContent } from "@/src/components/Map/bottomsheet/ReportDetailsContent";
import { ReporteDetails } from "@/src/types/reporteDetails";

type ReportDetailsSheetProps = {
  reportId: number | null;
  onClose?: () => void;
};

export const ReportDetailsSheet = forwardRef<
  BottomSheetModal,
  ReportDetailsSheetProps
>(({ reportId, onClose }, ref) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  useImperativeHandle(ref, () => bottomSheetRef.current!);

  // Use the map details hook only when reportId is available
  const {
    data: reporteDetails,
    isLoading,
    error,
    isError,
  } = useMapDetails(reportId || 0);
  // Handle back button press to close sheet instead of app
  useEffect(() => {
    const handleBackPress = () => {
      if (isSheetOpen && bottomSheetRef.current) {
        bottomSheetRef.current.close();
        return true; // Prevent default back action
      }
      return false; // Let default back action occur
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, [isSheetOpen]);

  // Track sheet open/close state
  const handleSheetChange = useCallback(
    (index: number) => {
      const wasOpen = isSheetOpen;
      const isNowOpen = index >= 0;

      setIsSheetOpen(isNowOpen);

      // Si se cerró el sheet, llamar al callback onClose
      if (wasOpen && !isNowOpen && onClose) {
        onClose();
      }
    },
    [isSheetOpen, onClose]
  );

  // Configure points for bottom sheet
  const snapPoints = useMemo(() => ["50%", "95%"], []);

  // Estilo personalizado para el handle (barra superior)
  const handleIndicatorStyle = useMemo(
    () => ({
      backgroundColor: isDark ? "#FFFFFF" : "#",
      width: 50,
      height: 5,
    }),
    [isDark]
  );

  // Estilo para el header completo
  const handleStyle = useMemo(
    () => ({
      backgroundColor: isDark ? "#0d0f15" : "#F3F4F6",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: 40,
    }),
    [isDark]
  );

  // Renderizador personalizado para el backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} opacity={0.7} pressBehavior="close" />
    ),
    []
  );

  // Render loading state
  const renderLoadingState = () => <ReportLoadingState />;

  // Render error state
  const renderErrorState = () => (
    <ReportErrorState error={error} reportId={reportId} />
  );

  // Render report details content
  const renderReportDetails = () => {
    if (!reporteDetails) return null;
    return (
      <ReportDetailsContent reporteDetails={reporteDetails as ReporteDetails} />
    );
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleIndicatorStyle={handleIndicatorStyle}
      handleStyle={handleStyle}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      animateOnMount={true}
      overDragResistanceFactor={0}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: isDark ? "#25292c" : "#FFFFFF",
      }}
      backgroundComponent={({ style }) => (
        <View
          style={[style, { borderTopLeftRadius: 30, borderTopRightRadius: 30 }]}
          className="bg-background dark:bg-background-dark"
        />
      )}
      onChange={handleSheetChange}
    >
      <BottomSheetView className="flex-1" style={{ flex: 1 }}>
        {isLoading && renderLoadingState()}
        {isError && renderErrorState()}
        {!isLoading && !isError && reporteDetails && renderReportDetails()}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ReportDetailsSheet.displayName = "ReportDetailsSheet";
