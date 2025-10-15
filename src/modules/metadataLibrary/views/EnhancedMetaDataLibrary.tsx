"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  MetadataTemplate,
  MetadataTemplateFilters,
} from "../types/metadataTemplate";
import CreateMetadataTemplateModal from "../components/CreateMetadataTemplateModal";
import {
  useGetMetadataTemplates,
  useDeleteMetadataTemplate,
  useActivateMetadataTemplate,
  useDeactivateMetadataTemplate,
} from "../controllers/metadataTemplateController";
import { formatDate } from "@/utils/dateFormatter";

// Custom hook for debounced search (mimicking the performance dialog pattern)
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

interface EnhancedMetaDataLibraryProps {
  className?: string;
}

export default function EnhancedMetaDataLibrary({
  className,
}: EnhancedMetaDataLibraryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<MetadataTemplate | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<
    MetadataTemplate[]
  >([]);
  const [selectedTemplateForEdit, setSelectedTemplateForEdit] =
    useState<MetadataTemplate | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  // API hooks
  const filters: MetadataTemplateFilters = useMemo(
    () => ({
      search: debouncedSearchValue || undefined,
      page: currentPage,
      limit: 15,
    }),
    [debouncedSearchValue, currentPage]
  );

  const {
    data: templatesData,
    isLoading,
    error,
    isFetching,
  } = useGetMetadataTemplates(filters);
  const deleteTemplateMutation = useDeleteMetadataTemplate(
    selectedTemplate?.id || ""
  );
  const activateTemplateMutation = useActivateMetadataTemplate(
    selectedTemplate?.id || ""
  );
  const deactivateTemplateMutation = useDeactivateMetadataTemplate(
    selectedTemplate?.id || ""
  );

  // Handle template creation success
  const handleTemplateSuccess = useCallback(() => {
    setSelectedTemplateForEdit(null);
    // The API will automatically refetch data due to query invalidation
  }, []);

  // Handle modal open/close
  const handleModalOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setCreateModalOpen(false);
      setEditModalOpen(false);
      setSelectedTemplateForEdit(null);
    }
  }, []);

  // console.log({ templatesData });

  // Get the templates array from API response
  const templates = templatesData?.data?.results || [];
  const totalTemplates = templatesData?.data?.paginator?.count || 0;
  const totalPages = templatesData?.data?.paginator?.total_pages || 1;

  // Table columns configuration
  const columns = [
    { key: "name", header: "Template Name", width: "20%" },
    { key: "category", header: "Category", width: "15%" },
    { key: "fieldsNumber", header: "Fields Number", width: "10%" },
    { key: "createdBy", header: "Created By", width: "15%" },
    { key: "lastModified", header: "Last Modified", width: "20%" },
    { key: "status", header: "Status", width: "15%" },
  ];

  // Format table cell data
  const getFormattedValue = (template: MetadataTemplate, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div>
            <div className='font-medium text-gray-900'>{template.name}</div>
          </div>
        );

      case "category":
        return (
          <span className='text-gray-900'>
            {template.category || template.dataset_type.name || "Uncategorized"}
          </span>
        );

      case "fieldsNumber":
        return (
          <span className='text-gray-900'>
            {template.fields_count || template.fields?.length || 0}
          </span>
        );

      case "createdBy":
        return (
          <span className='text-gray-900'>
            {template.created_by?.first_name || "Unknown"}{" "}
            {template.created_by?.last_name || "Unknown"}
          </span>
        );

      case "lastModified":
        const lastModified = formatDate(template.updated_datetime) || "Unknown";
        return <span className='text-gray-900'>{lastModified}</span>;

      case "status":
        const isActive =
          template.is_active !== undefined
            ? template.is_active
            : template.status === "active";
        return (
          <div className='flex items-center gap-2'>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-green-400" : "bg-red-400"
              )}
            ></div>
            <StatusBadge
              status={isActive ? "Active" : "Inactive"}
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
      label: "Edit Template",
      action: (template: MetadataTemplate) => {
        setSelectedTemplateForEdit(template);
        setEditModalOpen(true);
      },
    },
    {
      label: (template: MetadataTemplate) => {
        const isActive =
          template.is_active !== undefined
            ? template.is_active
            : template.status === "active";
        return isActive ? "Deactivate" : "Activate";
      },
      action: async (template: MetadataTemplate) => {
        const isActive =
          template.is_active !== undefined
            ? template.is_active
            : template.status === "active";
        setSelectedTemplate(template);
        if (isActive) {
          await deactivateTemplateMutation.deactivateTemplate();
        } else {
          await activateTemplateMutation.activateTemplate();
        }
        setSelectedTemplate(null);
      },
    },
    {
      label: "Delete Template",
      action: (template: MetadataTemplate) => {
        setSelectedTemplate(template);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Handle bulk actions
  const handleBulkDelete = () => {
    // console.log("Bulk delete:", selectedTemplates);
    // Implement bulk delete logic
  };

  // Handle individual delete
  const handleDelete = async () => {
    if (!selectedTemplate?.id) return;

    try {
      await deleteTemplateMutation.deleteTemplate();
      setDeleteModalOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  // Pagination info
  const startItem = (currentPage - 1) * 15 + 1;
  const endItem = Math.min(currentPage * 15, totalTemplates);
  // const itemsPerPage = 15;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {" "}
            Metadata Library
          </h1>
          <p className='text-gray-600 mt-2'>
            Standardize metadata fields across all dataset types. Create
            templates so every dataset follows the same governance rules.
          </p>
        </div>
        <Button
          className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className='w-4 h-4 mr-2' />
          Create Metadata Template
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className='flex items-center space-x-4'>
        {/* Search Field */}
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Search by business terms or asset name'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm'
          />
        </div>

        {/* Bulk Actions */}
        {selectedTemplates.length > 0 && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>
              {selectedTemplates.length} selected
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
            data={templates}
            columns={columns}
            showCheckBox={true}
            options={tableOptions}
            getFormattedValue={getFormattedValue}
            onRowSelect={setSelectedTemplates}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-700'>
          {startItem} - {endItem} of {totalTemplates} templates
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

      {/* Create/Edit Template Modal */}
      {(createModalOpen || editModalOpen) && (
        <CreateMetadataTemplateModal
          open={createModalOpen || editModalOpen}
          onOpenChange={handleModalOpenChange}
          template={selectedTemplateForEdit || undefined}
          onSuccess={handleTemplateSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedTemplate?.name}</strong>? This action cannot be
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
