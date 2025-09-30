"use client";

export default function OverviewTab() {
  const overviewData = {
    description: "Daily oil production data collected from Niger Delta Block A, aggregated from wellhead sensors and historian logs.",
    dataOwner: "John Doe – Production Team",
    dataSteward: "Mary Smith – Data Governance", 
    sourceSystem: "SCADA / Historian / Manual Upload",
    businessUnit: "Upstream – Operations",
    lastUpdated: "2025-08-20 14:30 UTC"
  };

  const infoItems = [
    { label: "Description:", value: overviewData.description },
    { label: "Data Owner:", value: overviewData.dataOwner },
    { label: "Data Steward:", value: overviewData.dataSteward },
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