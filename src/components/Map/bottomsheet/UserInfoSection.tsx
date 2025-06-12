import React from "react";
import { View, Text, Image } from "react-native";
import { useColorScheme } from "nativewind";

type UserInfoSectionProps = {
  profileAvatarUrl?: string | null;
  profileUsername?: string | null;
  nombreOrganizacion?: string | null;
};

export const UserInfoSection = ({
  profileAvatarUrl,
  profileUsername,
  nombreOrganizacion,
}: UserInfoSectionProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Información del Usuario
      </Text>

      <View className="flex-row items-center mb-3">
        {profileAvatarUrl ? (
          <Image
            source={{ uri: profileAvatarUrl }}
            className="w-12 h-12 rounded-full mr-3"
            style={{ backgroundColor: isDark ? "#374151" : "#f3f4f6" }}
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3" />
        )}

        <View className="flex-1">
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {profileUsername || "Usuario Anónimo"}
          </Text>
          {nombreOrganizacion && (
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {nombreOrganizacion}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
