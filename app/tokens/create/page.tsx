"use client";

import React from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import CreateTokenForm from "@/components/tokens/CreateTokenFomr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserRole } from "@/types/auth";

export default function CreateTokenPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.FARMER]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Create Funding Token
        </h1>

        <Card className="bg-gray-900 border-gray-800 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white">Token Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateTokenForm />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
