"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdvancedTable from "@/components/shared/AdvancedTable";
import { Policy, PolicyCategory, PolicyFormData } from "../types/policy";
import { cn, formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PolicyModal from "../components/PolicyModal";
import ViewPolicyModal from "../components/ViewPolicyModal";

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

  // Mock data for policies
  const mockPolicies: Policy[] = useMemo(
    () => [
      {
        id: "1",
        title: "Data Retention Policy",
        category: "Data Retention",
        status: "Published",
        dataOwner: "Ibrahim Musa",
        domains: ["Finance", "HR"],
        lastUpdated: "2025-08-13",
        description:
          "Policy governing how long different types of data should be retained",
        content: "This policy outlines the data retention requirements...",
        version: "1.2",
        createdBy: "John Doe",
        createdAt: "2025-01-15",
        effectiveDate: "2025-02-01",
        reviewDate: "2026-02-01",
      },
      {
        id: "2",
        title: "Naming Standards",
        category: "Naming Convention",
        status: "Draft",
        dataOwner: "Chinwe Okonkwo",
        domains: ["All"],
        lastUpdated: "2025-08-05",
        description: "Standards for naming datasets, tables, and columns",
        content: "This document defines the naming conventions...",
        version: "0.1",
        createdBy: "Jane Smith",
        createdAt: "2025-07-20",
        effectiveDate: "2025-09-01",
        reviewDate: "2026-09-01",
      },
      {
        id: "3",
        title: "Data Privacy and Protection",
        category: "Data Privacy",
        status: "Published",
        dataOwner: "Sarah Wilson",
        domains: ["Legal", "Compliance", "HR"],
        lastUpdated: "2025-07-22",
        description: "Comprehensive data privacy and protection guidelines",
        content:
          "This policy ensures compliance with GDPR and other regulations...",
        version: "2.0",
        createdBy: "Mike Johnson",
        createdAt: "2025-03-10",
        effectiveDate: "2025-04-01",
        reviewDate: "2026-04-01",
      },
      {
        id: "4",
        title: "Data Quality Standards",
        category: "Data Quality",
        status: "Published",
        dataOwner: "Alex Chen",
        domains: ["Engineering", "Analytics"],
        lastUpdated: "2025-06-15",
        description:
          "Standards for maintaining high-quality data across systems",
        content:
          "This document outlines the minimum data quality requirements...",
        version: "1.5",
        createdBy: "Emily Davis",
        createdAt: "2025-02-28",
        effectiveDate: "2025-03-15",
        reviewDate: "2026-03-15",
      },
      {
        id: "5",
        title: "Access Control Framework",
        category: "Access Control",
        status: "Draft",
        dataOwner: "David Rodriguez",
        domains: ["IT", "Security"],
        lastUpdated: "2025-09-01",
        description:
          "Framework for managing data access permissions and controls",
        content:
          "This framework defines how access to sensitive data should be managed...",
        version: "0.3",
        createdBy: "Lisa Anderson",
        createdAt: "2025-08-15",
        effectiveDate: "2025-10-01",
        reviewDate: "2026-10-01",
      },
    ],
    []
  );

  // Filter policies based on tab and search
  const filteredPolicies = useMemo(() => {
    let policies = mockPolicies;

    // Filter by status (tab)
    if (activeTab === "published") {
      policies = policies.filter((policy) => policy.status === "Published");
    } else if (activeTab === "draft") {
      policies = policies.filter((policy) => policy.status === "Draft");
    }

    // Filter by search
    if (searchValue) {
      policies = policies.filter(
        (policy) =>
          policy.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          policy.category.toLowerCase().includes(searchValue.toLowerCase()) ||
          policy.dataOwner.toLowerCase().includes(searchValue.toLowerCase()) ||
          policy.domains.some((domain) =>
            domain.toLowerCase().includes(searchValue.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All Categories") {
      policies = policies.filter(
        (policy) => policy.category === selectedCategory
      );
    }

    return policies;
  }, [activeTab, searchValue, selectedCategory, mockPolicies]);

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
              item.status === "Published"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {item.status}
          </span>
        );
      case "dataOwner":
        return <span className='text-gray-900'>{item.dataOwner}</span>;
      case "domains":
        return (
          <div className='flex flex-wrap gap-1'>
            {item.domains.slice(0, 2).map((domain, index) => (
              <span
                key={index}
                className='px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800'
              >
                {domain}
              </span>
            ))}
            {item.domains.length > 2 && (
              <span className='px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600'>
                +{item.domains.length - 2} more
              </span>
            )}
          </div>
        );
      case "lastUpdated":
        return (
          <span className='text-gray-900'>{formatDate(item.lastUpdated)}</span>
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
              {/* <DropdownMenuItem
                onClick={() => console.log("Duplicate", item.id)}
              >
                Duplicate
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem
                onClick={() => console.log("Delete", item.id)}
                className='text-red-600'
              >
                Delete
              </DropdownMenuItem> */}
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
  const handlePolicySubmit = (formData: PolicyFormData, isDraft: boolean) => {
    console.log("Policy submitted:", formData, "isDraft:", isDraft);
    // Here you would typically send the data to your API
    // For now, we'll just log it and close the modal
    setIsModalOpen(false);
    setEditingPolicy(null);
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

  const handlePublishPolicy = () => {
    if (viewingPolicy) {
      console.log("Publishing policy:", viewingPolicy.id);
      // Here you would typically call your API to publish the policy
      // For now, we'll just close the modal
      setIsViewModalOpen(false);
      setViewingPolicy(null);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
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
            isLoading={false}
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
            isLoading={false}
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
        policy={viewingPolicy}
        onPublish={handlePublishPolicy}
      />
    </div>
  );
}
