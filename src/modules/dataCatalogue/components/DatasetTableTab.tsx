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
  EditDatasetRowPayload,
  useEditDatasetRow,
  useGetDatasetProcessedData,
  useAppendDataset,
} from "../controllers/dataCatalogueController";

type IssueType =
  | "missing_value"
  | "invalid_format"
  | "duplicate"
  | "rule_violation";

type CellIssue = {
  type: IssueType;
  message: string;
};

type DatasetRow = {
  id: string;
  backendRowIndex: number;
  issueType?: "error" | "duplicate";
  values: Record<string, string>;
  cellIssues?: Record<string, CellIssue>;
};

interface DatasetTableTabProps {
  datasetId: string;
  dataset: DataCatalogue;
}

type BackendIssue = {
  column?: string;
  type?: string;
  severity?: string;
  message?: string;
  action_taken?: string;
  original_value?: string;
  cleaned_value?: string | null;
};

type BackendProcessedRow = {
  row_number?: number;
  data?: Record<string, unknown>;
  is_rejected?: boolean;
  issues?: BackendIssue[];
  duplicates?: unknown[];
};

const DEFAULT_HEADERS = ["row_number"];

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const prettifyHeader = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeIssueType = (rawType?: string): IssueType => {
  const value = String(rawType || "").toLowerCase();
  if (value.includes("duplicate")) return "duplicate";
  if (value.includes("missing") || value.includes("null") || value.includes("empty")) {
    return "missing_value";
  }
  if (value.includes("invalid") || value.includes("format") || value.includes("email")) {
    return "invalid_format";
  }
  return "rule_violation";
};

const looksLikeJsonText = (value: string) => {
  const trimmed = value.trim();
  return (
    trimmed.startsWith("{") ||
    trimmed.startsWith("[") ||
    trimmed.includes("\"row_number\"") ||
    trimmed.includes("row_number")
  );
};

