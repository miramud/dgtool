"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import {
  QualityStatus,
  SuccessRateDisplay,
  ProcessingStatusBadge,
  getSuccessRateStatus,
} from "./DataQualityStatus";

// Status-based border colors for visual consistency
const STATUS_BORDER_COLORS: Record<QualityStatus, string> = {
  success: "border-l-green-500",
  warning: "border-l-yellow-500",
  error: "border-l-red-500",
  info: "border-l-blue-500",
  pending: "border-l-gray-400",
};

interface QualityMetricCardProps {
  title: string;
  children: ReactNode;
  status?: QualityStatus;
  className?: string;
}

export function QualityMetricCard({
  title,
  children,
  status,
  className,
}: QualityMetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-sm h-full",
        status && `border-l-4 ${STATUS_BORDER_COLORS[status]}`,
        className
      )}
    >
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      {children}
    </div>
  );
}

interface SuccessRateCardProps {
  rate: number | null | undefined;
  previousRate?: number;
  showTrend?: boolean;
  className?: string;
}

export function SuccessRateCard({
  rate,
  previousRate,
  showTrend = false,
  className,
}: SuccessRateCardProps) {
  const status = rate !== null && rate !== undefined ? getSuccessRateStatus(rate) : "pending";

  return (
    <QualityMetricCard title="Success Rate" status={status} className={className}>
      <SuccessRateDisplay
        rate={rate}
        previousRate={previousRate}
        showTrend={showTrend}
        size="lg"
      />
      {rate !== null && rate !== undefined && (
        <p className="text-sm text-gray-500 mt-2">
          {rate >= 90
            ? "Excellent data quality"
            : rate >= 70
            ? "Good quality, minor issues detected"
            : "Quality issues need attention"}
        </p>
      )}
    </QualityMetricCard>
  );
}

interface InconsistencyCardProps {
  count: number;
  className?: string;
}

export function InconsistencyCard({ count, className }: InconsistencyCardProps) {
  const status: QualityStatus = count === 0 ? "success" : count < 10 ? "warning" : "error";

  return (
    <QualityMetricCard title="Total Inconsistencies" status={status} className={className}>
      <div className="text-4xl font-bold text-gray-900 transition-all duration-300">
        {count.toLocaleString()}
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {count === 0 ? "No issues detected" : "issues detected"}
      </p>
    </QualityMetricCard>
  );
}

interface ProcessingSummaryCardProps {
  status?: string;
  totalRowsProcessed?: number;
  totalRowsCleaned?: number;
  totalRowsRejected?: number;
  className?: string;
}

export function ProcessingSummaryCard({
  status,
  totalRowsProcessed = 0,
  totalRowsCleaned = 0,
  totalRowsRejected = 0,
  className,
}: ProcessingSummaryCardProps) {
  return (
    <QualityMetricCard title="Processing Summary" className={className}>
      <div className="space-y-3">
        {/* Processing Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Status</span>
          <ProcessingStatusBadge status={status || "PENDING"} />
        </div>

        {/* Rows Processed */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Rows Processed</span>
          <span className="text-sm font-semibold text-gray-900">
            {totalRowsProcessed.toLocaleString()}
          </span>
        </div>

        {/* Cleaned vs Rejected */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Results</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-green-700 font-medium">
              {totalRowsCleaned.toLocaleString()} cleaned
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-red-700 font-medium">
              {totalRowsRejected.toLocaleString()} rejected
            </span>
          </div>
        </div>
      </div>
    </QualityMetricCard>
  );
}

interface EmptyStateCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateCardProps) {
  return (
    <div className={cn("text-center py-8", className)}>
      {Icon && (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-3">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
      )}
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
