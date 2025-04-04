"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useBatch } from "@/lib/hooks/useBatch";
import { useQuality } from "@/lib/hooks/useQuality";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QualityIndicator from "@/components/quality/QualityIndicator";
import TransactionStatus from "@/components/system/TranscationStatus";

export default function CompleteBatchPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.id as string;

  const {
    fetchBatchById,
    completeBatch,
    selectedBatch,
    loading: batchLoading,
    error: batchError,
  } = useBatch();
  const {
    assessQuality,
    qualityAssessment,
    getQualityCategory,
    getActionColor,
  } = useQuality();

  const [completing, setCompleting] = useState(false);
  const [transaction, setTransaction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      console.log(`Loading data for complete batch page. Batch ID: ${batchId}`);
      try {
        const batchData = await fetchBatchById(batchId);
        console.log("Batch data loaded:", batchData);

        const qualityData = await assessQuality(batchId);
        console.log("Quality data loaded:", qualityData);

        setIsInitialized(true);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load batch data");
        setIsInitialized(true);
      }
    };

    loadData();
  }, [batchId, fetchBatchById, assessQuality]);

  const handleCompleteBatch = async () => {
    setCompleting(true);
    setError(null);

    try {
      console.log(`Completing batch ${batchId}...`);
      const result = await completeBatch(batchId);
      console.log("Complete batch result:", result);

      setTransaction(result);

      if (result?.status === "completed" || result?.status === "redirected") {
        // Show success for a few seconds before redirecting
        setTimeout(() => {
          router.push(`/batches/${batchId}`);
        }, 3000);
      } else {
        setError(result?.error || "Failed to complete batch");
      }
    } catch (err: any) {
      console.error("Error completing batch:", err);
      setError(err.message || "An error occurred");
    } finally {
      setCompleting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/batches/${batchId}`);
  };

  if (!isInitialized || batchLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-2">Loading batch details...</p>
          <p className="text-sm text-gray-500">Batch ID: {batchId}</p>
        </div>
      </div>
    );
  }

  if (batchError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10 text-red-500">
          <p>Error: {batchError}</p>
          <Button onClick={() => fetchBatchById(batchId)} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedBatch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10 text-red-500">
          <p>Batch not found</p>
          <Button onClick={() => router.push("/batches")} className="mt-4">
            Return to Batches
          </Button>
        </div>
      </div>
    );
  }

  const qualityInfo = getQualityCategory(
    qualityAssessment?.quality_score || selectedBatch.quality_score
  );

  // Helper function to map status to class
  const getStatusClass = (status: string | undefined) => {
    switch (status) {
      case "InTransit":
        return "bg-blue-500";
      case "Delivered":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Helper function to map action to class
  const getActionTextClass = (action: string | undefined) => {
    const color = getActionColor(action);
    switch (color) {
      case "green":
        return "text-green-600";
      case "blue":
        return "text-blue-600";
      case "yellow":
        return "text-yellow-600";
      case "orange":
        return "text-orange-600";
      case "red":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Complete Shipment</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            Batch #{batchId} - {selectedBatch.berry_type}
          </CardTitle>
          <CardDescription>
            Review the quality assessment before completing this shipment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Batch Status */}
          <div className="flex justify-between items-center p-4 border rounded-md bg-gray-50">
            <span className="font-medium">Current Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs text-white ${getStatusClass(
                selectedBatch.batch_status
              )}`}
            >
              {selectedBatch.batch_status || "Unknown"}
            </span>
          </div>

          {/* Quality Assessment */}
          <div className="flex flex-col items-center p-6 border rounded-md">
            <h3 className="text-lg font-semibold mb-4">Quality Assessment</h3>
            <QualityIndicator
              score={
                qualityAssessment?.quality_score ||
                selectedBatch.quality_score ||
                0
              }
              category={qualityInfo.category}
              color={qualityInfo.color}
            />

            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Shelf Life:</span>
                <span>
                  {qualityAssessment?.shelf_life_hours ||
                    selectedBatch.predicted_shelf_life_hours ||
                    "N/A"}{" "}
                  hours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Recommended Action:</span>
                <span
                  className={`${getActionTextClass(
                    qualityAssessment?.recommended_action
                  )} font-medium`}
                >
                  {qualityAssessment?.recommended_action || "No Action"}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Status */}
          {transaction && <TransactionStatus transaction={transaction} />}

          {/* Error Message */}
          {error && (
            <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={completing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCompleteBatch}
            disabled={completing || selectedBatch.batch_status !== "InTransit"}
            className="bg-green-600 hover:bg-green-700"
          >
            {completing ? "Processing..." : "Complete Shipment"}
          </Button>
        </CardFooter>
      </Card>

      {/* Important Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Completing a shipment will mark the batch as delivered and update
              its status on the blockchain.
            </li>
            <li>
              Once completed, no more temperature readings can be recorded for
              this batch.
            </li>
            <li>
              The quality score will be finalized and recorded in the supply
              chain history.
            </li>
            <li>
              This action cannot be undone, so please verify all information is
              correct.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Debug Information - remove in production */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <details>
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
              Show Debug Data
            </summary>
            <div className="text-xs overflow-auto max-h-40 p-2 bg-gray-100 rounded">
              <div className="mb-2">
                <strong>Selected Batch:</strong>
                <pre>{JSON.stringify(selectedBatch, null, 2)}</pre>
              </div>
              <div>
                <strong>Quality Assessment:</strong>
                <pre>{JSON.stringify(qualityAssessment, null, 2)}</pre>
              </div>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
