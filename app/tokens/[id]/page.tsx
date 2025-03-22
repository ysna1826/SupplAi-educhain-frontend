"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToken } from "@/lib/hooks/useToken";
import { useAuth } from "@/lib/hooks/useAuth";
import TokenDetails from "@/components/tokens/TokenDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/types/auth";
import { Token } from "@/types/token";

export default function TokenDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getTokenById, loading, error } = useToken();
  const { user } = useAuth();
  const [token, setToken] = useState<Token | null>(null);

  useEffect(() => {
    async function loadToken() {
      if (id) {
        const tokenData = await getTokenById(id.toString());
        setToken(tokenData);
      }
    }

    loadToken();
  }, [id, getTokenById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-400 mb-4">{error || "Token not found"}</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const isOwner = user?.address?.toLowerCase() === token.creator.toLowerCase();
  const canInvest = user?.role === UserRole.INVESTOR;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <TokenDetails token={token} />

      <div className="mt-8 flex justify-center">
        {isOwner && (
          <Link href={`/tokens/manage`}>
            <Button className="mx-2 bg-blue-600 hover:bg-blue-700">
              Manage Your Tokens
            </Button>
          </Link>
        )}

        {canInvest && (
          <Link href={`/tokens/${id}/invest`}>
            <Button className="mx-2 bg-green-600 hover:bg-green-700">
              Invest in This Token
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
