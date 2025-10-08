"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search } from "lucide-react";
import AdvancedTable from "../../../components/shared/AdvancedTable";
import StatusBadge from "../../../components/shared/StatusBadge";
// import CreateRoleModal from "./CreateRoleModal";
// import { User } from "../types/user";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { MetadataTemplate } from "../types/metadataTemplate";
import { mockMetadataTemplates } from "../data/mockMetadataTemplates";
import CreateMetadataTemplateModal from "../components/CreateMetadataTemplateModal";
// import { mockRoles } from "../data/mockRoles";
// import { Role } from "../types/roles";
// import { useGetRoles, useDeleteRole } from "../controllers/rolesController";

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
  const [selectedTemplate, setSelectedTemplate] = useState<MetadataTemplate | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<MetadataTemplate[]>([]);
  const [selectedTemplateForEdit, setSelectedTemplateForEdit] = useState<MetadataTemplate | null>(
    null
  );
  const [searchValue, setSearchValue] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [templates, setTemplates] = useState<MetadataTemplate[]>(mockMetadataTemplates);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  // API hooks
  //   const {
  //     getRoles,
  //     data: rolesData,
  //     isLoading: isLoadingRoles,
  //   } = useGetRoles();

  //   const { deleteRole } = useDeleteRole(selectedUser?.id || "");

  // Load roles and permissions on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load initial data if needed
      } catch (error) {
        console.error("Failed to load templates:", error);
      }
    };

    loadData();
  }, []);

  // Update roles when API data changes
  // Handle template creation success
  const handleTemplateSuccess = (template: MetadataTemplate) => {
    if (selectedTemplateForEdit) {
      // Edit mode
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      // Create mode
      setTemplates(prev => [...prev, template]);
    }
    setSelectedTemplateForEdit(null);
  };

  // Filter templates based on search
  const filteredTemplates = useMemo(() => {
    let filteredResults = [...templates];

    // Apply search filter
    if (debouncedSearchValue) {
      filteredResults = filteredResults.filter(
        (template) =>
          template.name
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          template.datasetType
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          template.createdBy
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase())
      );
    }

    return filteredResults;
  }, [debouncedSearchValue, templates]);

  // Table columns configuration
  const columns = [
    { key: "name", header: "Template Name", width: "20%" },
    { key: "datasetType", header: "Dataset Type", width: "15%" },
    { key: "fieldsNumber", header: "Fields Number", width: "10%" },
    { key: "createdBy", header: "Created By", width: "15%" },
    { key: "lastModified", header: "Last Modified", width: "20%" },
    { key: "status", header: "Status", width: "15%" },
  ];

  // Format table cell data
  const getFormattedValue = (template: MetadataTemplate, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <span className='text-gray-900'>{template.name}</span>;

      case "datasetType":
        return (
          <span className='text-gray-900'>
            {template.datasetType}
          </span>
        );
      case "fieldsNumber":
        return (
          <span className='text-gray-900'>{template.fieldsNumber}</span>
        );

      case "createdBy":
        return (
          <span className='text-gray-900'>{template.createdBy}</span>
        );

      case "lastModified":
        return (
          <span className='text-gray-900'>{template.lastModified}</span>
        );

      case "status":
        return (
          <div className='flex items-center gap-2'>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                template.status === "active"
                  ? "bg-green-400"
                  : template.status === "inactive"
                  ? "bg-red-400"
                  : "bg-yellow-400"
              )}
            ></div>
            <StatusBadge status={template.status === "active" ? "Active" : "Inactive"} variant='status' />
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
      label: "Delete Template",
      action: (template: MetadataTemplate) => {
        setSelectedTemplate(template);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Handle bulk actions
  const handleBulkDelete = () => {
    console.log("Bulk delete:", selectedTemplates);
    // Implement bulk delete logic
  };

  // Handle individual delete
  const handleDelete = async () => {
    if (!selectedTemplate?.id) return;

    try {
      setTemplates(prev => prev.filter(t => t.id !== selectedTemplate.id));
      setDeleteModalOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  // Pagination info
  const startItem = (currentPage - 1) * 15 + 1;
  const endItem = Math.min(currentPage * 15, filteredTemplates.length);
  const totalPages = Math.ceil(filteredTemplates.length / 15);

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
      <AdvancedTable
        data={filteredTemplates}
        columns={columns}
        showCheckBox={true}
        options={tableOptions}
        getFormattedValue={getFormattedValue}
        onRowSelect={setSelectedTemplates}
      />

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-700'>
          {startItem} - {endItem} of {filteredTemplates.length} templates
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
      <CreateMetadataTemplateModal
        open={createModalOpen || editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setEditModalOpen(false);
            setSelectedTemplateForEdit(null);
          }
        }}
        template={selectedTemplateForEdit || undefined}
        onSuccess={handleTemplateSuccess}
      />

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
