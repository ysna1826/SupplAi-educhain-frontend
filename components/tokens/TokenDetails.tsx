import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Token } from "@/types/token";
import FundingProgress from "./FundingProgress.jsx";
import TokenStats from "./TokenStats.jsx";

interface TokenDetailsProps {
  token: Token;
}

export default function TokenDetails({ token }: TokenDetailsProps) {
  // Calculate percentage funded
  const percentFunded =
    token.fundingGoal > 0
      ? (token.currentFunding / token.fundingGoal) * 100
      : 0;

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center mb-2">
                <div className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded mr-2 border border-blue-800">
                  {token.symbol}
                </div>
                <div className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                  Created {formatDate(token.createdAt)}
                </div>
              </div>
              <CardTitle className="text-2xl text-white">
                {token.name}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">
              Project Description
            </h3>
            <p className="text-gray-300 whitespace-pre-line">
              {token.description}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">
              Funding Progress
            </h3>
            <FundingProgress
              current={token.currentFunding}
              goal={token.fundingGoal}
              percentage={percentFunded}
            />
          </div>

          <TokenStats token={token} />
        </CardContent>
      </Card>
    </div>
  );
}
