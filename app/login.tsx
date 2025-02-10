import { useEffect, useState } from "react";
import { View, Text, Alert, TextInput, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { saveToken } from "@/src/auth/SecureStore";
import { useRouter } from "expo-router";

type loginData = {
  email: string;
  password: string;
};

const Login = () => {
  const [data, setData] = useState<loginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<loginData>>({});
  const router = useRouter();

  const handleChange = (key: keyof loginData, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    // Clear errors as user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: undefined,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<loginData> = {};

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors before submitting."
      );
      return;
    }
    console.log("Data being sent:", data);

    try {
      const response = await axios.post(
        "http://192.168.22.88:5000/auth/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Alert.alert("Success", "Registration successful!");
      console.log(response.data);
      console.log(response.data.token);
      await saveToken(response.data.token);
      router.push("main");
    } catch (error) {
      console.log(error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Registration failed. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View>
      <Text className="">Login</Text>
      <TextInput
        className="border mx-4 mt-5"
        placeholder="Email"
        value={data.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      {errors.email && (
        <Text className="text-red-500 mx-4">{errors.email}</Text>
      )}
      <TextInput
        className="border mx-4 mt-5"
        placeholder="Contraseña"
        value={data.password}
        onChangeText={(text) => handleChange("password", text)}
      />
      {errors.password && (
        <Text className="text-red-500 mx-4">{errors.password}</Text>
      )}
      <Pressable onPress={handleSubmit}>
        <Text className="text-blue-500 text-lg mt-4">Enviar</Text>
      </Pressable>
    </View>
  );
};

export default Login;
