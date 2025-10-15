"use client";

import AdvancedTable from "@/components/shared/AdvancedTable";

interface DataQualityTabProps {
  dataset: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function DataQualityTab({ dataset }: DataQualityTabProps) {

  // Data quality profiling table data
  const profilingData = [
    {
      id: 1,
      field: "Well_ID",
      dataType: "String",
      nullCount: 0,
      uniqueValues: 125,
      minLength: 8,
      maxLength: 12,
      pattern: "WL-[A-Z]{2}-[0-9]{3}"
    },
    {
      id: 2,
      field: "Production_Date",
      dataType: "Date",
      nullCount: 2,
      uniqueValues: 365,
      minValue: "2024-01-01",
      maxValue: "2024-12-31",
      pattern: "YYYY-MM-DD"
    },
    {
      id: 3,
      field: "Oil_Production_BBL",
      dataType: "Float",
      nullCount: 5,
      uniqueValues: 890,
      minValue: 0,
      maxValue: 2500.75,
      pattern: "Numeric"
    },
    {
      id: 4,
      field: "Gas_Production_MCF",
      dataType: "Float",
      nullCount: 3,
      uniqueValues: 745,
      minValue: 0,
      maxValue: 5000.25,
      pattern: "Numeric"
    },
    {
      id: 5,
      field: "Water_Cut_Percentage",
      dataType: "Float",
      nullCount: 1,
      uniqueValues: 256,
      minValue: 0.1,
      maxValue: 89.5,
      pattern: "Percentage"
    }
  ];

  // Table columns configuration
  const columns = [
    { key: "field", header: "Field Name" },
    { key: "dataType", header: "Data Type" },
    { key: "nullCount", header: "Null Count" },
    { key: "uniqueValues", header: "Unique Values" },
    { key: "range", header: "Min/Max" },
    { key: "pattern", header: "Pattern/Format" },
  ];

  // Format table cell data
  const getFormattedValue = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "field":
        return <span className="font-medium text-gray-900">{item.field}</span>;
      case "dataType":
        return <span className="text-gray-700">{item.dataType}</span>;
      case "nullCount":
        return (
          <span className={`${item.nullCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {item.nullCount}
          </span>
        );
      case "uniqueValues":
        return <span className="text-gray-700">{item.uniqueValues}</span>;
      case "range":
        if (item.minValue !== undefined && item.maxValue !== undefined) {
          return (
            <span className="text-gray-700 text-sm">
              {item.minValue} - {item.maxValue}
            </span>
          );
        }
        if (item.minLength !== undefined && item.maxLength !== undefined) {
          return (
            <span className="text-gray-700 text-sm">
              {item.minLength} - {item.maxLength} chars
            </span>
          );
        }
        return <span className="text-gray-500">-</span>;
      case "pattern":
        return <span className="text-gray-700 font-mono text-sm">{item.pattern}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-8">
      {/* Quality Metrics Section */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Completeness */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Completeness:</h4>
            <div className="text-4xl font-bold text-gray-900">98%</div>
          </div>

          {/* Outlier Count */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Outlier Count:</h4>
            <div className="text-4xl font-bold text-gray-900">35</div>
            <div className="text-sm text-gray-600 mt-1">values flagged ↓</div>
          </div>

          {/* Consistency, Accuracy, Recent Anomalies grouped together */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="space-y-4">
              {/* Consistency */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Consistency:</h4>
                <div className="text-gray-600 text-sm">Pass (validation vs reference tables)</div>
              </div>

              {/* Accuracy */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Accuracy:</h4>
                <div className="text-gray-600 text-sm">Cross-verified with historian logs</div>
              </div>

              {/* Recent Anomalies */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Recent Anomalies:</h4>
                <div className="text-gray-600 text-sm">None detected in last 30 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Profiling Table Section */}
      <div>
        <AdvancedTable
          data={profilingData}
          columns={columns}
          isLoading={false}
          showCheckBox={false}
          getFormattedValue={getFormattedValue}
        />
      </div>
    </div>
  );
}