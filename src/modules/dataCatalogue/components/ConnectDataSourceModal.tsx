"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MultiStepDialog from "@/components/shared/MultiStepDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { axiosCallerWithToken } from "@/lib/helpers";
import { DATA_CATALOGUE_API_ROUTES } from "@/constants/dataCatalogue-api-routes";

type DataSourceType = "postgresql" | "mysql";
type SslMode =
  | "disable"
  | "allow"
  | "prefer"
  | "require"
  | "verify-ca"
  | "verify-full";

interface DbConnectionPayload {
  host: string;
  port: number;
  username: string;
  password: string;
  database_name: string;
  schema: string;
  db_type: DataSourceType;
  ssl_mode: SslMode;
}

interface ConnectDataSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected: (selection: ConnectedSourceSelection) => void;
}

export interface ConnectedSourceSelection {
  sourceLabel: string;
  assetName: string;
  db_connection_info: DbConnectionPayload & {
    table_name: string;
  };
}

const DATA_SOURCE_OPTIONS: Array<{ value: DataSourceType; label: string }> = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
];

const SSL_MODE_OPTIONS: SslMode[] = [
  "disable",
  "allow",
  "prefer",
  "require",
  "verify-ca",
  "verify-full",
];

const DEFAULT_FIELDS: DbConnectionPayload = {
  host: "",
  port: 5432,
  username: "",
  password: "",
  database_name: "",
  schema: "public",
  ssl_mode: "prefer",
  db_type: "postgresql",
};

