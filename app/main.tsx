import ProtectedRoute from "@/src/auth/ProtectedRoute";
import { clearTokens } from "@/src/auth/SecureStore";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, Alert } from "react-native";

export default function Main() {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await clearTokens();
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <ProtectedRoute>
      <Text>Bienvenido al menú principal</Text>

      <Pressable onPress={handleSubmit}>
        <Text className="text-blue-500 text-lg mt-4">Salir de la sesion</Text>
      </Pressable>
    </ProtectedRoute>
  );
}
