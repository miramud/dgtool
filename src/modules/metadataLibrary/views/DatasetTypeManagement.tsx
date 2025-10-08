"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search } from "lucide-react";
import AdvancedTable from "../../../components/shared/AdvancedTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { DatasetType } from "../types/datasetType";
import { mockDatasetTypes } from "../data/mockDatasetTypes";
import CreateDatasetTypeModal from "../components/CreateDatasetTypeModal";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface DatasetTypeManagementProps {
  className?: string;
}

export default function DatasetTypeManagement({
  className,
}: DatasetTypeManagementProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDatasetType, setSelectedDatasetType] = useState<DatasetType | null>(null);
  const [selectedDatasetTypes, setSelectedDatasetTypes] = useState<DatasetType[]>([]);
  const [selectedDatasetTypeForEdit, setSelectedDatasetTypeForEdit] = useState<DatasetType | null>(
    null
  );
  const [searchValue, setSearchValue] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [datasetTypes, setDatasetTypes] = useState<DatasetType[]>(mockDatasetTypes);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load initial data if needed
      } catch (error) {
        console.error("Failed to load dataset types:", error);
      }
    };

    loadData();
  }, []);

  // Handle dataset type creation success
  const handleDatasetTypeSuccess = (datasetType: DatasetType) => {
    if (selectedDatasetTypeForEdit) {
      // Edit mode
      setDatasetTypes(prev => prev.map(dt => dt.id === datasetType.id ? datasetType : dt));
    } else {
      // Create mode
      setDatasetTypes(prev => [...prev, datasetType]);
    }
    setSelectedDatasetTypeForEdit(null);
  };

  // Filter dataset types based on search
  const filteredDatasetTypes = useMemo(() => {
    let filteredResults = [...datasetTypes];

    // Apply search filter
    if (debouncedSearchValue) {
      filteredResults = filteredResults.filter(
        (datasetType) =>
          datasetType.name
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          datasetType.description
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          datasetType.createdBy
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase())
      );
    }

    return filteredResults;
  }, [debouncedSearchValue, datasetTypes]);

  // Table columns configuration
  const columns = [
    { key: "name", header: "Dataset Type Name", width: "25%" },
    { key: "description", header: "Description", width: "35%" },
    { key: "createdBy", header: "Created By", width: "15%" },
    { key: "lastModified", header: "Last Modified", width: "15%" },
    { key: "status", header: "Status", width: "10%" },
  ];

  // Format table cell data
  const getFormattedValue = (datasetType: DatasetType, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <span className='text-gray-900'>{datasetType.name}</span>;

      case "description":
        return (
          <span className='text-gray-900'>
            {datasetType.description}
          </span>
        );

      case "createdBy":
        return (
          <span className='text-gray-900'>{datasetType.createdBy}</span>
        );

      case "lastModified":
        return (
          <span className='text-gray-900'>{datasetType.lastModified}</span>
        );

      case "status":
        return (
          <div className='flex items-center gap-2'>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                datasetType.status === "active"
                  ? "bg-green-400"
                  : datasetType.status === "inactive"
                  ? "bg-red-400"
                  : "bg-yellow-400"
              )}
            ></div>
            <StatusBadge status={datasetType.status === "active" ? "Active" : "Inactive"} variant='status' />
          </div>
        );
      default:
        return null;
    }
  };

  // Table action options
  const tableOptions = [
    {
      label: "Edit Dataset Type",
      action: (datasetType: DatasetType) => {
        setSelectedDatasetTypeForEdit(datasetType);
        setEditModalOpen(true);
      },
    },
    {
      label: "Delete Dataset Type",
      action: (datasetType: DatasetType) => {
        setSelectedDatasetType(datasetType);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Handle bulk actions
  const handleBulkDelete = () => {
    console.log("Bulk delete:", selectedDatasetTypes);
    // Implement bulk delete logic
  };

  // Handle individual delete
  const handleDelete = async () => {
    if (!selectedDatasetType?.id) return;

    try {
      setDatasetTypes(prev => prev.filter(dt => dt.id !== selectedDatasetType.id));
      setDeleteModalOpen(false);
      setSelectedDatasetType(null);
    } catch (error) {
      console.error("Failed to delete dataset type:", error);
    }
  };

  // Pagination info
  const startItem = (currentPage - 1) * 15 + 1;
  const endItem = Math.min(currentPage * 15, filteredDatasetTypes.length);
  const totalPages = Math.ceil(filteredDatasetTypes.length / 15);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Dataset Types
          </h1>
          <p className='text-gray-600 mt-2'>
            Manage and organize different types of datasets in your data catalog.
            Define dataset categories to standardize data classification.
          </p>
        </div>
        <Button
          className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className='w-4 h-4 mr-2' />
          Create Dataset Type
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className='flex items-center space-x-4'>
        {/* Search Field */}
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Search dataset types'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm'
          />
        </div>

        {/* Bulk Actions */}
        {selectedDatasetTypes.length > 0 && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>
              {selectedDatasetTypes.length} selected
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={handleBulkDelete}
              className='text-red-600 hover:text-red-700'
            >
              <Trash2 className='w-4 h-4 mr-1' />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Table */}
      <AdvancedTable
        data={filteredDatasetTypes}
        columns={columns}
        showCheckBox={true}
        options={tableOptions}
        getFormattedValue={getFormattedValue}
        onRowSelect={setSelectedDatasetTypes}
      />

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-700'>
          {startItem} - {endItem} of {filteredDatasetTypes.length} dataset types
        </p>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className='text-sm'>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create/Edit Dataset Type Modal */}
      <CreateDatasetTypeModal
        open={createModalOpen || editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setEditModalOpen(false);
            setSelectedDatasetTypeForEdit(null);
          }
        }}
        datasetType={selectedDatasetTypeForEdit || undefined}
        onSuccess={handleDatasetTypeSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dataset Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedDatasetType?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}