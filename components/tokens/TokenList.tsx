import React from "react";
import TokenCard from "./TokenCard";
import { Token } from "@/types/token";

interface TokenListProps {
  tokens: Token[];
  showInvestButton?: boolean;
}

export default function TokenList({
  tokens,
  showInvestButton = false,
}: TokenListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokens.map((token) => (
        <TokenCard
          key={token.id}
          token={token}
          showInvestButton={showInvestButton}
        />
      ))}
    </div>
  );
}
