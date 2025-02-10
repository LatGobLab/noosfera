import { View, Text, TextInput, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";

const ip = process.env.EXPO_PUBLIC_IP;

type RegisterData = {
  email: string;
  password: string;
  name: string;
};

const Register = () => {
  const [data, setData] = useState<RegisterData>({
    email: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  const handleChange = (key: keyof RegisterData, value: string) => {
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
    const newErrors: Partial<RegisterData> = {};

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

    if (!data.name) {
      newErrors.name = "Name is required";
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
        "http://192.168.1.67:3000/auth/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Alert.alert("Success", "Registration successful!");
      console.log(response.data);
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
      <Text>Register</Text>
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
      <TextInput
        className="border mx-4 mt-5"
        placeholder="Name"
        value={data.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      {errors.name && <Text className="text-red-500 mx-4">{errors.name}</Text>}
      <Pressable onPress={handleSubmit}>
        <Text className="text-blue-500 text-lg mt-4">Enviar</Text>
      </Pressable>
    </View>
  );
};

export default Register;
