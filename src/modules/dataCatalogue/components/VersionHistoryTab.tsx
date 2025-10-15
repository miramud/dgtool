"use client";

import AdvancedTable from "@/components/shared/AdvancedTable";

interface VersionHistoryTabProps {
  dataset: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function VersionHistoryTab({ dataset }: VersionHistoryTabProps) {
  const versionHistory = [
    {
      version: "v1.3",
      date: "Aug 20, 2025",
      editor: "Mary Smith",
      description: "Updated schema, added Water_Cut field."
    },
    {
      version: "v1.2", 
      date: "july 15, 2025",
      editor: "John Doe",
      description: "Fixed missing Gas_Produced records."
    },
    {
      version: "v1.1",
      date: "Jun 05, 2025", 
      editor: "System",
      description: "Initial dataset upload."
    }
  ];

  const columns = [
    { key: "version", header: "Version" },
    { key: "date", header: "Date" },
    { key: "editor", header: "Editor" },
    { key: "description", header: "Description" }
  ];

  const getFormattedValue = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "version":
        return <span className="font-medium text-gray-900">{item.version}</span>;
      case "date":
        return <span className="text-gray-700">{item.date}</span>;
      case "editor":
        return <span className="text-gray-700">{item.editor}</span>;
      case "description":
        return <span className="text-gray-700">{item.description}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <AdvancedTable
        data={versionHistory}
        columns={columns}
        isLoading={false}
        showCheckBox={false}
        options={[]}
        getFormattedValue={getFormattedValue}
      />
    </div>
  );
}