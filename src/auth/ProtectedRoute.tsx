import React, { ReactNode, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode; // Contenido a proteger
}

// Implementación del componente de rutas protegidas
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/index");
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return null; // Muestra un loader o pantalla en blanco mientras se verifica
  }

  return <>{children}</>; // Renderiza el contenido protegido
};

export default ProtectedRoute;
