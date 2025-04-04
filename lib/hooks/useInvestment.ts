"use client";

import { useState, useCallback } from "react";
import BerrySupplyChainClient from "@/lib/api/berrySupplyChainClient";
import { Investment } from "@/types/token";
import { useAuth } from "@/lib/hooks/useAuth";

export function useInvestment() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const client = new BerrySupplyChainClient();

  const investInToken = useCallback(
    async (tokenId: string, amount: number) => {
      setLoading(true);
      setError(null);

      try {
        // Make sure user is logged in
        if (!user?.address) {
          throw new Error("You must be logged in to invest");
        }

        // Call the API
        const response = await client.callConnectionAction(
          "educhain",
          "invest-in-token",
          {
            token_id: tokenId,
            amount,
            investor: user.address,
          }
        );

        console.log("Investment response:", response);

        // Handle success
        if (response.success) {
          return { success: true, transactionId: response.transaction_id };
        }

        // Handle error
        throw new Error(response.error || "Failed to complete investment");
      } catch (err: any) {
        console.error("Error investing in token:", err);
        setError(err.message || "An error occurred during investment");
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [user?.address, client]
  );

  const getInvestments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Make sure user is logged in
      if (!user?.address) {
        throw new Error("You must be logged in to view investments");
      }

      // Call the API
      const response = await client.callConnectionAction(
        "educhain",
        "get-investments",
        { investor: user.address }
      );

      console.log("Get investments response:", response);

      // Process and return investments
      if (response.success && Array.isArray(response.investments)) {
        return response.investments;
      }

      // For now, return mock data for development
      return user ? generateMockInvestments(user.address) : [];
    } catch (err: any) {
      console.error("Error fetching investments:", err);
      setError(err.message || "Failed to fetch investments");

      // Return mock data for development
      return user ? generateMockInvestments(user.address) : [];
    } finally {
      setLoading(false);
    }
  }, [user?.address, client]);

  const getPortfolioStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Make sure user is logged in
      if (!user?.address) {
        throw new Error("You must be logged in to view portfolio stats");
      }

      // Save address before async operation to avoid null check issues
      const userAddress = user.address;

      // Get investments first
      const investments = await getInvestments();

      // Calculate portfolio stats
      const totalInvested: number = investments.reduce(
        (sum: number, inv: Investment) => sum + inv.amount,
        0
      );

      return {
        totalInvested,
        investmentCount: investments.length,
        userAddress, // Use the saved address here
      };
    } catch (err: any) {
      console.error("Error fetching portfolio stats:", err);
      setError(err.message || "Failed to fetch portfolio statistics");

      return {
        totalInvested: 0,
        investmentCount: 0,
        userAddress: "",
      };
    } finally {
      setLoading(false);
    }
  }, [user?.address, getInvestments]);

  // Helper function to generate mock investments for development
  const generateMockInvestments = (investor: string): Investment[] => {
    const investments = [];
    const count = Math.floor(Math.random() * 5) + 1;

    for (let i = 1; i <= count; i++) {
      investments.push({
        tokenId: i.toString(),
        tokenName: `Mock Token ${i}`,
        investor,
        amount: parseFloat((Math.random() * 2 + 0.1).toFixed(4)),
        timestamp: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }

    return investments;
  };

  return {
    loading,
    error,
    investInToken,
    getInvestments,
    getPortfolioStats,
  };
}
