"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import { useToken } from "@/lib/hooks/useToken";
import { UserRole } from "@/types/auth";
import { Token } from "@/types/token"; // Adjust the import path as necessary
import InvestForm from "@/components/tokens/InvestForm";
import TokenDetails from "@/components/tokens/TokenDetails";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function InvestPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getTokenById, loading: tokenLoading, error: tokenError } = useToken();
  const [token, setToken] = useState<Token | null>(null);

  useEffect(() => {
    async function loadToken() {
      if (id) {
        const tokenData = await getTokenById(id.toString());
        setToken(tokenData);
      }
    }

    loadToken();
  }, [id, getTokenById]);

  if (tokenLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (tokenError || !token) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-400 mb-4">{tokenError || "Token not found"}</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={[UserRole.INVESTOR]}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">
            Invest in {token.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TokenDetails token={token} />
          </div>

          <div>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Investment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <InvestForm token={token} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
