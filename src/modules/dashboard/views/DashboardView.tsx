"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole, MetricCard as MetricCardType } from "../types/dashboard";
import MetricCard from "../components/MetricCard";
import DataQualityChart from "../components/DataQualityChart";
import RecentIncidentsTable from "../components/RecentIncidentsTable";
import { useDashboardStats, useBusinessDomainChart } from "../controllers/dashboardController";
import { useIssues } from "@/modules/dataCatalogue/controllers/issueController";

interface DashboardViewProps {
  userRole?: UserRole;
  userName?: string;
  className?: string;
}

export default function DashboardView({
  userRole = "admin",
  userName = "Ahmed",
  className,
}: DashboardViewProps) {
  // Fetch dashboard data
  const { data: statsData, isLoading: loadingStats } = useDashboardStats();
  const { data: chartData, isLoading: loadingChart } = useBusinessDomainChart();
  const { data: issuesData, isLoading: loadingIssues } = useIssues({});

  const isLoading = loadingStats || loadingChart || loadingIssues;

  // Create metrics from API data
  const adminMetrics: MetricCardType[] = statsData ? [
    {
      id: "average-cleanup-score",
      title: "Data Quality Score",
      value: `${statsData.average_cleanup_score}%`,
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
  if (isLoading) {
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
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 min-w-[180px]">
          <span>Date Range</span>
          <Calendar className="w-4 h-4 ml-auto text-gray-400" />
        </button>
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
