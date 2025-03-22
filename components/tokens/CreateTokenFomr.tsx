"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToken } from "@/lib/hooks/useToken";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function CreateTokenForm() {
  const router = useRouter();
  const { createToken, loading, error } = useToken();
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    totalSupply: 1000,
    fundingGoal: 1,
    description: "",
    expectedYield: 10,
  });
  const [formError, setFormError] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalSupply" ||
        name === "fundingGoal" ||
        name === "expectedYield"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!formData.name || !formData.symbol || !formData.description) {
      setFormError("Please fill out all required fields");
      return;
    }

    try {
      const result = await createToken(formData);

      if (result.success) {
        router.push("/tokens/manage");
      } else {
        setFormError(result.error || "Failed to create token");
      }
    } catch (err) {
      if (err instanceof Error) {
        setFormError(
          err.message || "An error occurred while creating the token"
        );
      } else {
        setFormError("An error occurred while creating the token");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Token Name *
        </label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Strawberry Farm Token"
          className="bg-gray-800 border-gray-700 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Token Symbol *
        </label>
        <Input
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          placeholder="SBT"
          className="bg-gray-800 border-gray-700 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Total Supply
          </label>
          <Input
            name="totalSupply"
            type="number"
            value={formData.totalSupply}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            min="1"
            step="1"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Funding Goal (ETH) *
          </label>
          <Input
            name="fundingGoal"
            type="number"
            value={formData.fundingGoal}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
            min="0.1"
            step="0.1"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Expected Yield (%) *
        </label>
        <Input
          name="expectedYield"
          type="number"
          value={formData.expectedYield}
          onChange={handleChange}
          className="bg-gray-800 border-gray-700 text-white"
          min="1"
          max="100"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Project Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your farming project and how the funds will be used..."
          className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          required
        />
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

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/tokens/manage")}
          disabled={loading}
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Token"
          )}
        </Button>
      </div>
    </form>
  );
}
