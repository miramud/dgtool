"use client";

import { useState } from "react";
import AdvancedTable from "@/components/shared/AdvancedTable";
import {
  useGetDatasetCleanupSession,
  useGetDatasetDuplicateRecords,
  useGetDuplicateRecordsByGroup,
  Inconsistency,
  DuplicateRecord,
} from "../controllers/dataCatalogueController";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import {
  SeverityBadge,
  ActionBadge,
  QualityMessage,
  SeverityLevel,
} from "./DataQualityStatus";
import {
  SuccessRateCard,
  InconsistencyCard,
  ProcessingSummaryCard,
  EmptyStateCard,
} from "./QualityMetricCard";

interface DataQualityTabProps {
  dataset: any;
}

export default function DataQualityTab({ dataset }: DataQualityTabProps) {
  const { data: cleanupSession, isLoading } = useGetDatasetCleanupSession(
    dataset?.id
  );
  const { data: duplicateRecordsResponse, isLoading: isDuplicatesLoading } =
    useGetDatasetDuplicateRecords(dataset?.id);

  const inconsistenciesData = cleanupSession?.inconsistencies || [];
  const duplicateRecords = duplicateRecordsResponse?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupHash, setSelectedGroupHash] = useState<string>("");

  // Fetch duplicate records for the selected group
  const { data: duplicateGroupData, isLoading: isGroupLoading } =
    useGetDuplicateRecordsByGroup(dataset?.id, selectedGroupHash);

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

  // Table columns configuration for duplicates
  const duplicate_columns = [
    { key: "row_number", header: "Row Number" },
    { key: "unique_together_fields", header: "Unique Fields" },
    { key: "duplicate_count", header: "Duplicates Found" },
    { key: "field_values", header: "Field Values" },
    { key: "is_first_occurrence", header: "First Occurrence" },
    { key: "created_datetime", header: "Created Date" },
  ];

  // Format table cell data for inconsistencies
  const getFormattedValue = (item: Inconsistency, columnKey: string) => {
    switch (columnKey) {
      case "row_number":
        return (
          <span className='font-medium text-gray-900'>{item.row_number}</span>
        );
      case "field_name":
        return (
          <span className='font-medium text-gray-900'>{item.field_name}</span>
        );
      case "inconsistency_type":
        return (
          <span className='px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800'>
            {item.inconsistency_type.replace(/_/g, " ")}
          </span>
        );
      case "severity":
        return <SeverityBadge severity={item.severity as SeverityLevel} />;
      case "original_value":
        // Check if it's a composite value (contains = and ,)
        if (
          item.original_value &&
          item.original_value.includes("=") &&
          item.original_value.includes(",")
        ) {
          const parts = item.original_value.split(", ");
          return (
            <div className='text-gray-700 font-mono text-sm max-w-xs'>
              {parts.map((part, index) => (
                <div key={index} className='mb-1'>
                  {part}
                </div>
              ))}
            </div>
          );
        }
        return (
          <span className='text-gray-700 font-mono text-sm break-words max-w-xs'>
            {item.original_value || "N/A"}
          </span>
        );
      case "error_message":
        return (
          <span
            className='text-gray-600 text-sm max-w-md truncate block'
            title={item.error_message}
          >
            {item.error_message}
          </span>
        );
      case "action_taken":
        return <ActionBadge action={item.action_taken} />;
      default:
        return null;
    }
  };

  // Format table cell data for duplicate records
  const getFormattedDuplicateValue = (
    item: DuplicateRecord,
    columnKey: string
  ) => {
    switch (columnKey) {
      case "row_number":
        return (
          <span className='font-medium text-gray-900'>{item.row_number}</span>
        );

      case "unique_together_fields":
        const fields = Array.isArray(item.unique_together_fields)
          ? item.unique_together_fields
          : JSON.parse(item.unique_together_fields || "[]");
        return (
          <div className='flex flex-wrap gap-1'>
            {fields.map((field: string, index: number) => (
              <span
                key={index}
                className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'
              >
                {field}
              </span>
            ))}
          </div>
        );
      case "duplicate_count":
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
            {item.duplicate_count} duplicates
          </span>
        );
      case "field_values":
        try {
          const values =
            typeof item.field_values === "object"
              ? item.field_values
              : JSON.parse(item.field_values || "{}");
          return (
            <div className='text-sm text-gray-600 max-w-64'>
              {Object.entries(values).map(([key, value], index) => (
                <div key={index} className='mb-1'>
                  <span className='font-medium'>{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          );
        } catch {
          return (
            <span className='text-sm text-gray-600 break-words max-w-64'>
              {String(item.field_values) || "N/A"}
            </span>
          );
        }
      case "is_first_occurrence":
        return (
          <span
            className={`px-2 py-1 text-xs rounded-md ${
              item.is_first_occurrence
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {item.is_first_occurrence ? "Yes" : "No"}
          </span>
        );
      case "created_datetime":
        try {
          const date = new Date(item.created_datetime);
          return (
            <span className='text-sm text-gray-600'>
              {date.toLocaleDateString("en-US")}
            </span>
          );
        } catch {
          return (
            <span className='text-sm text-gray-600'>
              {item.created_datetime || "N/A"}
            </span>
          );
        }
      default:
        const value = item[columnKey as keyof DuplicateRecord];
        let displayValue = "N/A";

        if (value !== null && value !== undefined) {
          if (typeof value === "object") {
            displayValue = JSON.stringify(value);
          } else {
            displayValue = String(value);
          }
        }

        return <span className='text-gray-900'>{displayValue}</span>;
    }
  };

  const handleRowClick = (item: DuplicateRecord) => {
    setSelectedGroupHash(item.duplicate_group_hash);
    setIsModalOpen(true);
  };

  // Get unique duplicate groups (only first occurrence of each group)
  const getUniqueGroups = () => {
    const seen = new Set();
    return duplicateRecords.filter((record) => {
      if (seen.has(record.duplicate_group_hash)) {
        return false;
      }
      seen.add(record.duplicate_group_hash);
      return true;
    });
  };

  if (isLoading || isDuplicatesLoading) {
    return (
      <div className='p-4 space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='bg-white p-6 border border-gray-200 rounded-lg animate-pulse'
            >
              <div className='h-4 bg-gray-200 rounded mb-2'></div>
              <div className='h-8 bg-gray-200 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 space-y-8'>
      {/* Quality Metrics Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <SuccessRateCard rate={cleanupSession?.success_rate} />
        <InconsistencyCard count={cleanupSession?.total_inconsistencies || 0} />
        <ProcessingSummaryCard
          status={cleanupSession?.status}
          totalRowsProcessed={cleanupSession?.total_rows_processed}
          totalRowsCleaned={cleanupSession?.total_rows_cleaned}
          totalRowsRejected={cleanupSession?.total_rows_rejected}
        />
      </div>

      {/* Data Quality Issues Table Section */}
      <div className="space-y-4">
        <div>
          <h3 className='text-lg font-medium text-gray-900'>
            Data Quality Issues
          </h3>
        </div>

        {/* Status Message */}
        {inconsistenciesData.length > 0 ? (
          <QualityMessage
            type="warning"
            title={`${inconsistenciesData.length} inconsistencies detected`}
            description="Review the issues below and take appropriate action to improve data quality."
          />
        ) : (
          <QualityMessage
            type="success"
            title="No data quality issues found"
            description="Your dataset passed all quality checks successfully."
          />
        )}

        {inconsistenciesData.length > 0 && (
          <AdvancedTable
            data={inconsistenciesData}
            columns={columns}
            isLoading={isLoading}
            showCheckBox={false}
            getFormattedValue={getFormattedValue}
          />
        )}
      </div>

      {/* Duplicate Issues Table Section */}
      <div className="space-y-4">
        <div>
          <h3 className='text-lg font-medium text-gray-900'>
            Duplicate Issues
          </h3>
        </div>

        {/* Status Message */}
        {getUniqueGroups().length > 0 ? (
          <QualityMessage
            type="warning"
            title={`${getUniqueGroups().length} duplicate groups detected`}
            description="Click on any row to view all duplicates in that group and take action."
          />
        ) : (
          <QualityMessage
            type="success"
            title="No duplicate issues found"
            description="No duplicate records were detected in your dataset."
          />
        )}

        {getUniqueGroups().length > 0 && (
          <AdvancedTable
            data={getUniqueGroups()}
            columns={duplicate_columns}
            isLoading={isDuplicatesLoading}
            showCheckBox={false}
            onRowClick={handleRowClick}
            getFormattedValue={getFormattedDuplicateValue}
            className='cursor-pointer'
          />
        )}
      </div>

      {/* Duplicate Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Duplicate Entries</DialogTitle>
            <DialogDescription>
              {duplicateGroupData?.data ? (
                <>
                  Found {duplicateGroupData.data.duplicate_records.length}{" "}
                  duplicate entries for:{" "}
                  <strong>
                    {duplicateGroupData.data.unique_together_fields.join(
                      ", "
                    ) || "this record"}
                  </strong>
                </>
              ) : isGroupLoading ? (
                "Loading duplicate details..."
              ) : (
                "No duplicate data available"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {isGroupLoading ? (
              <div className='text-center py-8'>
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
                </div>
                <h3 className='mt-2 text-sm font-medium text-gray-900'>
                  Loading duplicate records...
                </h3>
              </div>
            ) : !duplicateGroupData?.data ||
              duplicateGroupData.data.duplicate_records.length === 0 ? (
              <EmptyStateCard
                icon={CheckCircle2}
                title="All duplicates processed"
                description="All duplicate entries have been either retained or removed from the system."
              />
            ) : (
              duplicateGroupData.data.duplicate_records.map((duplicate) => {
                let rowData = {};
                try {
                  rowData =
                    typeof duplicate.row_data === "string"
                      ? JSON.parse(duplicate.row_data)
                      : duplicate.row_data;
                } catch {
                  rowData = {};
                }

                return (
                  <div
                    key={duplicate.id}
                    className='border rounded-lg p-4 bg-gray-50'
                  >
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
                      {Object.entries(rowData)
                        .slice(0, 6)
                        .map(([key, value]) => (
                          <div key={key}>
                            <span className='text-sm font-medium text-gray-500'>
                              {key.charAt(0).toUpperCase() +
                                key.slice(1).replace(/_/g, " ")}
                              :
                            </span>
                            <p className='text-sm text-gray-900'>
                              {String(value) || "N/A"}
                            </p>
                          </div>
                        ))}
                      <div>
                        <span className='text-sm font-medium text-gray-500'>
                          Status:
                        </span>
                        <p className='text-sm text-gray-900 mt-1'>
                          <ActionBadge action="MANUAL_REVIEW_REQUIRED" />
                        </p>
                      </div>
                      <div>
                        <span className='text-sm font-medium text-gray-500'>
                          Row:
                        </span>
                        <p className='text-sm text-gray-900'>
                          <span className='px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 font-medium'>
                            {duplicate.row_number}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* <div className='flex items-center justify-between'>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='flex items-center gap-1'
                        >
                          <Check className='w-4 h-4' />
                          Keep
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='flex items-center gap-1 text-red-600 hover:text-red-700'
                        >
                          <Trash2 className='w-4 h-4' />
                          Delete
                        </Button>
                      </div>
                    </div> */}
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
