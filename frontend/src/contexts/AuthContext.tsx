import { ReactNode, useEffect, useState } from "react";
import { User } from "@/types/user";
import { getUser } from "@/services/authService";
import { AuthContext, type AuthContextType } from "./auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    setUser(null);
    // Optional: Make API call to logout endpoint if your backend has one
    // await api.post("/api/auth/logout");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
