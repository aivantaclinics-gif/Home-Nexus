import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

// Mock auth hook to manage state since we don't have real Google OAuth credentials set up
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("elkanawy_auth_token") !== null
  );
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Simulated Google Sign In
  const login = async () => {
    // In a real app, this would use useGoogleSignIn from @workspace/api-client-react
    localStorage.setItem("elkanawy_auth_token", "simulated_token_123");
    setIsAuthenticated(true);
    setLocation("/dashboard");
  };

  const logout = async () => {
    // In a real app, this would use useLogout from @workspace/api-client-react
    localStorage.removeItem("elkanawy_auth_token");
    setIsAuthenticated(false);
    queryClient.clear();
    setLocation("/");
  };

  return {
    isAuthenticated,
    user: isAuthenticated ? {
      id: 1,
      name: "Ahmed Elkanawy",
      email: "ahmed@elkanawy.os",
      avatarUrl: `${import.meta.env.BASE_URL}images/user-avatar.png`,
    } : null,
    login,
    logout,
  };
}
