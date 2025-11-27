"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetOpenIssueCount } from "../controllers/dataCatalogueController";

interface IssueBadgeProps {
  datasetId: string;
  className?: string;
  showCount?: boolean;
}

export default function IssueBadge({ datasetId, className, showCount = true }: IssueBadgeProps) {
  const { data: openIssueCount, isLoading, isError } = useGetOpenIssueCount(datasetId);

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs",
          className
        )}
      >
        <Loader2 className="w-3 h-3 animate-spin" />
      </div>
    );
  }

  // Don't show badge if there's an error or no open issues
  if (isError || !openIssueCount || openIssueCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium",
        className
      )}
      title={`${openIssueCount} open issue${openIssueCount > 1 ? "s" : ""}`}
    >
      <AlertTriangle className="w-3 h-3" />
      {showCount && <span>{openIssueCount}</span>}
    </div>
  );
}
