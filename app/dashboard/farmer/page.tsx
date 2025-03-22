"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToken } from "@/lib/hooks/useToken";
import { UserRole } from "@/types/auth";
import { Token } from "@/types/token";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TokenList from "@/components/tokens/TokenList";
import Link from "next/link";
import { Loader2, PlusCircle, BarChart3, Package } from "lucide-react";

export default function FarmerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { getMyTokens, loading, error } = useToken();
  const [tokens, setTokens] = useState<Token[]>([]);

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
      <div className="container mx-auto px-4 py-8 bg-gray-950 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white">Farmer Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                Funding Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-500 mb-2">
                {tokens
                  .reduce((sum, t) => sum + t.currentFunding, 0)
                  .toFixed(2)}{" "}
                ETH
              </div>
              <p className="text-gray-400">Total funds raised</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center">
                <Package className="mr-2 h-5 w-5 text-blue-500" />
                Token Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-500 mb-2">
                {tokens.length}
              </div>
              <p className="text-gray-400">Active funding tokens</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <Link href="/tokens/create">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Token
                  </Button>
                </Link>
                <Link href="/tokens/manage">
                  <Button className="w-full" variant="outline">
                    Manage Tokens
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Your Active Tokens
            </h2>
            <Link href="/tokens/manage">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
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
            <TokenList tokens={tokens.slice(0, 3)} />
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
