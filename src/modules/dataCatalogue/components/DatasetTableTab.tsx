"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CircleAlert,
  ChevronDown,
  Copy,
  Database,
  Filter,
  Loader2,
  Pencil,
  Search,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import type { DataCatalogue } from "../types/dataCatalogue";
import ConnectDataSourceModal, {
  ConnectedSourceSelection,
} from "./ConnectDataSourceModal";
import {
  CreateDatasetFormData,
  useGetDatasetProcessedData,
  useAppendDataset,
} from "../controllers/dataCatalogueController";

type IssueType =
  | "missing_value"
  | "invalid_format"
  | "duplicate"
  | "rule_violation";

type EditableDatasetColumn =
  | "id"
  | "name"
  | "description"
  | "fieldName"
  | "fieldAttribute"
  | "fieldType"
  | "date";

type DatasetRow = {
  id: string;
  name: string;
  description: string;
  fieldName: string;
  fieldAttribute: string;
  fieldType: string;
  date: string;
  csvValues?: string[];
  issueType?: "error" | "duplicate";
  cellIssues?: Partial<
    Record<
      EditableDatasetColumn,
      {
        type: IssueType;
        message: string;
      }
    >
  >;
};

interface DatasetTableTabProps {
  datasetId: string;
  dataset: DataCatalogue;
}

