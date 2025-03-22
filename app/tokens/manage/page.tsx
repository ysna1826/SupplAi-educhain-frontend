"use client";

import React, { useEffect, useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { useToken } from "@/lib/hooks/useToken";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import TokenList from "@/components/tokens/TokenList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ManageTokensPage() {
  const { user } = useAuth();
  const { getMyTokens, loading, error } = useToken();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    async function loadTokens() {
      if (user?.address) {
        const myTokens = await getMyTokens(user.address);
        setTokens(myTokens);
      }
    }

    loadTokens();
  }, [user?.address, getMyTokens]);

  return (
    <RoleGuard allowedRoles={[UserRole.FARMER]}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Your Tokens</h1>
          <Link href="/tokens/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Token
            </Button>
          </Link>
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
              <p className="text-gray-400 mb-6">
                You haven't created any tokens yet.
              </p>
              <Link href="/tokens/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Your First Token
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <TokenList tokens={tokens} />
        )}
      </div>
    </RoleGuard>
  );
}
