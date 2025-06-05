import React from "react";
import { View, Text, Image } from "react-native";

type PostCardHeaderProps = {
  profile_avatar_url: string;
  profile_username: string;
  nombre_organizacion: string;
  estatus: boolean;
};
export const PostCardHeader = ({
  profile_avatar_url,
  profile_username,
  nombre_organizacion,
  estatus,
}: PostCardHeaderProps) => {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-3 mx-4">
        <View className="flex-row items-center">
          {profile_avatar_url ? (
            <Image
              source={{ uri: profile_avatar_url }}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3" />
          )}
          <View className="flex-col gap-1">
            <Text className="font-semibold text-gray-800 dark:text-gray-200">
              {profile_username ?? "Usuario Anónimo"}
            </Text>
            <Text className="text-xs text-gray-600 dark:text-gray-400">
              {nombre_organizacion ?? ""}
            </Text>
          </View>
        </View>

        <Text
          className={`font-semibold text-base text-center bg-background-dark dark:bg-background rounded-full px-4 py-2 ${
            estatus
              ? "text-green-600 dark:text-green-400"
              : "text-white dark:text-black"
          }`}
        >
          {estatus ? "Resuelto" : "No atendido"}
        </Text>
      </View>
    </View>
  );
};
