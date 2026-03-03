"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";

import AdvancedTable from "../../../components/shared/AdvancedTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import { BusinessDescription } from "../types/dataCatalogue";
import type { DataCatalogue } from "../types/dataCatalogue";

import { useGetDataGovernors } from "../controllers/dataGovernanceController";
import { cn, formatDate } from "@/lib/utils";
import AssignOwnershipModal from "../components/AssignOwnershipModal";
import EditStewardsModal from "../components/EditStewardsModal";

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

const normalizeTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim())
      .filter((tag) => tag.length > 0);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }
  return [];
};

export default function DataStewardshipAndOwnership({
  className,
}: EnhancedDataCatalogueProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDataCatalogue, setSelectedDataCatalogue] =
    useState<DataCatalogue | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [selectedBusinessDescription, setSelectedBusinessDescription] =
    useState("");
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [editStewardsModalOpen, setEditStewardsModalOpen] = useState(false);

  // Get data from API using React Query
  // const { data: apiData, isLoading } = useGetDataCatalogue();
  const { data: dataGovernors, isLoading: isLoadingGovernors } =
    useGetDataGovernors();

  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Use governance data and transform it to display format
  const dataCatalogueData = useMemo(() => {
    if (!dataGovernors) return [];
    return dataGovernors.map((governor: any, index: number) => ({
      id: governor.dataset_id || governor.id || `dataset-${index}`,
      name:
        governor.dataset_name ||
        governor.name ||
        `Dataset ${governor.dataset_id || governor.id || index}`,
      description: governor.description || "No description available",
      dataset_type: governor.dataset_type || "Unknown",
      tags: governor.tags || [],
      data_stewards_count: governor.data_stewards_count,
      data_owners_count: governor.data_owners_count,
      created_datetime: governor.created_datetime,
      updated_datetime: governor.updated_datetime,
      sensitivity: governor.sensitivity || "INTERNAL",
    }));
  }, [dataGovernors]);

  // Create a map of dataset governance info
  const governanceMap = useMemo(() => {
    if (!dataGovernors) return {};
    return dataGovernors.reduce((acc: any, governor: any) => {
      acc[governor.dataset_id] = governor;
      return acc;
    }, {});
  }, [dataGovernors]);

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
        (item) => {
          const itemTags = normalizeTags((item as any).tags);
          return (
            item.name
            ?.toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          item.description
            ?.toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          item.dataset_type
            ?.toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          itemTags.some((tag: string) =>
            tag.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          )
          );
        }
      );
    }

    // Apply business description filter
    if (
      selectedBusinessDescription &&
      selectedBusinessDescription !== "All Business Descriptions"
    ) {
      dataCatalogue = dataCatalogue.filter(
        (item) => item.description === selectedBusinessDescription
      );
    }

    return dataCatalogue;
  }, [debouncedSearchValue, selectedBusinessDescription, dataCatalogueData]);

  // Table columns configuration
  const columns = [
    {
      key: "businessTechnicalSpecification",
      header: "Dataset Name",
    },
    { key: "businessDescription", header: "Business Domain" },
    { key: "usageGuidelines", header: "Classification" },
    { key: "dataOwner", header: "Data Owner" },
    { key: "dataStewards", header: "Data Stewards" },
    { key: "date", header: "Last Updated" },
  ];

  // Format table cell data
  const getFormattedValue = (item: DataCatalogue, columnKey: string) => {
    const governance = governanceMap[item.id];
    console.log({ governance, item });

    switch (columnKey) {
      case "businessTechnicalSpecification":
        return <span className='text-gray-900'>{item.name}</span>;
      case "businessDescription":
        return <span className='text-gray-900'>{item.description}</span>;
      case "usageGuidelines":
        return <span className='text-gray-900'>{item.dataset_type}</span>;
      case "dataOwner":
        // if (governance?.data_owners?.length > 0) {
        //   return (
        //     <div className='flex flex-wrap gap-1'>
        //       {governance.data_owners
        //         .slice(0, 2)
        //         .map((owner: any, index: number) => (
        //           <StatusBadge
        //             key={index}
        //             status={
        //               typeof owner === "string"
        //                 ? owner
        //                 : owner.name || owner.email
        //             }
        //             variant='default'
        //             className='bg-green-100 text-green-800'
        //           />
        //         ))}
        //       {governance.data_owners.length > 2 && (
        //         <StatusBadge
        //           status={`+${governance.data_owners.length - 2} more`}
        //           variant='default'
        //           className='bg-gray-100 text-gray-600'
        //         />
        //       )}
        //     </div>
        //   );
        // }

        return (
          <span className='text-gray-500'>{item?.data_stewards_count}</span>
        );
      case "dataStewards":
        if (governance?.stewards?.length > 0) {
          return (
            <div className='flex flex-wrap gap-1'>
              {governance.stewards
                .slice(0, 2)
                .map((steward: any, index: number) => (
                  <StatusBadge
                    key={index}
                    status={
                      typeof steward === "string"
                        ? steward
                        : steward.name || steward.email
                    }
                    variant='default'
                    className='bg-blue-100 text-blue-800'
                  />
                ))}
              {governance.stewards.length > 2 && (
                <StatusBadge
                  status={`+${governance.stewards.length - 2} more`}
                  variant='default'
                  className='bg-gray-100 text-gray-600'
                />
              )}
            </div>
          );
        }
        return <span className='text-gray-500'>{item?.data_owners_count}</span>;

      case "tags":
        const itemTags = normalizeTags((item as any).tags);
        return (
          <div className='flex flex-wrap gap-1'>
            {itemTags.slice(0, 2).map((tag, index) => (
              <StatusBadge
                key={index}
                status={tag}
                variant='default'
                className='bg-blue-100 text-blue-800'
              />
            ))}
            {itemTags.length > 2 && (
              <StatusBadge
                status={`+${itemTags.length - 2} more`}
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
        // console.log({ item });

        router.push(`/dashboard/data-stewardship/${item.id}`);
      },
    },
    // {
    //   label: "Edit Assignment",
    //   action: (item: DataCatalogue) => {
    //     setSelectedDataCatalogue(item);
    //     setAssignmentModalOpen(true);
    //   },
    // },
    {
      label: "Edit",
      action: (item: DataCatalogue) => {
        setSelectedDataCatalogue(item);
        setEditStewardsModalOpen(true);
      },
    },
  ];

  // Handle assignment submission
  const handleAssignOwnership = (data: any) => {
    console.log("Assignment data:", data);
    console.log("Selected dataset:", selectedDataCatalogue);
    // Implement assignment logic
    setAssignmentModalOpen(false);
    setSelectedDataCatalogue(null);
  };

  // Handle stewards edit submission
  const handleEditStewards = (datasetId: string, stewards: any[]) => {
    console.log("Edit stewards data:", { datasetId, stewards });
    console.log("Selected dataset:", selectedDataCatalogue);
    // Implement stewards edit logic
    setEditStewardsModalOpen(false);
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
          <h1 className='text-2xl font-bold text-gray-900'>
            Data Stewardship & Ownership{" "}
          </h1>
          <p className='text-gray-600 mt-2'>
            Discover a searchable, centralized inventory of data assets.
          </p>
        </div>

        <Button
          className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
          onClick={() => {
            setSelectedDataCatalogue(null);
            setAssignmentModalOpen(true);
          }}
        >
          <Plus className='w-4 h-4 mr-2' />
          Assign Ownership
        </Button>
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
      </div>

      {/* Advanced Table */}
      <AdvancedTable
        data={filteredDataCatalogue}
        columns={columns}
        isLoading={isLoadingGovernors}
        showCheckBox={true}
        options={tableOptions}
        getFormattedValue={getFormattedValue}
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
      <AssignOwnershipModal
        open={assignmentModalOpen}
        onOpenChange={setAssignmentModalOpen}
        onSubmit={handleAssignOwnership}
      />

      <EditStewardsModal
        open={editStewardsModalOpen}
        onOpenChange={setEditStewardsModalOpen}
        selectedDataset={selectedDataCatalogue}
        onSave={handleEditStewards}
      />
    </div>
  );
}
