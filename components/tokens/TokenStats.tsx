import React from "react";
import { Token } from "@/types/token";

interface TokenStatsProps {
  token: Token;
}

export default function TokenStats({ token }: TokenStatsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-white mb-3">Token Statistics</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Total Supply</div>
          <div className="text-white text-xl font-medium">
            {token.totalSupply.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Funding Goal</div>
          <div className="text-white text-xl font-medium">
            {token.fundingGoal} ETH
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Current Funding</div>
          <div className="text-white text-xl font-medium">
            {token.currentFunding} ETH
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Expected Yield</div>
          <div className="text-green-400 text-xl font-medium">
            {token.expectedYield}%
          </div>
        </div>
      </div>
    </div>
  );
}
