import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useUserProfile } from "@/src/hooks/useUserProfile";

export default function Home() {
  const { profile, isLoading } = useUserProfile();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-background-dark">
      <Text className="mt-4 text-black dark:text-white">
        {profile?.username || "Usuario"}
      </Text>
    </View>
  );
}
