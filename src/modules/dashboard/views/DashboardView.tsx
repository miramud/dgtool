"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserRole, MetricCard as MetricCardType } from "../types/dashboard";
import MetricCard from "../components/MetricCard";
import DataQualityChart from "../components/DataQualityChart";
import RecentIncidentsTable from "../components/RecentIncidentsTable";
import { useDashboardStats, useBusinessDomainChart } from "../controllers/dashboardController";
import { useIssues } from "@/modules/dataCatalogue/controllers/issueController";
import { useUserProfile } from "@/modules/userManagement/controllers/userController";
import type { DashboardDateFilter } from "@/services/dashboard";
import type { DateRange } from "react-day-picker";

interface DashboardViewProps {
  className?: string;
}

export default function DashboardView({
  className,
}: DashboardViewProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Build filter when user has completed both clicks (start + end)
  const dateFilter: DashboardDateFilter | undefined =
    dateRange?.from && dateRange?.to && clickCount >= 2
      ? {
          start_date: format(dateRange.from, "yyyy-MM-dd"),
          end_date: format(dateRange.to, "yyyy-MM-dd"),
        }
      : undefined;

  // Fetch user profile
  const { data: profile, isLoading: loadingProfile } = useUserProfile();

  // Fetch dashboard data (filtered by date range)
  const { data: statsData, isLoading: loadingStats } = useDashboardStats(dateFilter);
  const { data: chartData, isLoading: loadingChart } = useBusinessDomainChart(dateFilter);
  const { data: issuesData, isLoading: loadingIssues } = useIssues({});

  const handleClearFilter = () => {
    setDateRange(undefined);
    setClickCount(0);
  };

  // Extract user data
  const userName = profile?.first_name || "User";
  const userRole = (profile?.roles?.[0]?.name?.toLowerCase() || "admin") as UserRole;

  // Only show full loading skeleton on initial load (no data yet), not on refetches
  const isInitialLoading =
    (loadingStats && !statsData) ||
    (loadingChart && !chartData) ||
    (loadingIssues && !issuesData) ||
    (loadingProfile && !profile);

  // Create metrics from API data
  const adminMetrics: MetricCardType[] = statsData ? [
    {
      id: "average-cleanup-score",
      title: "Data Quality Score",
      value: `${statsData.average_cleanup_score ?? 0}%`,
    },
    {
      id: "total-datasets",
      title: "Total Governed Assets",
      value: statsData.total_datasets,
    },
  ] : [];

  const adminSecondaryMetrics: MetricCardType[] = statsData ? [
    {
      id: "data-quality-issues",
      title: "Data Quality Issues",
      value: statsData.total_data_quality_issues,
    },
    {
      id: "reported-issues",
      title: "Reported Issues",
      value: statsData.total_reported_issues,
    },
  ] : [];

  // Get metrics based on user role (admin only for now)
  const primaryMetrics = userRole === "admin" ? adminMetrics : [];
  const secondaryMetrics = userRole === "admin" ? adminSecondaryMetrics : [];

  // Transform chart data for display
  const chartDepartmentScores = chartData?.chart?.map((item) => ({
    department: item.business_domain,
    score: item.average_cleanup_score,
    year: new Date().getFullYear(),
  })) || [];

  // Transform issues data for recent incidents table
  const dataIncidents = issuesData?.results?.slice(0, 5).map((issue: any) => {
    const severityMap: Record<string, "Critical" | "High" | "Medium" | "Low"> = {
      CRITICAL: "Critical",
      HIGH: "High",
      MEDIUM: "Medium",
      LOW: "Low",
    };
    const statusMap: Record<string, "New" | "In Progress" | "Resolved" | "Closed"> = {
      OPEN: "New",
      IN_PROGRESS: "In Progress",
      RESOLVED: "Resolved",
      CLOSED: "Closed",
    };
    return {
      id: issue.id,
      incidentId: issue.id.slice(0, 8).toUpperCase(),
      assetName: issue.dataset_name || "Unknown",
      severity: severityMap[issue.severity_level] || "Low",
      status: statusMap[issue.status] || "New",
    };
  }) || [];

  // Loading state
  if (isInitialLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s a quick snapshot of your operations.
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center justify-end gap-2">
        <Popover open={popoverOpen} onOpenChange={(open) => {
          setPopoverOpen(open);
          if (open) setClickCount(0);
        }}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal min-w-[260px]",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to && clickCount >= 2 ? (
                  format(dateRange.from, "yyyy-MM-dd") ===
                    format(dateRange.to, "yyyy-MM-dd") ? (
                    format(dateRange.from, "MMM dd, yyyy")
                  ) : (
                    <>
                      {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                      {format(dateRange.to, "MMM dd, yyyy")}
                    </>
                  )
                ) : (
                  format(dateRange.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Select date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                const newCount = clickCount + 1;
                setClickCount(newCount);
                // Close popover after the second click (range complete)
                if (newCount >= 2) {
                  setPopoverOpen(false);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {dateFilter && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClearFilter}
            className="h-10 w-10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* All Metrics in Single Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
        {secondaryMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Data Quality Score Chart */}
      <DataQualityChart data={chartDepartmentScores} />

      {/* Recent Data Incidents Table */}
      <RecentIncidentsTable
        incidents={dataIncidents}
        showPolicyColumn={false}
      />
    </div>
  );
}
