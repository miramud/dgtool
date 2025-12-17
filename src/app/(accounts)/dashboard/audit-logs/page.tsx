"use client";

import { useState, useMemo } from "react";
import AdvancedTable from "@/components/shared/AdvancedTable";
import DropdownAndSearch from "@/components/shared/DropdownAndSearch";
import { useAuditLogs } from "@/hooks/useAuditLog";
import { AuditLog, ACTIVITY_LABELS } from "@/types/audit-log";
import { format } from "date-fns";

export default function AuditLogPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const currentPage = 1;
  const pageSize = 10;

  const { data, isLoading, isError } = useAuditLogs(searchValue, currentPage, pageSize);

  const auditLogs = useMemo(() => data?.data?.results || [], [data?.data?.results]);

  const columns = [
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
    { key: "date", header: "Date" },
    { key: "activity", header: "Activity" },
  ];

  const getFormattedValue = (log: AuditLog, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <span className="text-gray-900">
            {`${log.user.first_name} ${log.user.last_name}`}
          </span>
        );
      case "role":
        return (
          <span className="text-gray-900 capitalize">
            {log.activity.replace(/_/g, " ").toLowerCase()}
          </span>
        );
      case "date":
        return (
          <span className="text-gray-900">
            {format(new Date(log.activity_datetime), "MMM dd, yyyy - hh:mmaaa")}
          </span>
        );
      case "activity":
        return (
          <span className="text-gray-900">
            {ACTIVITY_LABELS[log.activity] || log.metadata || "Activity performed"}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-background p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Audit Log</h1>
        <p className="text-sm text-muted-foreground">
          Add and manage your internal users. Only authorized users can access your company dashboard on Rigshare.
        </p>
      </div>

      <DropdownAndSearch
        options={["Filter Option 1", "Filter Option 2"]}
        selectedOption={selectedFilter}
        onSelect={setSelectedFilter}
        dropdownPlaceholder="Filter"
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Equipment name, owner name, location"
        className="mb-6"
      />

      {isError ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Failed to load audit logs</p>
        </div>
      ) : (
        <AdvancedTable
          data={auditLogs}
          columns={columns}
          getFormattedValue={getFormattedValue}
          isLoading={isLoading}
          showCheckBox={false}
          options={[]}
        />
      )}
    </div>
  );
}
