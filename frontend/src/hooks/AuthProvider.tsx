import { useEffect, useState, type ReactNode } from "react";
import { apiRequest, clearStoredToken, setStoredToken } from "@/lib/api";
import { STORAGE_KEYS } from "@/lib/constants";
import { AuthContext, type AuthUser } from "./auth-context";

interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.authToken);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest<{ user: AuthUser }>("/api/auth/me");
        setUser(response.user);
      } catch {
        clearStoredToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setStoredToken(response.token);
    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    setStoredToken(response.token);
    setUser(response.user);
  };

  const signOut = () => {
    clearStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
