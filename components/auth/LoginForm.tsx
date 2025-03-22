"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { Wallet, Loader2 } from "lucide-react";

export default function LoginForm() {
  const { login, error, isLoading } = useAuth();
  const [statusMessage, setStatusMessage] = useState("");

  const handleLogin = async () => {
    setStatusMessage("Connecting wallet...");
    try {
      await login();
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to connect wallet");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center p-6 border border-gray-800 rounded-lg bg-gray-800/50">
        <p className="text-gray-300 mb-4">
          Connect your wallet to access the Berry Supply Chain platform. Your
          role will be determined automatically.
        </p>
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      </div>

      {statusMessage && (
        <div className="text-sm text-center text-blue-400">{statusMessage}</div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
