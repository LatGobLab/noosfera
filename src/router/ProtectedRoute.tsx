import React, { ReactNode, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
