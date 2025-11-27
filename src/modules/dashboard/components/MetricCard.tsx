"use client";

import { cn } from "@/lib/utils";
import { MetricCard as MetricCardType } from "../types/dashboard";
import { MoreHorizontal } from "lucide-react";

interface MetricCardProps {
  metric: MetricCardType;
  variant?: "default" | "highlighted";
  className?: string;
}

// Simple sparkline component
function Sparkline({
  data,
  color = "#22c55e",
  height = 40,
  width = 100,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricCard({
  metric,
  variant = "default",
  className,
}: MetricCardProps) {
  const isHighlighted = variant === "highlighted";
  const sparklineColor = metric.isPositiveChange ? "#22c55e" : "#ef4444";

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all",
        isHighlighted
          ? "bg-[#E8F5E9] border-green-200"
          : "bg-white border-gray-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-500 font-medium">{metric.title}</span>
        {metric.sparklineData && (
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
          {metric.change !== undefined && (
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                metric.isPositiveChange
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {metric.isPositiveChange ? "" : ""}{metric.change}%{" "}
              {metric.isPositiveChange ? "\u2191" : "\u2193"}
            </span>
          )}
        </div>

        {/* Sparkline */}
        {metric.sparklineData && (
          <Sparkline data={metric.sparklineData} color={sparklineColor} />
        )}
      </div>
    </div>
  );
}
