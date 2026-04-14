"use client";

import AdvancedTable from "@/components/shared/AdvancedTable";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  DatasetVersion,
  useGetDatasetVersions,
} from "../controllers/dataCatalogueController";
import { Download } from "lucide-react";

interface VersionHistoryTabProps {
  dataset: any;
}

export default function VersionHistoryTab({ dataset }: VersionHistoryTabProps) {
  const { data, isLoading } = useGetDatasetVersions(dataset?.id);
  const versionHistory = data?.results ?? [];

  const columns = [
    { key: "version", header: "Version" },
    { key: "date", header: "Date" },
    { key: "editor", header: "Editor" },
    { key: "download", header: "Download Url" },
  ];

  const getEditorLabel = (item: DatasetVersion) => {
    if (item.editor?.first_name || item.editor?.last_name) {
      return `${item.editor?.first_name ?? ""} ${item.editor?.last_name ?? ""}`.trim();
    }

    return item.editor?.email || "--";
  };

  const getFormattedValue = (item: DatasetVersion, columnKey: string) => {
    switch (columnKey) {
      case "version":
        return (
          <span className="font-medium text-gray-900">
            v{item.version_number}
          </span>
        );
      case "date":
        return (
          <span className="text-gray-700">
            {formatDate(item.created_datetime)}
          </span>
        );
      case "editor":
        return <span className="text-gray-700">{getEditorLabel(item)}</span>;
      case "download":
        return item.file_url ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8"
          >
            <a
              href={item.file_url}
              target="_blank"
              rel="noreferrer"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        ) : (
          <span className="text-gray-400">--</span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <AdvancedTable
        data={versionHistory}
        columns={columns}
        isLoading={isLoading}
        showCheckBox={false}
        options={[]}
        getFormattedValue={getFormattedValue}
      />
    </div>
  );
}
