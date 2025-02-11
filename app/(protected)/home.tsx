import { View, Text, Button } from "react-native";
import supabase from "../../lib/supabase";
import { useAuthStore } from "../../stores/useAuthStore";

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
