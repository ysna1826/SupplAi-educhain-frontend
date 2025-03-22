export interface Token {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  totalSupply: number;
  fundingGoal: number;
  currentFunding: number;
  description: string;
  expectedYield: number;
  createdAt: string;
  expiresAt?: string;
}

export interface Investment {
  tokenId: string;
  tokenName?: string;
  investor: string;
  amount: number;
  timestamp: string;
}

export interface TokenStats {
  totalInvestors: number;
  percentageFunded: number;
  timeRemaining: number;
  projectedReturns: number;
}
