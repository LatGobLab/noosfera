import React from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { saveToken } from "@/src/auth/SecureStore"
import { useRouter } from 'expo-router';

const handleLogin = async (data: { email: string; password: string }) => {
  const router = useRouter();
    console.log("Hola");

  try {
    const response = await axios.post(
      "http://192.168.1.91:5000/auth/login",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extrae el token de la respuesta
    const { message, token, user } = response.data;

    console.log(message,token,user)

    // Guarda el token en SecureStore
    await saveToken( token);

    // Muestra una alerta de éxito
    Alert.alert("Success", "Login successful!");

    // Redirige al menú principal
    router.replace('/main');
  } catch (error) {
    // Manejo de errores
    console.error(error);

    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : "Login failed. Please try again.";
        
    Alert.alert("Error", errorMessage);
  }
};

export default handleLogin;