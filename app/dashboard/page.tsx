"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserRole } from "@/types/auth";
import { Loader2 } from "lucide-react";

export default function DashboardRouter() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    switch (user.role) {
      case UserRole.MANAGER:
        router.push("/dashboard/manager");
        break;
      case UserRole.FARMER:
        router.push("/dashboard/farmer");
        break;
      case UserRole.INVESTOR:
        router.push("/dashboard/investor");
        break;
      default:
        router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-white text-lg">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
