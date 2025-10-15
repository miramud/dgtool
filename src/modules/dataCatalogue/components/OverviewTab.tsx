"use client";

import { formatDate } from "@/lib/utils";

interface OverviewTabProps {
  dataset: any;
}

export default function OverviewTab({ dataset }: OverviewTabProps) {
  const overviewData = {
    description: dataset?.description || "No description available",
    dataOwner: dataset?.created_by ? `${dataset.created_by.first_name} ${dataset.created_by.last_name}` : "Unknown",
    dataSteward: dataset?.updated_by ? `${dataset.updated_by.first_name} ${dataset.updated_by.last_name}` : "Unknown", 
    sourceSystem: "System Upload",
    businessUnit: dataset?.business_domain || "Unknown",
    lastUpdated: dataset?.updated_datetime ? formatDate(dataset.updated_datetime, { includeTime: true }) : "Unknown"
  };

  const infoItems = [
    { label: "Description:", value: overviewData.description },
    { label: "Data Owner:", value: overviewData.dataOwner },
    { label: "Data Steward:", value: overviewData.dataOwner },
    { label: "Source System:", value: overviewData.sourceSystem },
    { label: "Business Unit:", value: overviewData.businessUnit },
    { label: "Last Updated:", value: overviewData.lastUpdated },
  ];

  return (
    <div className="p-4">
      <div className="space-y-6">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="min-w-[140px] font-medium text-gray-900">
              {item.label}
            </div>
            <div className="text-gray-700 flex-1">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}