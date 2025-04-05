import { View, Text } from "react-native";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function ProfileScreen() {
  const session = useAuthStore((state) => state.session);

  return (
    <View>
      <Text>Profile Screen</Text>
      <Text>Email: {session?.user?.email}</Text>
    </View>
  );
}
