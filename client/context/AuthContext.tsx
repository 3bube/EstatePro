"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import api from "@/api/api";
import { useRouter } from "next/navigation";
import { saveToken, removeToken } from "@/lib/localStorage";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  data: User;
}

interface AuthContextType {
  user: User | null;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ) => Promise<void>;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data);
        setIsAuthenticated(true);
        // Don't redirect here - let the components handle their own routing
      } catch {
        // Don't log out or redirect on auth check failure
        // Just update the state
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<LoginResponse> => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      saveToken(data.token, rememberMe);
      setUser(data.data);
      setIsAuthenticated(true);

      // Redirect to dashboard after successful login
      router.push("/dashboard");

      // Return the response data so the component can handle redirection
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ) => {
    try {
      const { data } = await api.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
        role,
      });
      saveToken(data.token);
      setUser(data.data);
      setIsAuthenticated(true);
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Continue with logout even if the API call fails
      console.error("Logout API error:", error);
    }
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
