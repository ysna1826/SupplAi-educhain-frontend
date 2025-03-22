"use client";

import { useAuthContext } from "@/components/auth/auth-provider";
import { UserRole } from "@/types/auth";

export function useAuth() {
  const context = useAuthContext();

  // Additional helper functions
  const hasRole = (role: UserRole): boolean => {
    return context.user?.role === role;
  };

  const isManager = (): boolean => {
    return hasRole(UserRole.MANAGER);
  };

  const isFarmer = (): boolean => {
    return hasRole(UserRole.FARMER);
  };

  const isInvestor = (): boolean => {
    return hasRole(UserRole.INVESTOR);
  };

  return {
    ...context,
    hasRole,
    isManager,
    isFarmer,
    isInvestor,
  };
}
