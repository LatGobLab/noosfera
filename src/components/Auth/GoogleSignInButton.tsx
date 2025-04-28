import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";
import { useGoogleAuth } from "@/src/lib/googleAuth";

interface GoogleSignInButtonProps {
  className?: string;
}

export default function GoogleSignInButton({
  className = "",
}: GoogleSignInButtonProps) {
  const { signInWithGoogle } = useGoogleAuth();

  const handlePress = () => {
    signInWithGoogle().catch((err) => {
      console.error("Error al iniciar sesión con Google:", err);
    });
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center bg-transparent border border-neutral-700 rounded-full h-14 w-11/12 mx-auto ${className}`}
      onPress={handlePress}
    >
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
        }}
        className="w-6 h-6 mr-2"
      />
      <Text className="text-black dark:text-white font-medium">
        Ingresa con Google
      </Text>
    </TouchableOpacity>
  );
}
