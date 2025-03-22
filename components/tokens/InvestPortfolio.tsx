import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Investment } from "@/types/token";
import Link from "next/link";

interface InvestorPortfolioProps {
  investments: Investment[];
  totalInvested: number;
}

export default function InvestorPortfolio({
  investments,
  totalInvested,
}: InvestorPortfolioProps) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Your Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800">
            <div className="text-gray-300 mb-1">Total Invested</div>
            <div className="text-2xl font-bold text-white">
              {totalInvested.toFixed(4)} ETH
            </div>
          </div>
        </div>

        {investments.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p>You haven't made any investments yet.</p>
            <div className="mt-4">
              <Link href="/tokens/explore">
                <span className="text-blue-400 hover:underline">
                  Explore available tokens
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => (
              <div
                key={`${investment.tokenId}-${investment.timestamp}`}
                className="p-4 bg-gray-800 rounded-lg"
              >
                <div className="flex justify-between mb-2">
                  <Link href={`/tokens/${investment.tokenId}`}>
                    <span className="text-blue-400 hover:underline">
                      {investment.tokenName || `Token #${investment.tokenId}`}
                    </span>
                  </Link>
                  <span className="text-white font-medium">
                    {investment.amount.toFixed(4)} ETH
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Invested on{" "}
                  {new Date(investment.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
