"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType, User, UserRole } from "@/types/auth";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check local storage for existing session
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user");

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error("Authentication initialization error:", err);
        setError("Failed to initialize authentication");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // For development, simulate wallet connection
      // In production, implement actual wallet connection logic

      // Simulate address generation
      const address = "0x" + Math.random().toString(16).substring(2, 42);

      // Randomly assign a role for development
      const roles = [UserRole.MANAGER, UserRole.FARMER, UserRole.INVESTOR];
      const role = roles[Math.floor(Math.random() * roles.length)];

      const newUser: User = {
        address,
        role,
        isAuthenticated: true,
      };

      // Save to local storage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      // Update state
      setUser(newUser);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    // Clear from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }

    // Update state
    setUser(null);
  };

  // Context value with optional chaining for user properties
  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
