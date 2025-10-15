"use client";

interface MetadataTabProps {
  dataset: any;
}

export default function MetadataTab({ dataset }: MetadataTabProps) {
  const metadataInfo = [
    { label: "Data Type:", value: dataset?.metadata_template?.dataset_type?.name || "Unknown" },
    // { label: "Record Count:", value: "To be determined" },
    { label: "File Format:", value: dataset?.raw_file ? dataset.raw_file.split('.').pop()?.toUpperCase() || "Unknown" : "Unknown" },
    // { 
    //   label: "Schema:", 
    //   value: "Schema information will be populated after file processing" 
    // },
    { label: "Storage Location:", value: dataset?.raw_file ? "Cloud Storage" : "Unknown" },
    // { label: "Associated Asset:", value: dataset?.business_domain || "Unknown" },
    // { label: "KPI Linkages:", value: "To be configured" },
    { label: "Reporting Use:", value: dataset?.description || "No reporting use defined" },
    // { label: "Related Datasets:", value: "No related datasets configured" }
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