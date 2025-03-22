"use client";

import React, { useEffect, useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/hooks/useAuth";
import { useInvestment } from "@/lib/hooks/useInvestment";
import { useToken } from "@/lib/hooks/useToken";
import { UserRole } from "@/types/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InvestorPortfolio from "@/components/tokens/InvestPortfolio";
import Link from "next/link";
import { Loader2, Wallet, CreditCard, TrendingUp } from "lucide-react";

export default function InvestorDashboard() {
  const { user } = useAuth();
  const {
    getInvestments,
    getPortfolioStats,
    loading: investmentLoading,
  } = useInvestment();
  const { getTokens, loading: tokenLoading } = useToken();
  const [investments, setInvestments] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState({
    totalInvested: 0,
    investmentCount: 0,
  });
  const [featuredTokens, setFeaturedTokens] = useState<
    Array<{
      id: string;
      name: string;
      symbol: string;
      description: string;
      expectedYield: number;
    }>
  >([]);

  useEffect(() => {
    async function loadData() {
      if (user?.address) {
        const myInvestments = await getInvestments();
        setInvestments(myInvestments);

        const stats = await getPortfolioStats();
        setPortfolioStats(stats);

        const tokens = await getTokens();
        setFeaturedTokens(tokens.slice(0, 3)); // Just show first 3 tokens
      }
    }

    loadData();
  }, [user?.address, getInvestments, getPortfolioStats, getTokens]);

  const loading = investmentLoading || tokenLoading;

  return (
    <RoleGuard allowedRoles={[UserRole.INVESTOR]}>
      <div className="container mx-auto px-4 py-8 bg-gray-950 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Investor Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-blue-500" />
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-500 mb-2">
                {portfolioStats.totalInvested.toFixed(4)} ETH
              </div>
              <p className="text-gray-400">Total invested</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-500 mb-2">
                {investments.length}
              </div>
              <p className="text-gray-400">Active investments</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Expected Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-500 mb-2">~12%</div>
              <p className="text-gray-400">Average projected yield</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Your Portfolio
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <InvestorPortfolio
                investments={investments}
                totalInvested={portfolioStats.totalInvested}
              />
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Featured Opportunities
              </h2>
              <Link href="/tokens/explore">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : featuredTokens.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="py-8 text-center">
                  <p className="text-gray-400">
                    No investment opportunities available.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  {featuredTokens.map((token) => (
                    <div
                      key={token.id}
                      className="mb-4 p-4 bg-gray-800 rounded-lg last:mb-0"
                    >
                      <div className="flex justify-between mb-2">
                        <Link href={`/tokens/${token.id}`}>
                          <span className="text-blue-400 hover:underline font-medium">
                            {token.name}
                          </span>
                        </Link>
                        <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded border border-blue-800">
                          {token.symbol}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {token.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Expected yield:</span>
                        <span className="text-green-400 font-medium">
                          {token.expectedYield}%
                        </span>
                      </div>
                      <div className="mt-4">
                        <Link href={`/tokens/${token.id}`}>
                          <Button size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
