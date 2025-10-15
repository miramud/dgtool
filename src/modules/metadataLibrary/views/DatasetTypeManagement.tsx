"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
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
import CreateDatasetTypeModal from "../components/CreateDatasetTypeModal";
import {
  useGetDatasetTypes,
  useDeleteDatasetType,
  DatasetTypeFilters,
} from "../controllers/datasetTypeController";
import { useQueryClient } from "@tanstack/react-query";

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
  const [selectedDatasetType, setSelectedDatasetType] =
    useState<DatasetType | null>(null);
  const [selectedDatasetTypes, setSelectedDatasetTypes] = useState<
    DatasetType[]
  >([]);
  const [selectedDatasetTypeForEdit, setSelectedDatasetTypeForEdit] =
    useState<DatasetType | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);
  const queryClient = useQueryClient();

  console.log({ selectedDatasetTypes });

  // API query for dataset types
  const filters: DatasetTypeFilters = useMemo(
    () => ({
      search: debouncedSearchValue || undefined,
      page: currentPage,
      page_size: 15,
      is_archived: false, // Only show non-archived items
    }),
    [debouncedSearchValue, currentPage]
  );

  const {
    data: datasetTypesResponse,
    isLoading,
    error,

    isFetching,
  } = useGetDatasetTypes(filters);

  const {
    deleteDatasetType,
    isSuccess: deleteSuccess,
    isLoading: isDeleting,
  } = useDeleteDatasetType(selectedDatasetType?.id || "");

  // Handle successful deletion
  useEffect(() => {
    if (deleteSuccess) {
      setDeleteModalOpen(false);
      setSelectedDatasetType(null);
    }
  }, [deleteSuccess]);

  // Handle dataset type creation/update success
  const handleDatasetTypeSuccess = () => {
    // setSelectedDatasetTypeForEdit(null);
    // Invalidate and refetch data
    queryClient.invalidateQueries({ queryKey: ["dataset-types"] });
  };

  // Get dataset types from API response
  const datasetTypes = datasetTypesResponse?.data?.results || [];
  const totalItems = datasetTypesResponse?.data?.paginator?.count || 0;
  const totalPages = datasetTypesResponse?.data?.paginator?.total_pages || 1;

  // Table columns configuration
  const columns = [
    { key: "name", header: "Dataset Type Name", width: "25%" },
    { key: "description", header: "Description", width: "35%" },
    { key: "created_by", header: "Created By", width: "15%" },
    { key: "updated_datetime", header: "Last Modified", width: "15%" },
    { key: "is_archived", header: "Status", width: "10%" },
  ];

  // Format table cell data
  const getFormattedValue = (datasetType: DatasetType, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <span className='text-gray-900'>{datasetType.name}</span>;

      case "description":
        return <span className='text-gray-900'>{datasetType.description}</span>;

      case "created_by":
        return (
          <span className='text-gray-900'>
            {`${datasetType.created_by.first_name} ${datasetType.created_by.last_name}`}
          </span>
        );

      case "updated_datetime":
        return (
          <span className='text-gray-900'>
            {new Date(datasetType.updated_datetime).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </span>
        );

      case "is_archived":
        return (
          <div className='flex items-center gap-2'>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                !datasetType.is_archived && !datasetType.is_deleted
                  ? "bg-green-400"
                  : "bg-red-400"
              )}
            ></div>
            <StatusBadge
              status={
                !datasetType.is_archived && !datasetType.is_deleted
                  ? "Active"
                  : "Inactive"
              }
              variant='status'
            />
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

  // // Handle bulk actions
  // const handleBulkDelete = () => {
  //   console.log("Bulk delete:", selectedDatasetTypes);
  //   // TODO: Implement bulk delete logic when API supports it
  // };

  // Handle individual delete
  const handleDelete = async () => {
    if (!selectedDatasetType?.id) return;

    try {
      await deleteDatasetType();
    } catch (error) {
      console.error("Failed to delete dataset type:", error);
    }
  };

  // Pagination info
  const itemsPerPage = 15;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // console.log({ isFetching, isLoading, selectedDatasetTypeForEdit });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Dataset Types</h1>
          <p className='text-gray-600 mt-2'>
            Manage and organize different types of datasets in your data
            catalog. Define dataset categories to standardize data
            classification.
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
        {/* {selectedDatasetTypes.length > 0 && (
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
        )} */}
      </div>

      {/* Advanced Table */}
      {error ? (
        <div className='flex items-center justify-center py-8'>
          <div className='text-red-500'>
            Failed to load dataset types. Please try again.
          </div>
        </div>
      ) : (
        <div className='relative'>
          {isFetching && !isLoading && (
            <div className='absolute inset-0 bg-white/80 flex items-center justify-center py-2 z-10'>
              <div className='text-sm text-gray-500'>Refreshing...</div>
            </div>
          )}
          <AdvancedTable
            data={datasetTypes}
            columns={columns}
            showCheckBox={true}
            options={tableOptions}
            getFormattedValue={getFormattedValue}
            onRowSelect={setSelectedDatasetTypes}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && (
        <div className='flex items-center justify-between'>
          <p className='text-sm text-gray-700'>
            {totalItems > 0
              ? `${startItem} - ${endItem} of ${totalItems} dataset types`
              : "No dataset types found"}
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
      )}

      {/* Create/Edit Dataset Type Modal */}
      <CreateDatasetTypeModal
        open={createModalOpen || editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setEditModalOpen(false);
            // setSelectedDatasetTypeForEdit(null);
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
              <strong>{selectedDatasetType?.name}</strong>? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