const issueIcon = (issueType?: IssueType) => {
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

export default function DatasetTableTab({ datasetId, dataset }: DatasetTableTabProps) {
  const [datasetSearchValue, setDatasetSearchValue] = useState("");
  const [datasetFilterValue, setDatasetFilterValue] = useState("all");
  const [showOnlyIssueRows, setShowOnlyIssueRows] = useState(false);
  const [showOnlyIssueCells, setShowOnlyIssueCells] = useState(false);

  const [isEditingDataset, setIsEditingDataset] = useState(false);
  const [isPreparingEditor, setIsPreparingEditor] = useState(false);
  const [isSavingDataset, setIsSavingDataset] = useState(false);
  const [isExportingDataset, setIsExportingDataset] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const [appendModalOpen, setAppendModalOpen] = useState(false);
  const [appendConnectModalOpen, setAppendConnectModalOpen] = useState(false);
  const [appendFile, setAppendFile] = useState<File | null>(null);
  const [appendFileError, setAppendFileError] = useState("");
  const appendFileInputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [tableHeaders, setTableHeaders] = useState<string[]>(DEFAULT_HEADERS);
  const [tableRows, setTableRows] = useState<DatasetRow[]>([]);
  const [editedRows, setEditedRows] = useState<Record<string, DatasetRow>>({});

  const { appendDataset, isLoading: isAppending } = useAppendDataset();
  const { editDatasetRow } = useEditDatasetRow();
  const {
    data: processedData,
    isLoading: isLoadingProcessedData,
    isError: isProcessedDataError,
    refetch: refetchProcessedData,
  } = useGetDatasetProcessedData(datasetId);

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

  const mapCsvPayload = (csvText: string): { headers: string[]; rows: DatasetRow[] } => {
    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) return { headers: DEFAULT_HEADERS, rows: [] };

    const csvHeaders = parseCsvLine(lines[0]);
    const headers = ["row_number", ...csvHeaders];

    const rows = lines.slice(1).map((line, rowIndex) => {
      const values = parseCsvLine(line);
      const mappedValues: Record<string, string> = {
        row_number: String(rowIndex + 1),
      };

      csvHeaders.forEach((header, index) => {
        mappedValues[header] = values[index] ?? "";
      });

      return {
        id: `row-${rowIndex + 1}`,
        backendRowIndex: rowIndex,
        values: mappedValues,
      };
    });

    return { headers, rows };
  };

  const parsePossibleJsonRows = (text: string): BackendProcessedRow[] | null => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const tryParse = (candidate: string): any | null => {
      try {
        return JSON.parse(candidate);
      } catch {
        return null;
      }
    };

    // 1) Valid JSON array/object
    const direct = tryParse(trimmed);
    if (direct) {
      if (Array.isArray(direct)) return direct as BackendProcessedRow[];
      if (typeof direct === "object") return [direct as BackendProcessedRow];
    }

    // 2) NDJSON (one JSON object per line)
    const lines = trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length > 1 && lines.every((line) => line.startsWith("{") && line.endsWith("}"))) {
      const parsedLines = lines
        .map((line) => tryParse(line))
        .filter(Boolean) as BackendProcessedRow[];
      if (parsedLines.length > 0) return parsedLines;
    }

    // 3) Concatenated objects: }{ or }\n{
    const splitBlocks = trimmed
      .split(/\}\s*\{/g)
      .map((block, index, arr) => {
        if (arr.length === 1) return block;
        if (index === 0) return `${block}}`;
        if (index === arr.length - 1) return `{${block}`;
        return `{${block}}`;
      })
      .map((block) => block.trim())
      .filter((block) => block.startsWith("{") && block.endsWith("}"));

    if (splitBlocks.length > 0) {
      const parsedBlocks = splitBlocks
        .map((block) => tryParse(block))
        .filter(Boolean) as BackendProcessedRow[];
      if (parsedBlocks.length > 0) return parsedBlocks;
    }

    return null;
  };

  const mapJsonPayload = (payload: unknown): { headers: string[]; rows: DatasetRow[] } => {
    const rawRows: BackendProcessedRow[] =
      (Array.isArray(payload) && payload) ||
      ((payload as any)?.row_number !== undefined &&
      typeof (payload as any)?.data === "object"
        ? [payload as BackendProcessedRow]
        : []) ||
      (Array.isArray((payload as any)?.results) && (payload as any).results) ||
      (Array.isArray((payload as any)?.data) && (payload as any).data) ||
      (Array.isArray((payload as any)?.data?.results) && (payload as any).data.results) ||
      [];

    if (rawRows.length === 0) {
      return { headers: DEFAULT_HEADERS, rows: [] };
    }

    const dataHeadersSet = new Set<string>();
    rawRows.forEach((row) => {
      Object.keys(row.data || {}).forEach((key) => dataHeadersSet.add(key));
    });

    const dataHeaders = Array.from(dataHeadersSet);
    const headers = ["row_number", ...dataHeaders];

    const rows: DatasetRow[] = rawRows.map((row, index) => {
      const values: Record<string, string> = {
        row_number: String(row.row_number ?? index + 1),
      };

      dataHeaders.forEach((header) => {
        const value = row.data?.[header];
        values[header] = value === null || value === undefined ? "" : String(value);
      });

      const issueMap: Record<string, CellIssue> = {};
      const seenIssueKeys = new Set<string>();

      (row.issues || []).forEach((issue) => {
        const column = issue.column || "row_number";
        const dedupeKey = `${column}::${issue.type || ""}::${issue.message || ""}`;
        if (seenIssueKeys.has(dedupeKey)) return;
        seenIssueKeys.add(dedupeKey);

        issueMap[column] = {
          type: normalizeIssueType(issue.type),
          message: issue.message || "Data quality issue detected.",
        };
      });

      let issueType: DatasetRow["issueType"];
      const issueValues = Object.values(issueMap);
      if ((row.duplicates || []).length > 0 || issueValues.some((issue) => issue.type === "duplicate")) {
        issueType = "duplicate";
      } else if ((row.issues || []).length > 0 || row.is_rejected) {
        issueType = "error";
      }

      return {
        id: String(row.row_number ?? `row-${index + 1}`),
        backendRowIndex: index,
        values,
        issueType,
        cellIssues: issueMap,
      };
    });

    return { headers, rows };
  };

  const mapProcessedRows = (payload: unknown): { headers: string[]; rows: DatasetRow[] } => {
    if (typeof payload === "string") {
      if (looksLikeJsonText(payload)) {
        const parsedRows = parsePossibleJsonRows(payload);
        if (parsedRows && parsedRows.length > 0) {
          return mapJsonPayload(parsedRows);
        }
      }
      return mapCsvPayload(payload);
    }
    return mapJsonPayload(payload);
  };

  const filteredRows = useMemo(() => {
    const query = datasetSearchValue.trim().toLowerCase();

    const matchesSearch = (row: DatasetRow) => {
      if (!query) return true;
      return Object.values(row.values).some((value) =>
        String(value).toLowerCase().includes(query)
      );
    };

    const matchesFilter = (row: DatasetRow) => {
      if (datasetFilterValue === "all") return true;
      if (datasetFilterValue === "error" || datasetFilterValue === "duplicate") {
        return row.issueType === datasetFilterValue;
      }
      const issueTypes = Object.values(row.cellIssues || {}).map((issue) => issue.type);
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
      mappedRows[row.id] = {
        ...row,
        values: { ...row.values },
      };
    });

    setTimeout(() => {
      setEditedRows(mappedRows);
      setIsEditingDataset(true);
      setIsPreparingEditor(false);
    }, 350);
  };

  const validateEditedDataset = () => {
    const rows = Object.values(editedRows);
    const invalidRows = rows.filter((row) => {
      const issueColumns = Object.keys(row.cellIssues || {});
      return issueColumns.some((column) => !String(row.values[column] || "").trim());
    });

    return {
      totalRows: rows.length,
      invalidRows: invalidRows.length,
      isValid: invalidRows.length === 0,
    };
  };

  const handleSaveDatasetWithLoading = async () => {
    if (!isEditingDataset || isSavingDataset) return;
    setIsSavingDataset(true);
    setSaveStatus("saving");

    const validation = validateEditedDataset();
    if (!validation.isValid) {
      toast.error(
        `Cannot save. ${validation.invalidRows} row(s) still have unresolved issue values.`
      );
      setSaveStatus("error");
      setIsSavingDataset(false);
      return;
    }

    try {
      const changedRows = tableRows.filter((originalRow) => {
        const editedRow = editedRows[originalRow.id];
        if (!editedRow) return false;
        return tableHeaders.some(
          (header) => (editedRow.values[header] ?? "") !== (originalRow.values[header] ?? "")
        );
      });

      for (const row of changedRows) {
        const editedRow = editedRows[row.id];
        if (!editedRow) continue;

        const rowIndex =
          typeof editedRow.backendRowIndex === "number"
            ? editedRow.backendRowIndex
            : typeof row.backendRowIndex === "number"
            ? row.backendRowIndex
            : Math.max(0, tableRows.findIndex((item) => item.id === row.id));

        const dataPayload = tableHeaders.reduce<Record<string, string>>((acc, header) => {
          if (header === "row_number") return acc;
          acc[header] = String(editedRow.values[header] ?? "");
          return acc;
        }, {});

        const payload: EditDatasetRowPayload = {
          row_index: rowIndex,
          data: dataPayload,
        };

        await editDatasetRow({ datasetId, payload });
      }

      setTableRows(Object.values(editedRows));
      setIsEditingDataset(false);
      await refetchProcessedData();
      toast.success(
        changedRows.length > 0
          ? `${changedRows.length} row(s) updated successfully.`
          : "No row changes detected."
      );
      setSaveStatus("success");
      setLastSavedAt(new Date());
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSavingDataset(false);
    }
  };

  const handleExportDataset = () => {
    if (isExportingDataset) return;
    setIsExportingDataset(true);

    setTimeout(() => {
      const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
      const csvRows = [
        tableHeaders.join(","),
        ...tableRows.map((row) =>
          tableHeaders
            .map((header) => escapeCsv(String(row.values[header] ?? "")))
            .join(",")
        ),
      ];

      const blob = new Blob([csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
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

  const handleCellChange = (rowId: string, column: string, value: string) => {
    setEditedRows((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        values: {
          ...prev[rowId].values,
          [column]: value,
        },
      },
    }));
  };

  const handleCancelAppend = () => {
    setAppendModalOpen(false);
    setAppendFile(null);
    setAppendFileError("");
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
    setTableHeaders(mapped.headers.length > 0 ? mapped.headers : DEFAULT_HEADERS);
    setTableRows(mapped.rows);
  }, [isEditingDataset, processedData]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search rows"
              value={datasetSearchValue}
              onChange={(event) => {
                setDatasetSearchValue(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm"
            />
          </div>
          <div className="relative w-full md:w-48">
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
                {tableHeaders.map((header, index) => (
                  <th
                    key={`${header}-${index}`}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {prettifyHeader(header)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingProcessedData ? (
                <tr>
                  <td colSpan={Math.max(1, tableHeaders.length)} className="px-6 py-10 text-center text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading dataset rows...
                    </span>
                  </td>
                </tr>
              ) : pagedRows.length > 0 ? (
                pagedRows.map((row) => (
                  <tr key={row.id}>
                    {tableHeaders.map((header, colIndex) => {
                      const issue = row.cellIssues?.[header] || row.cellIssues?.[normalizeKey(header)];
                      const isIssueCell = !!issue;
                      const isDuplicateCell = issue?.type === "duplicate";
                      const cellValue =
                        isEditingDataset && editedRows[row.id]
                          ? editedRows[row.id].values[header] ?? ""
                          : row.values[header] ?? "";

                      return (
                        <td
                          key={`${row.id}-${header}-${colIndex}`}
                          className={cn(
                            "px-6 py-4 text-sm text-gray-900 align-middle",
                            isIssueCell && !isDuplicateCell && "bg-[#FCE8E8]",
                            isDuplicateCell && "bg-[#ECE8F5]"
                          )}
                        >
                          {isEditingDataset && isIssueCell ? (
                            <input
                              type="text"
                              value={cellValue}
                              onChange={(event) =>
                                handleCellChange(row.id, header, event.target.value)
                              }
                              className="w-full rounded-md border border-green-500 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              {issueIcon(issue?.type)}
                              {showOnlyIssueCells && !issue ? (
                                <span className="text-gray-300">--</span>
                              ) : (
                                <span
                                  className="block truncate max-w-[320px]"
                                  title={issue?.message || ""}
                                >
                                  {cellValue || "--"}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
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
