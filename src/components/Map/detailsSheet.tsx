import React, {
  forwardRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  BackHandler,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import { useMapDetails } from "@/src/hooks/useMapDetails";

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
  const snapPoints = useMemo(() => ["70%", "100%"], []);

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
    []
  );

  // Render loading state
  const renderLoadingState = () => (
    <View className="flex-1 items-center justify-center py-8">
      <ActivityIndicator size="large" color={isDark ? "#60a5fa" : "#3b82f6"} />
      <Text className="text-gray-600 dark:text-gray-400 mt-4">
        Cargando detalles del reporte...
      </Text>
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center py-8 px-4">
      <Text className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
        Error al cargar el reporte
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-center">
        {error?.message || "No se pudieron cargar los detalles del reporte"}
      </Text>
      {reportId && (
        <Text className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          ID del reporte: {reportId}
        </Text>
      )}
    </View>
  );

  // Render report details content
  const renderReportDetails = () => {
    if (!reporteDetails) return null;

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header del reporte */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Detalles del Reporte
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            ID: {reporteDetails.id_reporte}
          </Text>
        </View>

        {/* Información del usuario */}
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Información del Usuario
          </Text>

          <View className="flex-row items-center mb-3">
            {reporteDetails.profile_avatar_url ? (
              <Image
                source={{ uri: reporteDetails.profile_avatar_url }}
                className="w-12 h-12 rounded-full mr-3"
                style={{ backgroundColor: isDark ? "#374151" : "#f3f4f6" }}
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3" />
            )}

            <View className="flex-1">
              <Text className="font-semibold text-gray-900 dark:text-gray-100">
                {reporteDetails.profile_username || "Usuario Anónimo"}
              </Text>
              {reporteDetails.nombre_organizacion && (
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {reporteDetails.nombre_organizacion}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Información del reporte */}
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Detalles del Reporte
          </Text>

          <View className="space-y-2">
            <View className="flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tipo de Reporte
              </Text>
              <Text className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                {reporteDetails.tipo_nombre || "No especificado"}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Usuario ID
              </Text>
              <Text className="text-sm text-gray-900 dark:text-gray-100 font-mono ">
                {reporteDetails.fk_reporte_users}
              </Text>
            </View>
          </View>
        </View>

        {/* Espacio adicional */}
        <View className="mb-8">
          <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">
            Más detalles próximamente...
          </Text>
        </View>
      </ScrollView>
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
      enableContentPanningGesture={true}
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
          className="bg-background dark:bg-[#25292c]"
        />
      )}
      onChange={handleSheetChange}
    >
      <BottomSheetView className="flex-1 px-4 pt-4" style={{ flex: 1 }}>
        {isLoading && renderLoadingState()}
        {isError && renderErrorState()}
        {!isLoading && !isError && reporteDetails && renderReportDetails()}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ReportDetailsSheet.displayName = "ReportDetailsSheet";
