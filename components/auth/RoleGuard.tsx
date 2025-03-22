"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserRole } from "@/types/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/auth/login",
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // If user's role is not allowed, redirect to dashboard
    if (!allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, allowedRoles, redirectTo, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>Checking authorization...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not authorized, show nothing (redirect will happen)
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  // If authenticated and authorized, render children
  return <>{children}</>;
}
