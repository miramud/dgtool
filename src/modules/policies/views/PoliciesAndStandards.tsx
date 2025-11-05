"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdvancedTable from "@/components/shared/AdvancedTable";
import {
  Policy,
  PolicyCategory,
  PolicyFormData,
  PoliciesFilters,
} from "../types/policy";
import { cn, formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PolicyModal from "../components/PolicyModal";
import ViewPolicyModal from "../components/ViewPolicyModal";
import { policiesService } from "@/services/policies";

interface PoliciesAndStandardsProps {
  className?: string;
}

export default function PoliciesAndStandards({
  className,
}: PoliciesAndStandardsProps) {
  const [activeTab, setActiveTab] = useState("published");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPolicy, setViewingPolicy] = useState<Policy | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load policies from API
  const loadPolicies = useCallback(async (filters?: PoliciesFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await policiesService.getPolicies({
        ...filters,
        page_size: 20,
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setPolicies(response.data.results);
    } catch (err) {
      setError("Failed to load policies. Please try again.");
      console.error("Error loading policies:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // console.log({ policies });

  // Load policies on component mount and when filters change
  useEffect(() => {
    const filters: PoliciesFilters = {};
    if (searchValue) filters.search = searchValue;
    if (selectedCategory && selectedCategory !== "All Categories") {
      filters.category = selectedCategory;
    }
    if (activeTab === "published") {
      filters.status = "PUBLISHED";
    } else if (activeTab === "draft") {
      filters.status = "DRAFT";
    }

    loadPolicies(filters);
  }, [activeTab, searchValue, selectedCategory, loadPolicies]);

  // Policies are now loaded from API and filtered server-side
  const filteredPolicies = policies;

  // Table columns configuration
  const columns = [
    { key: "title", header: "Policy Title" },
    { key: "category", header: "Category" },
    { key: "status", header: "Status (Draft/Published)" },
    { key: "dataOwner", header: "Data Owner" },
    { key: "domains", header: "Domains" },
    { key: "lastUpdated", header: "Last Updated" },
    { key: "actions", header: "More" },
  ];

  // Format table cell data
  const getFormattedValue = (item: Policy, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return <span className='font-medium text-gray-900'>{item.title}</span>;
      case "category":
        return <span className='text-gray-900'>{item.category}</span>;
      case "status":
        return (
          <span
            className={`px-2 py-1 text-xs rounded-md ${
              item.status === "PUBLISHED"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {item.status}
          </span>
        );
      case "dataOwner":
        return <span className='text-gray-900'>{item.owner_name!}</span>;
      case "domains":
        return (
          <div className='flex flex-wrap gap-1'>
            <span className='px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800'>
              {item.domains}
            </span>

            {/* {item.domains.length > 2 && (
              <span className='px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600'>
                +{item.domains.length - 2} more
              </span>
            )} */}
          </div>
        );
      case "lastUpdated":
        return (
          <span className='text-gray-900'>
            {formatDate(item.updated_datetime!)}
          </span>
        );
      case "actions":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm'>
                <MoreHorizontal className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => handleViewPolicy(item)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditPolicy(item)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeletePolicy(item.id)}
                className='text-red-600'
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return null;
    }
  };

  // Category options for filter
  const categoryOptions = ["All Categories", ...Object.values(PolicyCategory)];

  // Handle policy creation/editing
  const handlePolicySubmit = async (
    formData: PolicyFormData,
    isDraft: boolean
  ) => {
    try {
      const policyData = {
        ...formData,
        is_draft: isDraft ? true : false,
      };

      if (editingPolicy) {
        await policiesService.updatePolicy(editingPolicy.id, policyData);
      } else {
        await policiesService.createPolicy(policyData);
      }

      setIsModalOpen(false);
      setEditingPolicy(null);
      // Reload policies to show the new/updated policy
      const filters: PoliciesFilters = {};
      if (searchValue) filters.search = searchValue;
      if (selectedCategory && selectedCategory !== "All Categories") {
        filters.category = selectedCategory;
      }
      if (activeTab === "published") {
        filters.status = "PUBLISHED";
      } else if (activeTab === "draft") {
        filters.status = "DRAFT";
      }

      loadPolicies(filters);
    } catch (err) {
      console.error("Error saving policy:", err);
      setError("Failed to save policy. Please try again.");
    }
  };

  const handleCreatePolicy = () => {
    setEditingPolicy(null);
    setIsModalOpen(true);
  };

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setIsModalOpen(true);
  };

  const handleViewPolicy = (policy: Policy) => {
    setViewingPolicy(policy);
    setIsViewModalOpen(true);
  };

  const handlePublishPolicy = async () => {
    if (viewingPolicy) {
      try {
        await policiesService.publishPolicy(viewingPolicy.id);
        setIsViewModalOpen(false);
        setViewingPolicy(null);
        // Reload policies to show the updated status
        const filters: PoliciesFilters = {};
        if (searchValue) filters.search = searchValue;
        if (selectedCategory && selectedCategory !== "All Categories") {
          filters.category = selectedCategory;
        }
        if (activeTab === "published") {
          filters.status = "PUBLISHED";
        } else if (activeTab === "draft") {
          filters.status = "DRAFT";
        }

        loadPolicies(filters);
      } catch (err) {
        console.error("Error publishing policy:", err);
        setError("Failed to publish policy. Please try again.");
      }
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    try {
      await policiesService.deletePolicy(policyId);
      // Reload policies to reflect the deletion
      // Reload policies to show the updated status
      const filters: PoliciesFilters = {};
      if (searchValue) filters.search = searchValue;
      if (selectedCategory && selectedCategory !== "All Categories") {
        filters.category = selectedCategory;
      }
      if (activeTab === "published") {
        filters.status = "PUBLISHED";
      } else if (activeTab === "draft") {
        filters.status = "DRAFT";
      }

      loadPolicies(filters);
    } catch (err) {
      console.error("Error deleting policy:", err);
      setError("Failed to delete policy. Please try again.");
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'>
          {error}
        </div>
      )}

      {/* Header Section */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Policies & Standards
          </h1>
          <p className='text-gray-600 mt-2'>
            Policies overview (e.g., Published, Drafts, Linked to datasets)
          </p>
        </div>
        <Button
          onClick={handleCreatePolicy}
          className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
        >
          <Plus className='w-4 h-4 mr-2' />
          Create New Policy
        </Button>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='published'>Published</TabsTrigger>
          <TabsTrigger value='draft'>Draft</TabsTrigger>
        </TabsList>

        <TabsContent value='published' className='space-y-4'>
          {/* Search and Filter Section */}
          <div className='flex items-center space-x-4'>
            {/* Search Field */}
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search by Policy Domain or Domain ...'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm'
              />
            </div>

            {/* Filter Dropdown */}
            <div className='relative'>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent cursor-pointer'
              >
                <option value=''>Filter</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
            </div>
          </div>

          {/* Policies Table */}
          <AdvancedTable
            data={filteredPolicies}
            columns={columns}
            isLoading={isLoading}
            showCheckBox={true}
            getFormattedValue={getFormattedValue}
            // onRowSelect={setSelectedPolicies}
          />
        </TabsContent>

        <TabsContent value='draft' className='space-y-4'>
          {/* Search and Filter Section */}
          <div className='flex items-center space-x-4'>
            {/* Search Field */}
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search by Policy Domain or Domain ...'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm'
              />
            </div>

            {/* Filter Dropdown */}
            <div className='relative'>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent cursor-pointer'
              >
                <option value=''>Filter</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
            </div>
          </div>

          {/* Policies Table */}
          <AdvancedTable
            data={filteredPolicies}
            columns={columns}
            isLoading={isLoading}
            showCheckBox={true}
            getFormattedValue={getFormattedValue}
            // onRowSelect={setSelectedPolicies}
          />
        </TabsContent>
      </Tabs>

      {/* Policy Creation/Edit Modal */}
      <PolicyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        policy={editingPolicy}
        onSubmit={handlePolicySubmit}
      />

      {/* View Policy Modal */}
      <ViewPolicyModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        policyId={viewingPolicy && viewingPolicy.id}
        onPublish={handlePublishPolicy}
      />
    </div>
  );
}
