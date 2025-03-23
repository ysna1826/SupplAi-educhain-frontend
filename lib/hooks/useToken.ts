"use client";

import { useState, useCallback } from "react";
import BerrySupplyChainClient from "../api/berrySupplyChainClient";
import { Token } from "@/types/token";
import { useAuth } from "./useAuth";

export function useToken() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const client = new BerrySupplyChainClient();

  const createToken = useCallback(
    async (tokenData: Partial<Token>) => {
      setLoading(true);
      setError(null);

      try {
        // Make sure user is logged in
        if (!user?.address) {
          throw new Error("You must be logged in to create a token");
        }

        // Call the API
        const response = await client.callConnectionAction(
          "educhain",
          "create-token",
          {
            name: tokenData.name,
            symbol: tokenData.symbol,
            description: tokenData.description,
            total_supply: tokenData.totalSupply,
            funding_goal: tokenData.fundingGoal,
            expected_yield: tokenData.expectedYield,
            creator: user.address,
          }
        );

        console.log("Token creation response:", response);

        // Handle success
        if (response.success) {
          return { success: true, tokenId: response.token_id };
        }

        // Handle error
        throw new Error(response.error || "Failed to create token");
      } catch (err: any) {
        console.error("Error creating token:", err);
        setError(err.message || "An error occurred while creating the token");
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [user?.address, client]
  );

  const getTokens = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);

      try {
        // Call the API
        const response = await client.callConnectionAction(
          "educhain",
          "get-tokens",
          { filters }
        );

        console.log("Get tokens response:", response);

        // Process and return tokens
        if (response.success && Array.isArray(response.tokens)) {
          return response.tokens;
        }

        // For now, return mock data for development
        return generateMockTokens();
      } catch (err: any) {
        console.error("Error fetching tokens:", err);
        setError(err.message || "Failed to fetch tokens");

        // Return mock data for development
        return generateMockTokens();
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const getTokenById = useCallback(
    async (tokenId: string) => {
      setLoading(true);
      setError(null);

      try {
        // Call the API
        const response = await client.callConnectionAction(
          "educhain",
          "get-token",
          { token_id: tokenId }
        );

        console.log("Get token response:", response);

        // Return token data
        if (response.success && response.token) {
          return response.token;
        }

        // For now, return mock data for development
        return generateMockToken(tokenId);
      } catch (err: any) {
        console.error(`Error fetching token ${tokenId}:`, err);
        setError(err.message || `Failed to fetch token ${tokenId}`);

        // Return mock data for development
        return generateMockToken(tokenId);
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const getMyTokens = useCallback(
    async (address: string) => {
      setLoading(true);
      setError(null);

      try {
        // Call the API
        const response = await client.callConnectionAction(
          "educhain",
          "get-tokens",
          { filters: { creator: address } }
        );

        console.log("Get my tokens response:", response);

        // Process and return tokens
        if (response.success && Array.isArray(response.tokens)) {
          return response.tokens;
        }

        // For now, return mock data for development
        return generateMockTokens(3, address);
      } catch (err: any) {
        console.error("Error fetching my tokens:", err);
        setError(err.message || "Failed to fetch your tokens");

        // Return mock data for development
        return generateMockTokens(3, address);
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  // Helper function to generate mock tokens for development
  const generateMockTokens = (count = 6, creator?: string) => {
    const tokens = [];
    const berryTypes = [
      "Strawberry",
      "Blueberry",
      "Raspberry",
      "Blackberry",
      "Cranberry",
    ];

    for (let i = 1; i <= count; i++) {
      const berryType =
        berryTypes[Math.floor(Math.random() * berryTypes.length)];
      const fundingGoal = parseFloat((Math.random() * 5 + 1).toFixed(2));
      const currentFunding = parseFloat(
        (Math.random() * fundingGoal).toFixed(2)
      );

      tokens.push({
        id: i.toString(),
        name: `${berryType} Farm Token`,
        symbol: berryType.substring(0, 3).toUpperCase(),
        creator: creator || `0x${Math.random().toString(16).substr(2, 40)}`,
        totalSupply: Math.floor(Math.random() * 9000) + 1000,
        fundingGoal,
        currentFunding,
        expectedYield: Math.floor(Math.random() * 15) + 5,
        description: `This token represents shares in our ${berryType.toLowerCase()} farm operation. Funds will be used to expand production capacity and improve cold chain infrastructure.`,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }

    return tokens;
  };

  // Helper function to generate a single mock token for development
  const generateMockToken = (id: string) => {
    const berryTypes = [
      "Strawberry",
      "Blueberry",
      "Raspberry",
      "Blackberry",
      "Cranberry",
    ];
    const berryType = berryTypes[Math.floor(Math.random() * berryTypes.length)];
    const fundingGoal = parseFloat((Math.random() * 5 + 1).toFixed(2));
    const currentFunding = parseFloat((Math.random() * fundingGoal).toFixed(2));

    return {
      id,
      name: `${berryType} Farm Token`,
      symbol: berryType.substring(0, 3).toUpperCase(),
      creator: `0x${Math.random().toString(16).substr(2, 40)}`,
      totalSupply: Math.floor(Math.random() * 9000) + 1000,
      fundingGoal,
      currentFunding,
      expectedYield: Math.floor(Math.random() * 15) + 5,
      description: `This token represents shares in our ${berryType.toLowerCase()} farm operation. Funds will be used to expand production capacity and improve cold chain infrastructure.`,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  };

  return {
    loading,
    error,
    createToken,
    getTokens,
    getTokenById,
    getMyTokens,
  };
}
