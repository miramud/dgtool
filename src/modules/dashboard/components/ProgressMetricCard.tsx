"use client";

import { cn } from "@/lib/utils";
import { ProgressMetric } from "../types/dashboard";

interface ProgressMetricCardProps {
  metric: ProgressMetric;
  className?: string;
}

export default function ProgressMetricCard({
  metric,
  className,
}: ProgressMetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4",
        className
      )}
    >
      <div className="space-y-2">
        <span className="text-sm text-gray-500">{metric.label}</span>
        <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            Completion: {metric.completion}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-[#4A4A7A] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${metric.completion}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
