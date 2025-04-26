import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import supabase from "@/src/lib/supabase";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { UserProfile } from "@/src/Types/user";
import { userProfileStorage, PROFILE_STORAGE_KEY } from "@/src/lib/mmkvStorage";
import { useColorScheme } from "nativewind";
import AvatarPicker from "@/src/components/Profile/AvatarPicker";

export default function CompleteProfileScreen() {
  const { profile, refreshProfile } = useUserProfile();
  const [username, setUsername] = useState(profile?.username || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const { colorScheme } = useColorScheme();

  // Avatar related state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile?.avatar_url || null
  );
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fullNameRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);

  const validateUsername = async (value: string) => {
    if (!value.trim()) {
      setUsernameError("El nombre de usuario es requerido");
      return false;
    }

    if (value.includes(" ")) {
      setUsernameError("El nombre de usuario no debe contener espacios");
      return false;
    }

    if (value !== profile?.username) {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", value)
        .maybeSingle();

      if (data) {
        setUsernameError("Este nombre de usuario ya está en uso");
        return false;
      }
    }

    return true;
  };

  const validateFullName = (value: string) => {
    if (!value.trim()) {
      setFullNameError("El nombre completo es requerido");
      return false;
    }

    // Check if full name has at least two parts (name and surname)
    const nameParts = value.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setFullNameError("Ingresa nombre y apellido");
      return false;
    }

    return true;
  };

  // Function to handle avatar upload to Supabase
  const uploadAvatarToSupabase = async (uri: string) => {
    if (!session?.user) {
      Alert.alert("Error", "No hay sesión activa");
      return null;
    }

    try {
      setIsUploadingAvatar(true);

      // Convert the local URI to a binary ArrayBuffer
      const arrayBuffer = await fetch(uri).then((res) => res.arrayBuffer());

      // Get file extension from URI
      const fileExt = uri.split(".").pop()?.toLowerCase() ?? "jpeg";

      // Create a unique filename
      const path = `${session.user.id}_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Error", "No se pudo subir la imagen. Inténtalo de nuevo.");
      return null;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle avatar selection from AvatarPicker
  const handleAvatarSelect = (uri: string | null) => {
    setLocalAvatarUri(uri);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    // Reset previous errors
    setUsernameError("");
    setFullNameError("");
    setFormError("");

    // Validate fields
    const isUsernameValid = await validateUsername(username);
    const isFullNameValid = validateFullName(fullName);

    if (!isUsernameValid || !isFullNameValid) {
      return;
    }

    if (!session?.user) {
      Alert.alert("Error", "No hay sesión activa");
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload avatar if a new one has been selected
      let finalAvatarUrl = avatarUrl;
      if (localAvatarUri) {
        finalAvatarUrl = await uploadAvatarToSupabase(localAvatarUri);
      }

      // Update the profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName,
          avatar_url: finalAvatarUrl,
        })
        .eq("id", session.user.id);

      if (error) {
        throw error;
      }

      // Update the local profile
      const updatedProfile: UserProfile = {
        ...profile!,
        id: session.user.id,
        username,
        full_name: fullName,
        avatar_url: finalAvatarUrl,
      };

      // Save to MMKV storage
      userProfileStorage.set(
        PROFILE_STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );

      // Refresh profile
      await refreshProfile();

      // Navigate to tabs
      router.replace("/(protected)/(tabs)");
    } catch (error) {
      console.error("Error updating profile:", error);
      setFormError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 p-5  bg-white dark:bg-neutral-900">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center pt-5 mb-8">
          Completa tu perfil
        </Text>

        {/* Avatar Picker */}
        <View className="flex items-center justify-center mb-6">
          <AvatarPicker
            currentAvatarUrl={avatarUrl}
            onAvatarSelect={handleAvatarSelect}
            size={120}
            uploading={isUploadingAvatar}
          />
        </View>

        <View className="space-y-4 mt-4">
          {/* Nombre completo */}
          <View>
            <Text className="text-gray-900 dark:text-white text-sm ml-6 mb-1">
              Nombre completo
            </Text>
            <TextInput
              ref={fullNameRef}
              className={`bg-white dark:bg-neutral-800 text-black dark:text-white border ${
                fullNameError
                  ? "border-red-500"
                  : "border-neutral-700 dark:border-neutral-700"
              } w-11/12 mx-auto p-4 h-14 rounded-2xl`}
              placeholder="Nombre completo"
              placeholderTextColor="#9ca3af"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (text.trim()) setFullNameError("");
              }}
              autoCapitalize="words"
              keyboardAppearance="dark"
              onSubmitEditing={() =>
                usernameRef.current && usernameRef.current.focus()
              }
            />
            {fullNameError ? (
              <Text className="text-red-500 text-sm ml-6 mt-1">
                {fullNameError}
              </Text>
            ) : null}
          </View>

          {/* Nombre de usuario */}
          <View className="mt-4">
            <Text className="text-gray-900 dark:text-white text-sm ml-6 mb-1">
              Nombre de usuario
            </Text>
            <TextInput
              ref={usernameRef}
              className={`bg-white dark:bg-neutral-800 text-black dark:text-white border ${
                usernameError
                  ? "border-red-500"
                  : "border-neutral-700 dark:border-neutral-700"
              } w-11/12 mx-auto p-4 h-14 rounded-2xl`}
              placeholder="Nombre de usuario"
              placeholderTextColor="#9ca3af"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (text.trim()) setUsernameError("");
              }}
              autoCapitalize="none"
              autoComplete="username"
              keyboardAppearance="dark"
              onSubmitEditing={handleSubmit}
            />
            {usernameError ? (
              <Text className="text-red-500 text-sm ml-6 mt-1">
                {usernameError}
              </Text>
            ) : null}
          </View>

          {/* Mostrar error de formulario del backend */}
          {formError ? (
            <View className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mx-5 mt-4">
              <Text className="text-red-600 dark:text-red-400 text-center">
                {formError}
              </Text>
            </View>
          ) : null}

          {/* Botón de enviar */}
          <TouchableOpacity
            className={`${
              isSubmitting || isUploadingAvatar
                ? "bg-gray-500"
                : "bg-black dark:bg-white"
            } rounded-2xl h-12 flex items-center justify-center mt-8 w-5/6 mx-auto`}
            onPress={handleSubmit}
            disabled={isSubmitting || isUploadingAvatar}
          >
            {isSubmitting || isUploadingAvatar ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white dark:text-black font-semibold text-lg">
                Guardar Perfil
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
