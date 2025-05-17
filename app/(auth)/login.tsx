import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  View,
  TextInput,
  Text,
  AppState,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import supabase from "@/src/lib/supabase";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignInButton from "@/src/components/Auth/GoogleSignInButton";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        Keyboard.dismiss();
        router.replace("/(protected)");
      }
    };

    checkAuth();

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          Keyboard.dismiss();
          router.replace("/(protected)");
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  async function signInWithEmail() {
    Keyboard.dismiss();

    // Reset previous errors
    setEmailError("");
    setPasswordError("");
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
    }

    if (!isValid) {
      return;
    }

    setLoading(true);

    if (emailRef.current) {
      emailRef.current.blur();
    }

    if (passwordRef.current) {
      passwordRef.current.blur();
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) setFormError(error.message);
    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background dark:bg-background-dark">
        <View className="flex-1 ">
          <View className="flex h-28 pt-14 justify-center items-center rounded-b-full">
            <Text className="text-black dark:text-white text-xl text-center">
              Inicia con tu cuenta
            </Text>
          </View>

          <View className=" rounded-tl-[3.0rem] flex-1  w-screen mt-10">
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
                      setPasswordError("");
                    }
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onSubmitEditing={signInWithEmail}
                  returnKeyType="go"
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

              {/* Mostrar error de formulario del backend */}
              {formError ? (
                <View className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mx-5 mt-2">
                  <Text className="text-red-600 dark:text-red-400 text-center">
                    {formError}
                  </Text>
                </View>
              ) : null}

              {/* Botón de Iniciar Sesión */}
              <TouchableOpacity
                className={`${
                  loading ? "bg-gray-500" : "bg-black dark:bg-white"
                } rounded-2xl h-12 flex items-center justify-center mt-10 w-5/6 mx-auto`}
                onPress={signInWithEmail}
                disabled={loading}
              >
                <Text className="text-white dark:text-black font-semibold text-lg">
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Separador O */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-0.5 bg-neutral-700" />
              <Text className="mx-4 text-neutral-400">O</Text>
              <View className="flex-1 h-0.5 bg-neutral-700" />
            </View>

            {/* Botones de inicio de sesión con redes sociales */}
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

              {/* Enlace para registrarse */}
              <View className="flex-row justify-center mt-8 mb-28">
                <TouchableOpacity className="mt-8">
                  <Text
                    className="text-black dark:text-white"
                    onPress={() => router.push("/register")}
                  >
                    ¿Aún no tienes cuenta?
                    <Text className="font-extrabold"> Regístrate</Text>
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
