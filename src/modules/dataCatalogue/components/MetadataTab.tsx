"use client";

export default function MetadataTab() {
  const metadataInfo = [
    { label: "Data Type:", value: "Time-series / Tabular / Geospatial" },
    { label: "Record Count:", value: "2.5M rows" },
    { label: "File Format:", value: "CSV / Parquet / Shapefile" },
    { 
      label: "Schema:", 
      value: "Column names + data types (e.g., Well_ID [string], Date [date], Oil_Produced [float], Gas_Produced [float])" 
    },
    { label: "Storage Location:", value: "Azure Data Lake – WellData/BlockA/2025" },
    { label: "Associated Asset:", value: "Block A – Offshore Field" },
    { label: "KPI Linkages:", value: "Daily Production, Water Cut %" },
    { label: "Reporting Use:", value: "Regulatory reporting, reservoir performance monitoring" },
    { label: "Related Datasets:", value: "Reservoir Simulation Data, Seismic Interpretation Data" }
  ];

  return (
    <div className="p-4">
      <div className="space-y-6">
        {metadataInfo.map((item, index) => (
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