import { View, Text, Button } from "react-native";
import supabase from "@/src/lib/supabase";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function HomeScreen() {
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    signOut();
  };

  return (
    <View>
      <Text>Home Screen (Protected)</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
