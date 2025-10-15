"use client";

import AdvancedTable from "@/components/shared/AdvancedTable";
import { useGetDatasetCleanupSession, Inconsistency } from "../controllers/dataCatalogueController";

interface DataQualityTabProps {
  dataset: any;
}

export default function DataQualityTab({ dataset }: DataQualityTabProps) {
  const { data: cleanupSession, isLoading } = useGetDatasetCleanupSession(dataset?.id);

  const inconsistenciesData = cleanupSession?.inconsistencies || [];

  // Table columns configuration for inconsistencies
  const columns = [
    { key: "row_number", header: "Row" },
    { key: "field_name", header: "Field Name" },
    { key: "inconsistency_type", header: "Issue Type" },
    { key: "severity", header: "Severity" },
    { key: "original_value", header: "Original Value" },
    { key: "error_message", header: "Error Message" },
    { key: "action_taken", header: "Action Taken" },
  ];

  // Format table cell data for inconsistencies
  const getFormattedValue = (item: Inconsistency, columnKey: string) => {
    switch (columnKey) {
      case "row_number":
        return <span className="font-medium text-gray-900">{item.row_number}</span>;
      case "field_name":
        return <span className="font-medium text-gray-900">{item.field_name}</span>;
      case "inconsistency_type":
        return (
          <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800">
            {item.inconsistency_type.replace(/_/g, ' ')}
          </span>
        );
      case "severity":
        const severityColors = {
          HIGH: "bg-red-100 text-red-800",
          MEDIUM: "bg-yellow-100 text-yellow-800",
          LOW: "bg-green-100 text-green-800"
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-md ${severityColors[item.severity as keyof typeof severityColors] || 'bg-gray-100 text-gray-800'}`}>
            {item.severity}
          </span>
        );
      case "original_value":
        return (
          <span className="text-gray-700 font-mono text-sm max-w-xs truncate block" title={item.original_value}>
            {item.original_value || 'N/A'}
          </span>
        );
      case "error_message":
        return (
          <span className="text-gray-600 text-sm max-w-md truncate block" title={item.error_message}>
            {item.error_message}
          </span>
        );
      case "action_taken":
        const actionColors = {
          MANUAL_REVIEW_REQUIRED: "bg-orange-100 text-orange-800",
          TYPE_CONVERTED: "bg-blue-100 text-blue-800",
          CORRECTED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800"
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-md ${actionColors[item.action_taken as keyof typeof actionColors] || 'bg-gray-100 text-gray-800'}`}>
            {item.action_taken.replace(/_/g, ' ')}
          </span>
        );
      default:
        return null;
    }
  };


  const formatStatusDisplay = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "FAILED":
        return "Failed";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 border border-gray-200 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      {/* Quality Metrics Section */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Success Rate */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Success Rate:</h4>
            <div className="text-4xl font-bold text-gray-900">
              {cleanupSession?.success_rate ? `${Math.round(cleanupSession.success_rate)}%` : "N/A"}
            </div>
          </div>

          {/* Total Inconsistencies */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Total Inconsistencies:</h4>
            <div className="text-4xl font-bold text-gray-900">
              {cleanupSession?.total_inconsistencies || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">issues detected</div>
          </div>

          {/* Processing Status and Summary */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="space-y-4">
              {/* Processing Status */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Status:</h4>
                <div className="text-gray-600 text-sm">
                  {cleanupSession?.status ? formatStatusDisplay(cleanupSession.status) : "Unknown"}
                </div>
              </div>

              {/* Rows Processed */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Rows Processed:</h4>
                <div className="text-gray-600 text-sm">
                  {cleanupSession?.total_rows_processed?.toLocaleString() || 0} total
                </div>
              </div>

              {/* Rows Cleaned vs Rejected */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Cleaned/Rejected:</h4>
                <div className="text-gray-600 text-sm">
                  {cleanupSession?.total_rows_cleaned?.toLocaleString() || 0} cleaned, {cleanupSession?.total_rows_rejected?.toLocaleString() || 0} rejected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality Issues Table Section */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Data Quality Issues</h3>
          <p className="text-sm text-gray-600">
            {inconsistenciesData.length > 0 
              ? `Found ${inconsistenciesData.length} inconsistencies that require attention`
              : "No data quality issues found"
            }
          </p>
        </div>
        <AdvancedTable
          data={inconsistenciesData}
          columns={columns}
          isLoading={isLoading}
          showCheckBox={false}
          getFormattedValue={getFormattedValue}
        />
      </div>
    </div>
  );
}