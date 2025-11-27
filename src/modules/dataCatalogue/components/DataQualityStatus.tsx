"use client";

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Standardized status types for data quality
export type QualityStatus = "success" | "warning" | "error" | "info" | "pending";
export type ProcessingStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED" | "PENDING";
export type SeverityLevel = "HIGH" | "MEDIUM" | "LOW";
export type ActionType = "MANUAL_REVIEW_REQUIRED" | "TYPE_CONVERTED" | "CORRECTED" | "REJECTED";

// Standardized color configurations
const STATUS_CONFIG: Record<QualityStatus, { bg: string; text: string; border: string; icon: typeof CheckCircle2 }> = {
  success: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    icon: CheckCircle2,
  },
  warning: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    icon: AlertTriangle,
  },
  error: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: XCircle,
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: AlertCircle,
  },
  pending: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    icon: Clock,
  },
};

const SEVERITY_CONFIG: Record<SeverityLevel, { bg: string; text: string }> = {
  HIGH: { bg: "bg-red-100", text: "text-red-800" },
  MEDIUM: { bg: "bg-yellow-100", text: "text-yellow-800" },
  LOW: { bg: "bg-green-100", text: "text-green-800" },
};

const ACTION_CONFIG: Record<ActionType, { bg: string; text: string }> = {
  MANUAL_REVIEW_REQUIRED: { bg: "bg-orange-100", text: "text-orange-800" },
  TYPE_CONVERTED: { bg: "bg-blue-100", text: "text-blue-800" },
  CORRECTED: { bg: "bg-green-100", text: "text-green-800" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800" },
};

const PROCESSING_STATUS_CONFIG: Record<ProcessingStatus, QualityStatus> = {
  COMPLETED: "success",
  IN_PROGRESS: "pending",
  FAILED: "error",
  PENDING: "pending",
};

// Helper to determine success rate status
export function getSuccessRateStatus(rate: number): QualityStatus {
  if (rate >= 90) return "success";
  if (rate >= 70) return "warning";
  return "error";
}

// Helper to get trend icon
export function getTrendIcon(current: number, previous?: number) {
  if (!previous) return Minus;
  if (current > previous) return TrendingUp;
  if (current < previous) return TrendingDown;
  return Minus;
}

interface StatusBadgeProps {
  status: QualityStatus;
  label: string;
  showIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function QualityStatusBadge({
  status,
  label,
  showIcon = true,
  size = "sm",
  className,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border transition-all duration-200",
        config.bg,
        config.text,
        config.border,
        sizeClasses,
        className
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />}
      {label}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.LOW;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-all duration-200",
        config.bg,
        config.text,
        className
      )}
    >
      {severity}
    </span>
  );
}

interface ActionBadgeProps {
  action: ActionType | string;
  className?: string;
}

export function ActionBadge({ action, className }: ActionBadgeProps) {
  const config = ACTION_CONFIG[action as ActionType] || { bg: "bg-gray-100", text: "text-gray-800" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-all duration-200",
        config.bg,
        config.text,
        className
      )}
    >
      {action.replace(/_/g, " ")}
    </span>
  );
}

interface ProcessingStatusBadgeProps {
  status: ProcessingStatus | string;
  className?: string;
}

export function ProcessingStatusBadge({ status, className }: ProcessingStatusBadgeProps) {
  const qualityStatus = PROCESSING_STATUS_CONFIG[status as ProcessingStatus] || "pending";
  const labels: Record<string, string> = {
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    FAILED: "Failed",
    PENDING: "Pending",
  };

  return (
    <QualityStatusBadge
      status={qualityStatus}
      label={labels[status] || status}
      className={className}
    />
  );
}

interface SuccessRateDisplayProps {
  rate: number | null | undefined;
  showTrend?: boolean;
  previousRate?: number;
  size?: "sm" | "lg";
  className?: string;
}

export function SuccessRateDisplay({
  rate,
  showTrend = false,
  previousRate,
  size = "lg",
  className,
}: SuccessRateDisplayProps) {
  if (rate === null || rate === undefined) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className={cn("font-bold text-gray-400", size === "lg" ? "text-4xl" : "text-2xl")}>
          N/A
        </span>
      </div>
    );
  }

  const status = getSuccessRateStatus(rate);
  const config = STATUS_CONFIG[status];
  const TrendIcon = getTrendIcon(rate, previousRate);
  const roundedRate = Math.round(rate);

  return (
    <div className={cn("flex items-center gap-2 transition-all duration-300", className)}>
      <span className={cn("font-bold", config.text, size === "lg" ? "text-4xl" : "text-2xl")}>
        {roundedRate}%
      </span>
      {showTrend && previousRate !== undefined && (
        <TrendIcon
          className={cn(
            "transition-all duration-200",
            size === "lg" ? "w-6 h-6" : "w-4 h-4",
            rate > previousRate ? "text-green-500" : rate < previousRate ? "text-red-500" : "text-gray-400"
          )}
        />
      )}
    </div>
  );
}

interface QualityMessageProps {
  type: QualityStatus;
  title: string;
  description?: string;
  className?: string;
}

export function QualityMessage({ type, title, description, className }: QualityMessageProps) {
  const config = STATUS_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border transition-all duration-300",
        config.bg,
        config.border,
        className
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.text)} />
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium", config.text)}>{title}</p>
        {description && (
          <p className={cn("text-sm mt-1 opacity-80", config.text)}>{description}</p>
        )}
      </div>
    </div>
  );
}
