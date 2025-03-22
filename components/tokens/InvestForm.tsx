"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useInvestment } from "@/lib/hooks/useInvestment";
import { Token } from "@/types/token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface InvestFormProps {
  token: Token;
}

export default function InvestForm({ token }: InvestFormProps) {
  const router = useRouter();
  const { investInToken, loading, error } = useInvestment();
  const [amount, setAmount] = useState(0.1);
  const [formError, setFormError] = useState("");

  // Calculate tokens to receive based on investment amount
  const tokensToReceive = token.totalSupply * (amount / token.fundingGoal);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (amount <= 0) {
      setFormError("Amount must be greater than 0");
      return;
    }

    if (amount > token.fundingGoal - token.currentFunding) {
      setFormError("Amount exceeds remaining funding goal");
      return;
    }

    try {
      const result = await investInToken(token.id, amount);

      if (result.success) {
        router.push("/dashboard/investor");
      } else {
        setFormError(result.error || "Failed to complete investment");
      }
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message || "An error occurred during investment");
      } else {
        setFormError("An error occurred during investment");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Investment Amount (ETH)
        </label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="bg-gray-800 border-gray-700 text-white"
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <div className="bg-gray-800 p-4 rounded-lg space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Tokens to receive:</span>
          <span className="text-white font-medium">
            {tokensToReceive.toFixed(2)} {token.symbol}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Expected yield:</span>
          <span className="text-green-400 font-medium">
            {token.expectedYield}%
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Remaining to fund:</span>
          <span className="text-white font-medium">
            {(token.fundingGoal - token.currentFunding).toFixed(2)} ETH
          </span>
        </div>
      </div>

      {formError && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400 text-sm">
          {formError}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Invest ${amount} ETH`
          )}
        </Button>

        <p className="text-xs text-gray-400 text-center mt-2">
          By investing, you agree to the terms and conditions of this platform.
        </p>
      </div>
    </form>
  );
}
