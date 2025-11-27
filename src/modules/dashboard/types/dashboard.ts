// User type for dashboard display
export type UserRole = "admin" | "steward";

// API Response Types
export interface DashboardStats {
  average_cleanup_score: number;
  total_datasets: number;
  total_data_quality_issues: number;
  total_reported_issues: number;
}

export interface BusinessDomainChart {
  business_domain: string;
  average_cleanup_score: number;
  dataset_count: number;
}

export interface ChartData {
  chart: BusinessDomainChart[];
}

// Metric card with sparkline data
export interface MetricCard {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeLabel?: string;
  sparklineData?: number[];
  isPositiveChange?: boolean;
}

// Data quality score by department
export interface DepartmentScore {
  department: string;
  score: number;
  year: number;
}

// Data incident for table
export interface DataIncident {
  id: string;
  incidentId: string;
  assetName: string;
  policyViolated?: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "New" | "In Progress" | "Resolved" | "Closed";
}

// Progress metric (for steward sidebar)
export interface ProgressMetric {
  label: string;
  value: number;
  completion: number;
}

// Filter options
export interface DashboardFilters {
  businessUnit: string;
  dataDomain: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

// Severity config for styling
export const SEVERITY_CONFIG: Record<
  DataIncident["severity"],
  { color: string; bgColor: string }
> = {
  Critical: { color: "text-red-600", bgColor: "bg-red-100" },
  High: { color: "text-orange-600", bgColor: "bg-orange-100" },
  Medium: { color: "text-yellow-600", bgColor: "bg-yellow-100" },
  Low: { color: "text-green-600", bgColor: "bg-green-100" },
};

// Status config for styling
export const INCIDENT_STATUS_CONFIG: Record<
  DataIncident["status"],
  { color: string; dotColor: string }
> = {
  New: { color: "text-blue-700", dotColor: "bg-blue-500" },
  "In Progress": { color: "text-yellow-700", dotColor: "bg-yellow-500" },
  Resolved: { color: "text-green-700", dotColor: "bg-green-500" },
  Closed: { color: "text-gray-700", dotColor: "bg-gray-500" },
};
