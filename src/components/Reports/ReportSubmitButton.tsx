import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { useColorScheme } from "nativewind";

type ReportSubmitButtonProps = {
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  submitLabel?: string;
  uploadingLabel?: string;
  submittingLabel?: string;
};

export const ReportSubmitButton = ({
  onSubmit,
  isValid,
  isSubmitting,
  isUploading,
  submitLabel = "Enviar reporte",
  uploadingLabel = "Subiendo imagen...",
  submittingLabel = "Enviando...",
}: ReportSubmitButtonProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      className={`py-3 px-4 rounded-lg items-center mb-8 ${
        isValid && !isSubmitting && !isUploading
          ? isDark
            ? "bg-green-600"
            : "bg-green-500"
          : isDark
          ? "bg-gray-700"
          : "bg-gray-300"
      }`}
      disabled={!isValid || isSubmitting || isUploading}
      onPress={onSubmit}
    >
      {isSubmitting || isUploading ? (
        <View className="flex-row items-center">
          <ActivityIndicator
            color={isDark ? "#9ca3af" : "#6b7280"}
            size="small"
          />
          <Text
            className="text-center font-medium ml-2"
            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
          >
            {isUploading ? uploadingLabel : submittingLabel}
          </Text>
        </View>
      ) : (
        <Text
          className="text-center font-medium"
          style={{
            color: isValid ? "white" : isDark ? "#9ca3af" : "#6b7280",
          }}
        >
          {submitLabel}
        </Text>
      )}
    </TouchableOpacity>
  );
};
