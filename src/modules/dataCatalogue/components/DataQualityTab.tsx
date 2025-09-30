"use client";

export default function DataQualityTab() {
  const qualityMetrics = [
    { label: "Completeness:", value: "98%" },
    { label: "Consistency:", value: "Pass (validation vs reference tables)" },
    { label: "Accuracy:", value: "Cross-verified with historian logs" },
    { label: "Outlier Count:", value: "35 values flagged" },
    { label: "Recent Anomalies:", value: "None detected in last 30 days" }
  ];

  return (
    <div className="p-4">
      <div className="space-y-6">
        {qualityMetrics.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="min-w-[150px] font-medium text-gray-900">
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