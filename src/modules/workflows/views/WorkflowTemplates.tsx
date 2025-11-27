"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye, GitBranch, Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdvancedTable from "@/components/shared/AdvancedTable";
import { cn, formatDate } from "@/lib/utils";
import type { WorkflowListItem, WorkflowStatus } from "../types/workflow";
import CreateWorkflowModal from "../components/CreateWorkflowModal";
import ViewWorkflowModal from "../components/ViewWorkflowModal";
import ViewAsFlowCard from "../components/ViewAsFlowCard";
import EditWorkflowModal from "../components/EditWorkflowModal";
import ConfirmUpdateModal from "../components/ConfirmUpdateModal";
import DeactivateWorkflowModal from "../components/DeactivateWorkflowModal";
import { useWorkflows, useDeleteWorkflow } from "@/modules/workflows/controllers/workflowController";


interface WorkflowTemplatesProps {
  className?: string;
}

export default function WorkflowTemplates({ className }: WorkflowTemplatesProps) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // View state - "list" for table view, "flowCard" for flow card view
  const [currentView, setCurrentView] = useState<"list" | "flowCard">("list");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  // Fetch workflows with filters
  const { data: workflowsData, isLoading } = useWorkflows({
    search: searchValue,
    page: currentPage,
    page_size: 10,
  });

  const { mutate: deleteWorkflow } = useDeleteWorkflow();

  // Get workflows list
  const workflows = workflowsData?.results || [];
  const paginator = workflowsData?.paginator;

  // Table columns configuration based on screenshot
  const columns = [
    { key: "name", header: "Workflow Name" },
    { key: "datasetTypes", header: "Dataset Type(s)" },
    { key: "approvers", header: "Approvers" },
    { key: "lastModified", header: "Last Modified" },
    { key: "createdBy", header: "Created By" },
    { key: "more", header: "More" },
  ];

  // Format table cell data
  const getFormattedValue = (item: WorkflowListItem, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <span className="font-medium text-gray-900 truncate max-w-[200px] block" title={item.name}>
            {item.name}
          </span>
        );
      case "datasetTypes":
        return (
          <span className="text-gray-700 truncate max-w-[150px] block" title={item.dataset_type_name}>
            {item.dataset_type_name}
          </span>
        );
      case "approvers":
        return (
          <span className="text-gray-700">
            {item.approvers_count} Approver{item.approvers_count !== "1" ? "s" : ""}
          </span>
        );
      case "lastModified":
        return (
          <span className="text-gray-700">
            {formatDate(item.updated_datetime, { format: "short", includeTime: true })}
          </span>
        );
      case "createdBy":
        return (
          <span className="text-gray-700 truncate max-w-[150px] block" title={item.created_by_name}>
            {item.created_by_name}
          </span>
        );
      case "more":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWorkflowId(item.id);
                  setViewModalOpen(true);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWorkflowId(item.id);
                  setCurrentView("flowCard");
                }}
              >
                <GitBranch className="w-4 h-4 mr-2" />
                View as flow card
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWorkflowId(item.id);
                  setEditModalOpen(true);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWorkflowId(item.id);
                  setDeactivateModalOpen(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return null;
    }
  };

  // Confirm update
  const handleConfirmUpdate = () => {
    setConfirmUpdateOpen(false);
    setSelectedWorkflowId(null);
  };

  // Handle deactivation/deletion
  const handleDeactivate = () => {
    if (selectedWorkflowId) {
      deleteWorkflow(selectedWorkflowId);
    }
    setDeactivateModalOpen(false);
    setSelectedWorkflowId(null);
  };

  // Pagination
  const startItem = paginator ? (paginator.page - 1) * paginator.page_size + 1 : 0;
  const endItem = paginator ? Math.min(paginator.page * paginator.page_size, paginator.count) : 0;
  const totalPages = paginator?.total_pages || 0;

  // Handle back from flow card view
  const handleBackFromFlowCard = () => {
    setCurrentView("list");
    setSelectedWorkflowId(null);
  };

  // If viewing flow card, render that instead of the list
  if (currentView === "flowCard" && selectedWorkflowId) {
    return (
      <div className={cn("space-y-6", className)}>
        <ViewAsFlowCard
          workflowId={selectedWorkflowId}
          onBack={handleBackFromFlowCard}
        />

        {/* Keep modals available */}
        <CreateWorkflowModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approval Workflow Templates</h1>
          <p className="text-gray-600 mt-2">
            Discover a searchable, centralized inventory of data assets.
          </p>
        </div>
        <Button
          className="bg-[#4A4A7A] hover:bg-[#3A3A6A]"
          onClick={() => setCreateModalOpen(true)}
        >
          Create workflow
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by workflow name or approver"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | "all")}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent cursor-pointer"
          >
            <option value="all">Filter</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Workflows Table */}
      <AdvancedTable
        data={workflows}
        columns={columns}
        isLoading={isLoading}
        showCheckBox={false}
        getFormattedValue={getFormattedValue}
      />

      {/* Pagination */}
      {paginator && paginator.count > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            {startItem} - {endItem} of {paginator.count} workflows
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || !paginator.previous_page_number}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!paginator.next_page_number}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateWorkflowModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <ViewWorkflowModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        workflowId={selectedWorkflowId}
      />

      <EditWorkflowModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        workflowId={selectedWorkflowId}
      />

      <ConfirmUpdateModal
        open={confirmUpdateOpen}
        onOpenChange={setConfirmUpdateOpen}
        workflowId={selectedWorkflowId}
        onConfirm={handleConfirmUpdate}
      />

      <DeactivateWorkflowModal
        open={deactivateModalOpen}
        onOpenChange={setDeactivateModalOpen}
        workflowId={selectedWorkflowId}
        onConfirm={handleDeactivate}
      />
    </div>
  );
}