export default function ConnectDataSourceModal({
  open,
  onOpenChange,
  onConnected,
}: ConnectDataSourceModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [connectionFields, setConnectionFields] =
    useState<DbConnectionPayload>(DEFAULT_FIELDS);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isConnectionValidated, setIsConnectionValidated] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [connectionError, setConnectionError] = useState("");

  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [tablesError, setTablesError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState("");

  const resetState = () => {
    setCurrentStep(0);
    setConnectionFields(DEFAULT_FIELDS);
    setIsTestingConnection(false);
    setIsConnectionValidated(false);
    setConnectionMessage("");
    setConnectionError("");
    setIsLoadingTables(false);
    setTablesError("");
    setSearchValue("");
    setAvailableTables([]);
    setSelectedTable("");
  };

  const baseFieldsValid =
    !!connectionFields.host.trim() &&
    connectionFields.port > 0 &&
    !!connectionFields.username.trim() &&
    !!connectionFields.password.trim() &&
    !!connectionFields.database_name.trim() &&
    !!connectionFields.schema.trim();

  const setField = <K extends keyof DbConnectionPayload>(
    key: K,
    value: DbConnectionPayload[K]
  ) => {
    setConnectionFields((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Any change invalidates previous connection test and table cache
    setIsConnectionValidated(false);
    setConnectionMessage("");
    setConnectionError("");
    setAvailableTables([]);
    setSelectedTable("");
    setTablesError("");
  };

  const testConnection = async () => {
    if (!baseFieldsValid || isTestingConnection) return;

    setIsTestingConnection(true);
    setConnectionError("");
    setConnectionMessage("");

    try {
      const response = await axiosCallerWithToken.post(
        DATA_CATALOGUE_API_ROUTES.DATASET_DB_VALIDATE,
        connectionFields
      );

      const isSuccess =
        response?.data?.status === true || response?.data?.data?.status === true;

      if (isSuccess) {
        setIsConnectionValidated(true);
        setConnectionMessage(
          response?.data?.message || "Connection successful. Continue to select a table."
        );
      } else {
        setIsConnectionValidated(false);
        setConnectionError(
          response?.data?.message || "Connection failed. Please verify your details."
        );
      }
    } catch (error: any) {
      setIsConnectionValidated(false);
      setConnectionError(
        error?.response?.data?.message || "Connection failed. Please verify your details."
      );
    } finally {
      setIsTestingConnection(false);
    }
  };

  const fetchTables = async () => {
    if (!isConnectionValidated || isLoadingTables) return;

    setIsLoadingTables(true);
    setTablesError("");

    try {
      const response = await axiosCallerWithToken.post(
        DATA_CATALOGUE_API_ROUTES.DATASET_DB_TABLES,
        connectionFields
      );

      const tables =
        response?.data?.data?.tables ||
        response?.data?.tables ||
        [];

      if (Array.isArray(tables)) {
        setAvailableTables(tables);
      } else {
        setAvailableTables([]);
      }
    } catch (error: any) {
      setAvailableTables([]);
      setTablesError(
        error?.response?.data?.message || "Unable to fetch tables from this connection."
      );
    } finally {
      setIsLoadingTables(false);
    }
  };

  const handleStepChange = async (step: number) => {
    setCurrentStep(step);
    if (step === 1 && availableTables.length === 0) {
      await fetchTables();
    }
  };

  const handleConnect = () => {
    if (!selectedTable) return;

    const selectedSource = DATA_SOURCE_OPTIONS.find(
      (option) => option.value === connectionFields.db_type
    );

    onConnected({
      sourceLabel: selectedSource?.label ?? "Unknown Source",
      assetName: selectedTable,
      db_connection_info: {
        ...connectionFields,
        table_name: selectedTable,
      },
    });

    resetState();
    onOpenChange(false);
  };

  const filteredTables = availableTables.filter((tableName) =>
    tableName.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <MultiStepDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetState();
        onOpenChange(nextOpen);
      }}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      steps={[
        {
          id: "connection-fields",
          title: "Connection Fields",
          isValid: isConnectionValidated,
          content: (
            <div>
              <h2 className='text-xl font-semibold mb-6'>Connection Fields</h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    Data Source
                  </label>
                  <Select
                    value={connectionFields.db_type}
                    onValueChange={(value) => setField("db_type", value as DataSourceType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select data source' />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_SOURCE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-900 mb-2'>
                      Host
                    </label>
                    <Input
                      placeholder='Enter host'
                      value={connectionFields.host}
                      onChange={(event) => setField("host", event.target.value)}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-900 mb-2'>
                      Port
                    </label>
                    <Input
                      type='number'
                      placeholder='Enter port'
                      value={connectionFields.port}
                      onChange={(event) => setField("port", Number(event.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-900 mb-2'>
                      Database Name
                    </label>
                    <Input
                      placeholder='Enter database name'
                      value={connectionFields.database_name}
                      onChange={(event) =>
                        setField("database_name", event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-900 mb-2'>
                      Username
                    </label>
                    <Input
                      placeholder='Enter username'
                      value={connectionFields.username}
                      onChange={(event) => setField("username", event.target.value)}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-900 mb-2'>
                      Password
                    </label>
                    <Input
                      type='password'
                      placeholder='Enter password'
                      value={connectionFields.password}
                      onChange={(event) => setField("password", event.target.value)}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-900 mb-2'>
                      Schema
                    </label>
                    <Input
                      placeholder='Enter schema'
                      value={connectionFields.schema}
                      onChange={(event) => setField("schema", event.target.value)}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-900 mb-2'>
                      SSL Mode
                    </label>
                    <Select
                      value={connectionFields.ssl_mode}
                      onValueChange={(value) => setField("ssl_mode", value as SslMode)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select SSL mode' />
                      </SelectTrigger>
                      <SelectContent>
                        {SSL_MODE_OPTIONS.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                  <div className='flex items-center gap-3'>
                    <Button
                      type='button'
                      onClick={testConnection}
                      disabled={!baseFieldsValid || isTestingConnection}
                      className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
                    >
                      {isTestingConnection ? (
                        <span className='inline-flex items-center gap-2'>
                          <Loader2 className='h-4 w-4 animate-spin' />
                          Testing...
                        </span>
                      ) : (
                        "Test Connection"
                      )}
                    </Button>

                    {isConnectionValidated && (
                      <span className='text-sm font-medium text-green-700'>
                        Connection successful
                      </span>
                    )}
                  </div>

                  {connectionMessage && (
                    <p className='text-sm text-green-700 mt-3'>{connectionMessage}</p>
                  )}

                  {connectionError && (
                    <p className='text-sm text-red-600 mt-3'>{connectionError}</p>
                  )}
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "select-table",
          title: "Select Table",
          isValid: !!selectedTable,
          content: (
            <div>
              <h2 className='text-xl font-semibold mb-4'>Select Table</h2>

              <div className='relative mb-4'>
                <Search className='w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
                <Input
                  className='pl-9'
                  placeholder='Search tables'
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </div>

              <div className='border border-gray-200 rounded-lg overflow-hidden'>
                <div className='px-4 py-3 bg-gray-100 text-sm font-medium text-gray-900'>
                  Table Name
                </div>

                {isLoadingTables ? (
                  <div className='px-4 py-8 text-sm text-gray-600 flex items-center gap-2'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Loading tables...
                  </div>
                ) : (
                  <div className='divide-y divide-gray-200 max-h-80 overflow-y-auto'>
                    {filteredTables.map((tableName) => (
                      <button
                        key={tableName}
                        type='button'
                        onClick={() => setSelectedTable(tableName)}
                        className='w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50'
                      >
                        <Checkbox checked={selectedTable === tableName} />
                        <span className='text-sm text-gray-900'>{tableName}</span>
                      </button>
                    ))}

                    {!isLoadingTables && filteredTables.length === 0 && (
                      <div className='px-4 py-8 text-gray-500 text-sm text-center'>
                        {tablesError || "No tables found for this connection."}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ),
        },
      ]}
      onComplete={handleConnect}
      finalButtonLabel='Connect'
    />
  );
}
