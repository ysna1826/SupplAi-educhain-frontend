"use client";

import React, { useEffect, useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { useToken } from "@/lib/hooks/useToken";
import { UserRole } from "@/types/auth";
import TokenList from "@/components/tokens/TokenList";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ExploreTokensPage() {
  const { getTokens, loading, error } = useToken();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    async function loadTokens() {
      const availableTokens = await getTokens();
      setTokens(availableTokens);
    }

    loadTokens();
  }, [getTokens]);

  return (
    <RoleGuard allowedRoles={[UserRole.INVESTOR, UserRole.MANAGER]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Explore Farmer Tokens
        </h1>

        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-8">
          <p className="text-blue-300">
            Invest in local farmers and help them grow their berry farming
            business. Each token represents a share in the farmer's harvest and
            future profits.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="py-6">
              <p className="text-red-400 text-center">{error}</p>
            </CardContent>
          </Card>
        ) : tokens.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">
                No tokens available for investment at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <TokenList tokens={tokens} showInvestButton />
        )}
      </div>
    </RoleGuard>
  );
}
