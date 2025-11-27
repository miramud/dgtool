"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  department: string;
  score: number;
}

interface DataQualityChartProps {
  data: ChartDataPoint[];
  className?: string;
}

export default function DataQualityChart({
  data,
  className,
}: DataQualityChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxScore = 100;
  const chartHeight = 350;
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 50 };

  // Always use full width with responsive viewBox
  const viewBoxWidth = 1000;
  const contentWidth = viewBoxWidth - chartPadding.left - chartPadding.right;

  // Calculate dynamic bar spacing to fill available width
  const barSpacing = contentWidth / data.length;
  const barWidth = Math.max(40, Math.min(120, barSpacing * 0.65)); // Min 40px, max 120px, takes 65% of space

  // Y-axis labels
  const yAxisLabels = [0, 20, 40, 60, 80, 100];

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Data Quality Score</h3>
      </div>

      {/* Chart Container */}
      <div className="w-full">
        <svg
          width="100%"
          height={chartHeight + chartPadding.top + chartPadding.bottom}
          viewBox={`0 0 ${viewBoxWidth} ${chartHeight + chartPadding.top + chartPadding.bottom}`}
          preserveAspectRatio="xMinYMid meet"
        >
          {/* Y-axis grid lines and labels */}
          {yAxisLabels.map((value) => {
            const y =
              chartPadding.top +
              chartHeight -
              (value / maxScore) * chartHeight;
            return (
              <g key={value}>
                <line
                  x1={chartPadding.left}
                  y1={y}
                  x2={viewBoxWidth - chartPadding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
                <text
                  x={chartPadding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const x = chartPadding.left + index * barSpacing + (barSpacing - barWidth) / 2;
            const barHeight = (item.score / maxScore) * chartHeight;
            const y = chartPadding.top + chartHeight - barHeight;
            const isHovered = hoveredIndex === index;

            return (
              <g
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={4}
                  fill={isHovered ? "#16a34a" : "#22c55e"}
                  className="transition-all duration-200"
                />

                {/* Score label on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                >
                  {item.score}
                </text>

                {/* Department label */}
                <text
                  x={x + barWidth / 2}
                  y={chartPadding.top + chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {item.department}
                </text>

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 50}
                      y={y - 45}
                      width={100}
                      height={30}
                      rx={4}
                      fill="#1f2937"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 25}
                      textAnchor="middle"
                      className="text-xs fill-white font-medium"
                    >
                      {item.department}: {item.score}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          
        </svg>
      </div>
    </div>
  );
}
