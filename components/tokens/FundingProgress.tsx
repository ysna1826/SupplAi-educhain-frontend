import React from "react";

interface FundingProgressProps {
  current: number;
  goal: number;
  percentage: number;
}

export default function FundingProgress({
  current,
  goal,
  percentage,
}: FundingProgressProps) {
  // Cap the percentage at 100%
  const cappedPercentage = Math.min(percentage, 100);

  // Determine color based on percentage
  const getColorClass = () => {
    if (percentage < 25) return "bg-red-500";
    if (percentage < 50) return "bg-yellow-500";
    if (percentage < 75) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{current.toFixed(2)} ETH raised</span>
        <span className="text-gray-300 font-medium">
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColorClass()} rounded-full`}
          style={{ width: `${cappedPercentage}%` }}
        ></div>
      </div>

      <div className="text-right text-xs text-gray-400">
        Goal: {goal.toFixed(2)} ETH
      </div>
    </div>
  );
}
