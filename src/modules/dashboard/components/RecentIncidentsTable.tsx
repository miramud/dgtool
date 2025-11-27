"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import AdvancedTable from "@/components/shared/AdvancedTable";
import {
  DataIncident,
  SEVERITY_CONFIG,
  INCIDENT_STATUS_CONFIG,
} from "../types/dashboard";

interface RecentIncidentsTableProps {
  incidents: DataIncident[];
  showPolicyColumn?: boolean;
  className?: string;
}

export default function RecentIncidentsTable({
  incidents,
  showPolicyColumn = false,
  className,
}: RecentIncidentsTableProps) {
  const router = useRouter();

  const handleViewMore = () => {
    router.push("/dashboard/data-catalogue");
  };

  // Define table columns
  const columns = [
    { key: "incidentId", header: "Incident ID" },
    { key: "assetName", header: "Asset Name" },
    ...(showPolicyColumn ? [{ key: "policyViolated", header: "Policy Violated" }] : []),
    { key: "severity", header: "Severity" },
    { key: "status", header: "Status" },
  ];

  // Format cell values
  const getFormattedValue = (incident: DataIncident, columnKey: string) => {
    switch (columnKey) {
      case "incidentId":
        return <span className="text-gray-900">{incident.incidentId}</span>;

      case "assetName":
        return <span className="text-gray-700">{incident.assetName}</span>;

      case "policyViolated":
        return <span className="text-gray-700">{incident.policyViolated || "-"}</span>;

      case "severity":
        const severityConfig = SEVERITY_CONFIG[incident.severity];
        return (
          <span className={cn("text-sm font-medium", severityConfig.color)}>
            {incident.severity}
          </span>
        );

      case "status":
        const statusConfig = INCIDENT_STATUS_CONFIG[incident.status];
        return (
          <span className={cn("flex items-center gap-2 text-sm", statusConfig.color)}>
            <span className={cn("w-2 h-2 rounded-full", statusConfig.dotColor)} />
            {incident.status}
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-0", className)}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border border-b-0 border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Data Incidents
          </h3>
          <button
            onClick={handleViewMore}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            MORE
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-t-none overflow-hidden">
        <AdvancedTable
          data={incidents}
          columns={columns}
          getFormattedValue={getFormattedValue}
          showCheckBox={false}
          className="rounded-t-none border-t-0"
        />
      </div>
    </div>
  );
}
