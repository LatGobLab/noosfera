import React from "react";
import { View, Text, TextInput } from "react-native";
import { useColorScheme } from "nativewind";

type ReportDescriptionSectionProps = {
  description: string;
  onChangeDescription: (text: string) => void;
};

export const ReportDescriptionSection = ({
  description,
  onChangeDescription,
}: ReportDescriptionSectionProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="mb-6">
      <Text
        className="text-lg font-medium mb-2"
        style={{ color: isDark ? "#ffffff" : "#000000" }}
      >
        Descripción del incidente
      </Text>
      <TextInput
        className={`border rounded-lg p-3 min-h-[120px] text-base ${
          isDark
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-300 bg-gray-50 text-black"
        }`}
        placeholder="Describe lo que ocurrió..."
        placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={onChangeDescription}
      />
    </View>
  );
};
