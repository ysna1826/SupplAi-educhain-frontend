import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Token } from "@/types/token";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserRole } from "@/types/auth";
import FundingProgress from "./FundingProgress";

interface TokenCardProps {
  token: Token;
  showInvestButton?: boolean;
}

export default function TokenCard({
  token,
  showInvestButton = false,
}: TokenCardProps) {
  const { user } = useAuth();
  const isOwner = user?.address?.toLowerCase() === token.creator.toLowerCase();

  // Calculate percentage funded
  const percentFunded =
    token.fundingGoal > 0
      ? (token.currentFunding / token.fundingGoal) * 100
      : 0;

  return (
    <Card className="h-full flex flex-col bg-gray-900 border-gray-800 overflow-hidden">
      <div className={`h-1 w-full bg-blue-600`}></div>

      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{token.name}</h3>
            <div className="text-sm text-gray-400 mb-2">{token.symbol}</div>
          </div>
          {isOwner && (
            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs font-medium rounded-md border border-blue-800">
              Your Token
            </span>
          )}
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {token.description}
        </p>

        <div className="space-y-4 mt-4">
          <FundingProgress
            current={token.currentFunding}
            goal={token.fundingGoal}
            percentage={percentFunded}
          />

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-800 p-2 rounded-md">
              <span className="text-gray-400">Expected Yield</span>
              <div className="text-green-400 font-medium">
                {token.expectedYield}%
              </div>
            </div>
            <div className="bg-gray-800 p-2 rounded-md">
              <span className="text-gray-400">Total Supply</span>
              <div className="text-white font-medium">
                {token.totalSupply.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 border-t border-gray-800">
        <div className="w-full flex justify-between">
          <Link href={`/tokens/${token.id}`}>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              View Details
            </Button>
          </Link>

          {showInvestButton && user?.role === UserRole.INVESTOR && (
            <Link href={`/tokens/${token.id}/invest`}>
              <Button className="bg-blue-600 hover:bg-blue-700">Invest</Button>
            </Link>
          )}

          {isOwner && (
            <Link href={`/tokens/manage`}>
              <Button className="bg-blue-600 hover:bg-blue-700">Manage</Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