export default function DatasetTableTab({ datasetId, dataset }: DatasetTableTabProps) {
  const DEFAULT_TABLE_HEADERS = [
    "Name",
    "Description",
    "Field Name",
    "Field Attribute",
    "Field Type",
    "Date",
  ];
  const [datasetSearchValue, setDatasetSearchValue] = useState("");
  const [datasetFilterValue, setDatasetFilterValue] = useState("all");
  const [showOnlyIssueRows, setShowOnlyIssueRows] = useState(false);
  const [showOnlyIssueCells, setShowOnlyIssueCells] = useState(false);
  const [isEditingDataset, setIsEditingDataset] = useState(false);
  const [appendModalOpen, setAppendModalOpen] = useState(false);
  const [appendConnectModalOpen, setAppendConnectModalOpen] = useState(false);
  const [appendFile, setAppendFile] = useState<File | null>(null);
  const [appendFileError, setAppendFileError] = useState("");
  const appendFileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [isPreparingEditor, setIsPreparingEditor] = useState(false);
  const [isSavingDataset, setIsSavingDataset] = useState(false);
  const [isExportingDataset, setIsExportingDataset] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [tableHeaders, setTableHeaders] = useState<string[]>(DEFAULT_TABLE_HEADERS);
  const { appendDataset, isLoading: isAppending } = useAppendDataset();
  const {
    data: processedData,
    isLoading: isLoadingProcessedData,
    isError: isProcessedDataError,
    refetch: refetchProcessedData,
  } = useGetDatasetProcessedData(datasetId);

  const [tableRows, setTableRows] = useState<DatasetRow[]>([]);

  const [editedRows, setEditedRows] = useState<Record<string, DatasetRow>>({});

  const toText = (value: unknown, fallback = "") =>
    value === null || value === undefined ? fallback : String(value);

  const parseCsvLine = (line: string): string[] => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
        continue;
      }

      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }

      if (char === "," && !inQuotes) {
        cells.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    cells.push(current.trim());
    return cells;
  };

  const parseCsvText = (csvText: string): { headers: string[]; rows: Array<Record<string, string>> } => {
    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) return { headers: [], rows: [] };

    const headers = parseCsvLine(lines[0]).map((header) => header.trim());

    const rows = lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      return headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = values[index] ?? "";
        return acc;
      }, {});
    });

    return { headers, rows };
  };

  const mapCsvRowsToTableRows = (csvText: string): { headers: string[]; rows: DatasetRow[] } => {
    const { headers, rows: csvRows } = parseCsvText(csvText);

    const rows = csvRows.map((row, index) => {
      const values = headers.map((header) => row[header] ?? "");
      const firstName = row.first_name || row.firstname || row.firstName || "";
      const lastName = row.last_name || row.lastname || row.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();

      return {
        id: toText(row.id || row.row_number || index + 1, `row-${index + 1}`),
        name: toText(row.name || row.full_name || fullName || row.email, "--"),
        description: toText(row.description || row.email, "--"),
        fieldName: toText(row.field_name || row.first_name || "--"),
        fieldAttribute: toText(row.field_attribute || row.last_name || row.mobile_number || "--"),
        fieldType: toText(row.field_type || row.type || "--"),
        date: toText(row.date || row.created_datetime || row.updated_datetime || "--"),
        csvValues: values,
      };
    });

    return { headers, rows };
  };


  const mapProcessedRows = (payload: any): { headers: string[]; rows: DatasetRow[] } => {
    if (typeof payload === "string") {
      return mapCsvRowsToTableRows(payload);
    }

    const rawRows =
      (Array.isArray(payload) && payload) ||
      (Array.isArray(payload?.results) && payload.results) ||
      (Array.isArray(payload?.data?.results) && payload.data.results) ||
      (Array.isArray(payload?.rows) && payload.rows) ||
      (Array.isArray(payload?.data?.rows) && payload.data.rows) ||
      [];

    const rows = rawRows.map((row: any, index: number) => {
      const issueType: DatasetRow["issueType"] =
        row?.issueType === "duplicate" || row?.issue_type === "duplicate"
          ? "duplicate"
          : row?.issueType === "error" || row?.issue_type === "error"
          ? "error"
          : undefined;

      return {
        id: toText(row?.id ?? row?._id ?? row?.row_number ?? index + 1, `row-${index + 1}`),
        name: toText(row?.name ?? row?.Name ?? row?.full_name ?? row?.employee_name, "--"),
        description: toText(row?.description ?? row?.Description ?? row?.details, "--"),
        fieldName: toText(row?.fieldName ?? row?.field_name ?? row?.business_domain, "--"),
        fieldAttribute: toText(
          row?.fieldAttribute ?? row?.field_attribute ?? row?.column_name,
          "--"
        ),
        fieldType: toText(row?.fieldType ?? row?.field_type ?? row?.type ?? row?.data_type, "--"),
        date: toText(row?.date ?? row?.created_datetime ?? row?.updated_datetime, "--"),
        issueType,
      };
    });

    return {
      headers: DEFAULT_TABLE_HEADERS,
      rows,
    };
  };

  const filteredRows = useMemo(() => {
    const normalizedQuery = datasetSearchValue.trim().toLowerCase();

    const matchesSearch = (row: DatasetRow) => {
      if (!normalizedQuery) return true;
      return (
        row.name.toLowerCase().includes(normalizedQuery) ||
        row.description.toLowerCase().includes(normalizedQuery) ||
        row.fieldName.toLowerCase().includes(normalizedQuery) ||
        row.fieldAttribute.toLowerCase().includes(normalizedQuery) ||
        row.fieldType.toLowerCase().includes(normalizedQuery) ||
        row.date.toLowerCase().includes(normalizedQuery)
      );
    };

    const matchesFilter = (row: DatasetRow) => {
      if (datasetFilterValue === "all") return true;
      const issueTypes = Object.values(row.cellIssues || {}).map((issue) => issue.type);
      if (datasetFilterValue === "error" || datasetFilterValue === "duplicate") {
        return row.issueType === datasetFilterValue;
      }
      return issueTypes.includes(datasetFilterValue as IssueType);
    };

    const matchesIssueRowToggle = (row: DatasetRow) => {
      if (!showOnlyIssueRows) return true;
      return !!row.issueType || Object.keys(row.cellIssues || {}).length > 0;
    };

    return tableRows.filter(
      (row) => matchesSearch(row) && matchesFilter(row) && matchesIssueRowToggle(row)
    );
  }, [datasetFilterValue, datasetSearchValue, showOnlyIssueRows, tableRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const pagedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleStartEdit = () => {
    if (isPreparingEditor) return;
    setIsPreparingEditor(true);

    const mappedRows: Record<string, DatasetRow> = {};
    tableRows.forEach((row) => {
      mappedRows[row.id] = { ...row };
    });

    setTimeout(() => {
      setEditedRows(mappedRows);
      setIsEditingDataset(true);
      setIsPreparingEditor(false);
    }, 350);
  };

  const handleCancelAppend = () => {
    setAppendModalOpen(false);
    setAppendFile(null);
    setAppendFileError("");
  };

  const handleSaveDataset = () => {
    setTableRows(Object.values(editedRows));
    setIsEditingDataset(false);
  };

  const validateEditedDataset = () => {
    const rows = Object.values(editedRows);
    const invalidRows = rows.filter(
      (row) =>
        !row.name?.trim() ||
        !row.description?.trim() ||
        !row.fieldName?.trim() ||
        !row.fieldAttribute?.trim() ||
        !row.fieldType?.trim()
    );

    return {
      totalRows: rows.length,
      invalidRows: invalidRows.length,
      isValid: invalidRows.length === 0,
    };
  };

  const handleSaveDatasetWithLoading = () => {
    if (!isEditingDataset || isSavingDataset) return;
    setIsSavingDataset(true);
    setSaveStatus("saving");

    setTimeout(() => {
      const validation = validateEditedDataset();
      if (!validation.isValid) {
        toast.error(
          `Cannot save. ${validation.invalidRows} row(s) have missing required fields.`
        );
        setSaveStatus("error");
        setIsSavingDataset(false);
        return;
      }

      handleSaveDataset();
      toast.success("Dataset table changes saved.");
      setSaveStatus("success");
      setLastSavedAt(new Date());
      setIsSavingDataset(false);
    }, 600);
  };

  const handleExportDataset = () => {
    if (isExportingDataset) return;
    setIsExportingDataset(true);

    setTimeout(() => {
      const headers = [
        ...tableHeaders,
      ];

      const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
      const csvRows = [
        headers.join(","),
        ...tableRows.map((row) =>
          (row.csvValues || [
            row.name,
            row.description,
            row.fieldName,
            row.fieldAttribute,
            row.fieldType,
            row.date,
          ])
            .map((cell) => escapeCsv(String(cell ?? "")))
            .join(",")
        ),
      ];

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${dataset?.name || "dataset-table"}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Dataset table exported.");
      setIsExportingDataset(false);
    }, 500);
  };

  const handleCellChange = (
    rowId: string,
    key: keyof DatasetRow,
    value: string
  ) => {
    setEditedRows((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [key]: value,
      },
    }));
  };

  const handleAppendFileSelect = () => {
    appendFileInputRef.current?.click();
  };

  const handleAppendFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (!validTypes.includes(file.type)) {
      setAppendFileError("Invalid file type. Please upload only .xlsx or .csv files.");
      setAppendFile(null);
      return;
    }
    setAppendFileError("");
    setAppendFile(file);
  };

  const handleAppendSubmit = () => {
    if (!appendFile) return;

    const appendPayload: CreateDatasetFormData = {
      name: dataset?.name || "",
      description: dataset?.description || "",
      business_domain:
        (dataset as any)?.business_domain || dataset?.businessDescription || "",
      sensitivity:
        (dataset?.sensitivity as "INTERNAL" | "EXTERNAL" | "PRIVATE") ||
        "INTERNAL",
      tags: Array.isArray(dataset?.tags)
        ? dataset.tags.join(", ")
        : ((dataset as any)?.tags ?? ""),
      raw_file: appendFile,
      metadata_template: (dataset as any)?.metadata_template,
    };

    appendDataset({ datasetId, formData: appendPayload })
      .then(() => {
        handleCancelAppend();
        refetchProcessedData();
      })
      .catch(() => {});
  };

  const handleAppendFromConnection = (selection: ConnectedSourceSelection) => {
    const appendPayload: CreateDatasetFormData = {
      name: dataset?.name || "",
      description: dataset?.description || "",
      business_domain:
        (dataset as any)?.business_domain || dataset?.businessDescription || "",
      sensitivity:
        (dataset?.sensitivity as "INTERNAL" | "EXTERNAL" | "PRIVATE") ||
        "INTERNAL",
      tags: Array.isArray(dataset?.tags)
        ? dataset.tags.join(", ")
        : ((dataset as any)?.tags ?? ""),
      metadata_template: (dataset as any)?.metadata_template,
      db_connection_info: selection.db_connection_info,
    };

    appendDataset({ datasetId, formData: appendPayload })
      .then(() => {
        refetchProcessedData();
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (isEditingDataset) return;
    const mapped = mapProcessedRows(processedData);
    setTableHeaders(mapped.headers.length > 0 ? mapped.headers : DEFAULT_TABLE_HEADERS);
    setTableRows(mapped.rows);
  }, [isEditingDataset, processedData]);

  const renderIssueIcon = (issueType?: IssueType) => {
    if (issueType === "missing_value") {
      return <CircleAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />;
    }
    if (issueType === "invalid_format") {
      return <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />;
    }
    if (issueType === "duplicate") {
      return <Copy className="w-4 h-4 text-indigo-600 flex-shrink-0" />;
    }
    if (issueType === "rule_violation") {
      return <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by business terms, Name or ID"
              value={datasetSearchValue}
              onChange={(event) => {
                setDatasetSearchValue(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm"
            />
          </div>
          <div className="relative w-full md:w-44">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={datasetFilterValue}
              onChange={(event) => {
                setDatasetFilterValue(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent"
            >
              <option value="all">Filter</option>
              <option value="error">Errors</option>
              <option value="duplicate">Duplicates</option>
              <option value="missing_value">Missing Values</option>
              <option value="invalid_format">Invalid Format</option>
              <option value="rule_violation">Rule Violation</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          <Button
            type="button"
            variant={showOnlyIssueRows ? "default" : "outline"}
            className={cn(
              "h-10",
              showOnlyIssueRows
                ? "bg-[#4A4A7A] hover:bg-[#3A3A6A]"
                : "border-[#C9C6D7] text-[#4A4A7A]"
            )}
            onClick={() => {
              setShowOnlyIssueRows((prev) => !prev);
              setCurrentPage(1);
            }}
          >
            Only Issue Rows
          </Button>
          <Button
            type="button"
            variant={showOnlyIssueCells ? "default" : "outline"}
            className={cn(
              "h-10",
              showOnlyIssueCells
                ? "bg-[#4A4A7A] hover:bg-[#3A3A6A]"
                : "border-[#C9C6D7] text-[#4A4A7A]"
            )}
            onClick={() => setShowOnlyIssueCells((prev) => !prev)}
          >
            Only Issue Cells
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {isEditingDataset && (
            <Button
              variant="outline"
              className="border-[#4A4A7A] text-[#4A4A7A] hover:bg-[#E9E7F3]"
              onClick={handleSaveDatasetWithLoading}
              disabled={isSavingDataset}
            >
              {isSavingDataset ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Dataset"
              )}
            </Button>
          )}
          <Button
            variant="outline"
            className="border-[#C9C6D7] text-[#4A4A7A] hover:bg-[#F3F1FA]"
            onClick={handleExportDataset}
            disabled={isExportingDataset}
          >
            {isExportingDataset ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </span>
            ) : (
              "Export"
            )}
          </Button>
          <Button
            variant="outline"
            className={cn(
              "border-[#C9C6D7] text-[#4A4A7A] hover:bg-[#F3F1FA]",
              (isEditingDataset || isPreparingEditor) && "opacity-60 cursor-not-allowed"
            )}
            onClick={handleStartEdit}
            disabled={isEditingDataset || isPreparingEditor}
          >
            {isPreparingEditor ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Opening editor...
              </span>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Dataset
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#4A4A7A] hover:bg-[#3A3A6A]" disabled={isAppending}>
                Append Data
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setAppendModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload New File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAppendConnectModalOpen(true)}>
                <Database className="w-4 h-4 mr-2" />
                Connect to Data Source
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {(saveStatus !== "idle" || lastSavedAt) && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
          <p className="text-sm text-gray-600">
            Last saved:{" "}
            <span className="font-medium text-gray-900">
              {lastSavedAt ? lastSavedAt.toLocaleString() : "--"}
            </span>
          </p>
          <p
            className={cn(
              "text-sm font-medium",
              saveStatus === "saving" && "text-blue-700",
              saveStatus === "success" && "text-green-700",
              saveStatus === "error" && "text-red-700"
            )}
          >
            {saveStatus === "saving" && "Saving changes..."}
            {saveStatus === "success" && "Saved"}
            {saveStatus === "error" && "Save failed"}
          </p>
        </div>
      )}

      <div className="flex items-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#FCE8E8] border border-[#F3B7B7]"></span>
          <span className="text-gray-600">Error</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#ECE8F5] border border-[#CEC5E2]"></span>
          <span className="text-gray-600">Duplicate</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleAlert className="w-4 h-4 text-amber-600" />
          <span className="text-gray-600">Missing Value</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <span className="text-gray-600">Invalid Format</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span className="text-gray-600">Rule Violation</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isProcessedDataError && (
          <div className="px-6 py-3 border-b border-red-200 bg-red-50 text-sm text-red-700">
            Unable to load processed dataset rows. Please refresh and try again.
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                {[
                  ...tableHeaders,
                ].map((header, index) => (
                  <th
                    key={`${header}-${index}`}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingProcessedData ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading dataset rows...
                    </span>
                  </td>
                </tr>
              ) : pagedRows.length > 0 ? (
                pagedRows.map((row) => {
                  const rowData = isEditingDataset ? editedRows[row.id] || row : row;
                  const cellIssues = row.cellIssues || {};
                  const getIssueForCell = (key: EditableDatasetColumn) => cellIssues[key];
                  const isErrorCell = (key: EditableDatasetColumn) => {
                    const issue = getIssueForCell(key);
                    return !!issue && issue.type !== "duplicate";
                  };
                  const isDuplicateCell = (key: EditableDatasetColumn) =>
                    getIssueForCell(key)?.type === "duplicate";
                  const isEditableCell = (key: EditableDatasetColumn) =>
                    isEditingDataset && !!getIssueForCell(key);

                  return (
                    <tr key={row.id}>
                      {tableHeaders.map((header, index) => {
                        const fixedKeys = [
                          "name",
                          "description",
                          "fieldName",
                          "fieldAttribute",
                          "fieldType",
                          "date",
                        ] as EditableDatasetColumn[];
                        const key = fixedKeys[index];
                        const issue = getIssueForCell(key);
                        const cellClasses = cn(
                          "px-6 py-4 text-sm text-gray-900 align-middle",
                          isErrorCell(key) && "bg-[#FCE8E8]",
                          isDuplicateCell(key) && "bg-[#ECE8F5]"
                        );

                        return (
                          <td key={`${row.id}-${key}`} className={cellClasses}>
                            {isEditableCell(key) ? (
                              <input
                                type="text"
                                value={rowData[key] ?? ""}
                                onChange={(event) =>
                                  handleCellChange(row.id, key, event.target.value)
                                }
                                className="w-full rounded-md border border-green-500 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                {renderIssueIcon(issue?.type)}
                                {showOnlyIssueCells && !issue ? (
                                  <span className="text-gray-300">--</span>
                                ) : (
                                  <span
                                    className="block truncate max-w-[320px]"
                                    title={issue?.message || ""}
                                  >
                                    {row.csvValues?.[index] ?? rowData[key] ?? "--"}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={Math.max(1, tableHeaders.length)} className="px-6 py-10 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              className="px-2 py-1 rounded hover:bg-gray-100"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(0, 3)
              .map((page) => (
                <button
                  key={page}
                  className={cn(
                    "px-2 py-1 rounded",
                    currentPage === page ? "bg-gray-200 text-gray-900" : "hover:bg-gray-100"
                  )}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            {totalPages > 3 && <span className="px-2">...</span>}
            <button
              className="px-2 py-1 rounded hover:bg-gray-100"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Results per page</span>
            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      <Dialog open={appendModalOpen} onOpenChange={setAppendModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Append Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Upload File</h3>
              {!appendFile ? (
                <div className="border-2 border-dashed rounded-lg p-10 text-center border-gray-300 bg-white">
                  <p className="text-gray-600 mb-2">
                    Choose a file or drag and drop it here (2MB)
                  </p>
                  <p className="text-gray-500 text-xs mb-4">XLSX, CSV</p>
                  <button
                    onClick={handleAppendFileSelect}
                    className="inline-flex items-center px-4 py-2 border border-[#4A4A7A] rounded-md text-sm font-medium text-[#4A4A7A] bg-white hover:bg-[#F3F1FA] transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select File
                  </button>
                  <input
                    ref={appendFileInputRef}
                    type="file"
                    onChange={handleAppendFileChange}
                    accept=".xlsx,.csv"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{appendFile.name}</p>
                    <p className="text-sm text-gray-600">Selected</p>
                  </div>
                  <button
                    onClick={() => setAppendFile(null)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
              {appendFileError && (
                <p className="text-sm text-red-600 mt-2">{appendFileError}</p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCancelAppend}>
              Cancel
            </Button>
            <Button
              className="bg-[#4A4A7A] hover:bg-[#3A3A6A]"
              onClick={handleAppendSubmit}
              disabled={!appendFile || isAppending}
            >
              {isAppending ? "Appending..." : "Append Dataset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConnectDataSourceModal
        open={appendConnectModalOpen}
        onOpenChange={setAppendConnectModalOpen}
        onConnected={handleAppendFromConnection}
      />
    </div>
  );
}
