import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/src/stores/useAuthStore";
import ThemeSelector from "@/src/components/ThemeSelector";
import { router } from "expo-router";
import supabase from "@/src/lib/supabase";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import ToastExample from "@/src/components/ToastExample";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
export default function ProfileScreen() {
  const session = useAuthStore((state) => state.session);
  const { profile, isLoading, error, refreshProfile } = useUserProfile();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["60%", "80%"];

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const userEmail = session?.user?.email || "usuario@ejemplo.com";
  const userName = profile?.username || userEmail.split("@")[0] || "Usuario";
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    signOut();
  };

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
    setIsOpen(true);
  }, []);

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <TouchableOpacity onPress={openBottomSheet}>
          <Text className="text-white">Open</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => setIsOpen(false)}
      >
        <BottomSheetView className="flex-1 bg-white">
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
