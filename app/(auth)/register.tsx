import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  View,
  AppState,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import supabase from "@/src/lib/supabase";
import { useColorScheme } from "nativewind";
import * as SystemUI from "expo-system-ui";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignInButton from "@/src/components/Auth/GoogleSignInButton";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const backgroundColor = colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF";
    SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [colorScheme]);

  async function signUpWithEmail() {
    Keyboard.dismiss();

    // Reset previous errors
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFormError("");

    // Validate fields
    let isValid = true;

    if (!email.trim()) {
      setEmailError("El correo electrónico es obligatorio");
      isValid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setLoading(true);

    if (emailRef.current) emailRef.current.blur();
    if (passwordRef.current) passwordRef.current.blur();
    if (confirmPasswordRef.current) confirmPasswordRef.current.blur();

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) setFormError(error.message);
    if (!session)
      setFormError(
        "Error en el registro, por favor intente nuevamente o contacte a este correo: dante@latgoblab.com"
      );
    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white dark:bg-neutral-900">
        <View className="flex-1">
          <View className="flex h-28 pt-14 justify-center items-center rounded-b-full">
            <Text className="text-black dark:text-white text-xl text-center">
              Ingresa los siguientes datos
            </Text>
          </View>

          <View className="rounded-tl-[3.0rem] flex-1 w-screen mt-10">
            <View className="space-y-4 mt-10">
              <View>
                <TextInput
                  ref={emailRef}
                  className={`bg-white dark:bg-neutral-800 text-black dark:text-white border ${
                    emailError
                      ? "border-red-500"
                      : "border-neutral-700 dark:border-neutral-700"
                  } w-11/12 mx-auto p-4 h-14 rounded-2xl`}
                  placeholder="Correo Electrónico"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (text.trim()) setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onSubmitEditing={() =>
                    passwordRef.current && passwordRef.current.focus()
                  }
                />
                {emailError ? (
                  <Text className="text-red-500 text-sm ml-6 mt-1">
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Campo de contraseña */}
              <View className="relative mt-10">
                <TextInput
                  ref={passwordRef}
                  className={`bg-white dark:bg-neutral-800 text-black dark:text-white border ${
                    passwordError
                      ? "border-red-500"
                      : "border-neutral-700 dark:border-neutral-700"
                  } w-11/12 mx-auto p-4 h-14 rounded-2xl`}
                  placeholder="Contraseña"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (text) {
                      if (text.length < 6) {
                        setPasswordError(
                          "La contraseña debe tener al menos 6 caracteres"
                        );
                      } else {
                        setPasswordError("");
                      }
                    } else {
                      setPasswordError("La contraseña es obligatoria");
                    }
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onSubmitEditing={() =>
                    confirmPasswordRef.current &&
                    confirmPasswordRef.current.focus()
                  }
                />
                <TouchableOpacity
                  className="absolute right-10 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
                {passwordError ? (
                  <Text className="text-red-500 text-sm ml-6 mt-1">
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              {/* Campo de confirmación de contraseña */}
              <View className="relative mt-10">
                <TextInput
                  ref={confirmPasswordRef}
                  className={`bg-white dark:bg-neutral-800 text-black dark:text-white border ${
                    confirmPasswordError
                      ? "border-red-500"
                      : "border-neutral-700 dark:border-neutral-700"
                  } w-11/12 mx-auto p-4 h-14 rounded-2xl`}
                  placeholder="Confirmar Contraseña"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (text === password) {
                      setConfirmPasswordError("");
                    }
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  onSubmitEditing={signUpWithEmail}
                  returnKeyType="go"
                />
                <TouchableOpacity
                  className="absolute right-10 top-4"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={24}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
                {confirmPasswordError ? (
                  <Text className="text-red-500 text-sm ml-6 mt-1">
                    {confirmPasswordError}
                  </Text>
                ) : null}
              </View>

              {/* Mostrar error de formulario del backend */}
              {formError ? (
                <View className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mx-5 mt-2">
                  <Text className="text-red-600 dark:text-red-400 text-center">
                    {formError}
                  </Text>
                </View>
              ) : null}

              {/* Botón de Registro */}
              <TouchableOpacity
                className={`${
                  loading ? "bg-gray-500" : "bg-black dark:bg-white"
                } rounded-2xl h-12 flex items-center justify-center mt-10 w-5/6 mx-auto`}
                onPress={signUpWithEmail}
                disabled={loading}
              >
                <Text className="text-white dark:text-black font-semibold text-lg">
                  {loading ? "Cargando..." : "Registrarse"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Separador O */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-0.5 bg-neutral-700" />
              <Text className="mx-4 text-neutral-400">O</Text>
              <View className="flex-1 h-0.5 bg-neutral-700" />
            </View>

            <View className="flex-1 justify-between ">
              <View className="space-y-3 gap-5">
                {/* Google */}
                <GoogleSignInButton />

                {/* Facebook */}
                {/* <TouchableOpacity className="flex-row items-center justify-center bg-transparent border border-neutral-700 rounded-full h-14 w-11/12 mx-auto">
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
                    }}
                    className="w-6 h-6 mr-2"
                  />
                  <Text className="text-black dark:text-white font-medium">
                    Ingresa con Facebook
                  </Text>
                </TouchableOpacity> */}

                {/* Apple */}
                <TouchableOpacity className="flex-row items-center justify-center bg-transparent border border-neutral-700 rounded-full h-14 w-11/12 mx-auto  ">
                  <Image
                    source={{
                      uri:
                        colorScheme === "dark"
                          ? "https://www.iconsdb.com/icons/preview/white/apple-xxl.png"
                          : "https://cdn-icons-png.flaticon.com/512/0/747.png",
                    }}
                    className="w-6 h-6 mr-2"
                  />
                  <Text className="text-black dark:text-white font-medium">
                    Ingresa con Apple
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Enlace para iniciar sesión */}
              <View className="flex-row justify-center  mt-8 mb-28">
                <TouchableOpacity className="mt-8">
                  <Text
                    className="text-black dark:text-white"
                    onPress={() => router.push("/login")}
                  >
                    ¿Ya tienes cuenta?
                    <Text className="font-extrabold"> Inicia sesión</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
