"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Upload,
  Database,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdvancedTable from "../../../components/shared/AdvancedTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import { BusinessDescription } from "../types/dataCatalogue";
import type { DataCatalogue } from "../types/dataCatalogue";
import IssueBadge from "../components/IssueBadge";
import {
  useGetDataCatalogue,
  useDeleteDataCatalogue,
} from "../controllers/dataCatalogueController";
import { cn, formatDate } from "@/lib/utils";
import DataCatalogueModal from "../components/DataCatalogueModal";
import DeleteDataCatalogueModal from "../components/DeleteDataCatalogueModal";
import RequestAccessModal from "../components/RequestAccessModal";

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

interface EnhancedDataCatalogueProps {
  className?: string;
}

export default function DataCatalogue({
  className,
}: EnhancedDataCatalogueProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDataCatalogue, setSelectedDataCatalogue] =
    useState<DataCatalogue | null>(null);
  const [selectedDataCatalogues, setSelectedDataCatalogues] = useState<
    DataCatalogue[]
  >([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedBusinessDescription, setSelectedBusinessDescription] =
    useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [requestAccessModalOpen, setRequestAccessModalOpen] = useState(false);

  // Get data from API using React Query
  const { data: apiData, isLoading, refetch } = useGetDataCatalogue();

  // Delete hook
  const { deleteDataCatalogue, isLoading: isDeleting } =
    useDeleteDataCatalogue();

  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Use API data or fallback to empty array
  const dataCatalogueData = useMemo(
    () => (Array.isArray(apiData) ? apiData : []),
    [apiData]
  );

  // BusinessDescription options for filtering (mimicking performance dialog pattern)
  const businessDescriptionOptions = [
    "All Business Descriptions",
    ...Object.values(BusinessDescription),
  ];

  // Filter data catalogue based on search and business description
  const filteredDataCatalogue = useMemo(() => {
    let dataCatalogue = [...dataCatalogueData];

    // Apply search filter
    if (debouncedSearchValue) {
      dataCatalogue = dataCatalogue.filter(
        (item) =>
          item.businessTechnicalSpecification
            ?.toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          item.businessDescription
            ?.toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          item.usageGuidelines
            ?.toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          item.tags?.some((tag: string) =>
            tag.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          )
      );
    }

    // Apply business description filter
    if (
      selectedBusinessDescription &&
      selectedBusinessDescription !== "All Business Descriptions"
    ) {
      dataCatalogue = dataCatalogue.filter(
        (item) => item.businessDescription === selectedBusinessDescription
      );
    }

    return dataCatalogue;
  }, [debouncedSearchValue, selectedBusinessDescription, dataCatalogueData]);

  // Table columns configuration
  const columns = [
    {
      key: "businessTechnicalSpecification",
      header: "Business/Technical Specification",
    },
    { key: "businessDescription", header: "Business Description" },
    { key: "usageGuidelines", header: "Usage Guidelines" },
    { key: "tags", header: "Tags" },
    { key: "date", header: "Date" },
    { key: "dataSource", header: "Data Source" },
  ];

  // Format table cell data
  const getFormattedValue = (item: DataCatalogue, columnKey: string) => {
    switch (columnKey) {
      case "businessTechnicalSpecification":
        return (
          <div className="flex items-center gap-2">
            <span className='text-gray-900'>{item.name}</span>
            <IssueBadge datasetId={item.id} showCount={false} />
          </div>
        );
      case "businessDescription":
        return <span className='text-gray-900'>{item.description}</span>;
      case "usageGuidelines":
        return <span className='text-gray-900'>{item.dataset_type}</span>;
      case "tags":
        return (
          <div className='flex flex-wrap gap-1'>
            {item.tags?.slice(0, 2).map((tag, index) => (
              <StatusBadge
                key={index}
                status={tag}
                variant='default'
                className='bg-blue-100 text-blue-800'
              />
            ))}
            {item.tags?.length > 2 && (
              <StatusBadge
                status={`+${item.tags.length - 2} more`}
                variant='default'
                className='bg-gray-100 text-gray-600'
              />
            )}
          </div>
        );
      case "date":
        return (
          <span className='text-gray-900'>
            {formatDate(item.created_datetime)}
          </span>
        );
      case "dataSource":
        return <span className='text-gray-900'>{item.sensitivity}</span>;
      default:
        return null;
    }
  };

  // Table action options
  const tableOptions = [
    {
      label: "View",
      action: (item: DataCatalogue) => {
        router.push(`/dashboard/data-catalogue/${item.id}`);
      },
    },
    {
      label: "Edit",
      action: (item: DataCatalogue) => {
        setSelectedDataCatalogue(item);
        setModalOpen(true);
      },
    },
    {
      label: "Request Dataset",
      action: (item: DataCatalogue) => {
        setSelectedDataCatalogue(item);
        setRequestAccessModalOpen(true);
      },
    },
    {
      label: "Delete",
      action: (item: DataCatalogue) => {
        setSelectedDataCatalogue(item);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Handle bulk actions
  const handleBulkDelete = () => {
    console.log("Bulk delete:", selectedDataCatalogues);
    // Implement bulk delete logic
  };

  // Handle individual delete
  const handleDelete = async () => {
    if (!selectedDataCatalogue?.id) {
      console.error("No dataset selected for deletion");
      return;
    }

    try {
      await deleteDataCatalogue(selectedDataCatalogue.id);
      setDeleteModalOpen(false);
      setSelectedDataCatalogue(null);
      // Refresh the data after successful deletion
      refetch();
    } catch (error) {
      console.error("Error deleting dataset:", error);
    }
  };

  // Handle request access submission
  const handleRequestAccess = (data: any) => {
    console.log("Request access data:", data);
    console.log("Selected dataset:", selectedDataCatalogue);
    // Implement request access logic
    setRequestAccessModalOpen(false);
    setSelectedDataCatalogue(null);
  };

  // Pagination info (mimicking performance dialog pattern)
  const startItem = (currentPage - 1) * 15 + 1;
  const endItem = Math.min(currentPage * 15, filteredDataCatalogue.length);
  const totalPages = Math.ceil(filteredDataCatalogue.length / 15);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Data Catalogue</h1>
          <p className='text-gray-600 mt-2'>
            Discover a searchable, centralized inventory of data assets.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'>
              <Plus className='w-4 h-4 mr-2' />
              Add New Dataset
              <ChevronDown className='w-4 h-4 ml-2' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuItem
              onClick={() => {
                setSelectedDataCatalogue(null);
                setModalOpen(true);
              }}
            >
              <Upload className='w-4 h-4 mr-2' />
              Upload File
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Database className='w-4 h-4 mr-2' />
                Connect to Data Source
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => console.log("PostgreSQL selected")}
                >
                  PostgreSQL
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("REST API selected")}
                >
                  REST API
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("Amazon S3 selected")}
                >
                  Amazon S3
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("MySQL selected")}>
                  MySQL
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search and Filter Section */}
      <div className='flex items-center space-x-4'>
        {/* Search Field */}
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Schema, description, guidelines, tags'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm'
          />
        </div>

        {/* Filter Button */}
        <div className='relative'>
          <select
            value={selectedBusinessDescription}
            onChange={(e) =>
              setSelectedBusinessDescription(
                e.target.value === "All Business Descriptions"
                  ? ""
                  : e.target.value
              )
            }
            className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent cursor-pointer'
          >
            <option value=''>Filter</option>
            {businessDescriptionOptions.map((desc) => (
              <option key={desc} value={desc}>
                {desc}
              </option>
            ))}
          </select>
          <Filter className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
        </div>

        {/* Bulk Actions */}
        {selectedDataCatalogues.length > 0 && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>
              {selectedDataCatalogues.length} selected
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
        data={filteredDataCatalogue}
        columns={columns}
        isLoading={isLoading}
        showCheckBox={true}
        options={tableOptions}
        getFormattedValue={getFormattedValue}
        onRowSelect={setSelectedDataCatalogues}
      />

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-700'>
          {startItem} - {endItem} of {filteredDataCatalogue.length} data assets
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

      {/* Modals */}
      <DataCatalogueModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        dataCatalogue={selectedDataCatalogue}
      />

      <DeleteDataCatalogueModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        selectedDataCatalogue={selectedDataCatalogue}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      <RequestAccessModal
        open={requestAccessModalOpen}
        onOpenChange={setRequestAccessModalOpen}
        selectedDataset={selectedDataCatalogue}
        onSubmit={handleRequestAccess}
      />
    </div>
  );
}
