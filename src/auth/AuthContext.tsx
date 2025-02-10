import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getStoredToken } from "./SecureStore";

// Define la interfaz del contexto
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  loading: boolean;
}

// Valores iniciales del contexto
const initialAuthContext: AuthContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loading: true,
};

// Crea el contexto
export const AuthContext = createContext<AuthContextType>(initialAuthContext);

// Define las props del AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getStoredToken(); // Obtén el token almacenado
      setIsAuthenticated(!!token); // Actualiza el estado de autenticación
      setLoading(false);
    };

    checkAuth();
  }, []); // !!! Se necesita un arreglo de dependencias para que se ejecute solo una vez

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
