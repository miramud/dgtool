"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdvancedTable from "@/components/shared/AdvancedTable";
import { cn, formatDate } from "@/lib/utils";
import {
  Task,
  TaskStatus,
  TASK_ACTION_TYPE_LABELS,
  TASK_STATUS_CONFIG,
} from "../types/task";
import {
  mockTasks,
  getMyPendingTasks,
  getMySubmissions,
  formatAssignees,
  CURRENT_USER,
  TASK_STATUS_FILTER_OPTIONS,
} from "../data/mockTasks";
import ViewTaskModal from "../components/ViewTaskModal";
import {
  ApproveTaskModal,
  RequestChangesModal,
  RejectTaskModal,
} from "../components/TaskActionModals";

type TabType = "my_pending" | "my_submissions" | "all_tasks";

interface TaskManagerProps {
  className?: string;
}

export default function TaskManager({ className }: TaskManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("my_pending");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [requestChangesModalOpen, setRequestChangesModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Get tasks based on active tab
  const getTabTasks = (): Task[] => {
    switch (activeTab) {
      case "my_pending":
        return getMyPendingTasks(CURRENT_USER);
      case "my_submissions":
        return getMySubmissions(CURRENT_USER);
      case "all_tasks":
        return mockTasks;
      default:
        return [];
    }
  };

  // Filter tasks based on search and status filter
  const filteredTasks = useMemo(() => {
    let tasks = getTabTasks();

    // Apply search filter
    if (searchValue) {
      const search = searchValue.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.id.toLowerCase().includes(search) ||
          t.datasetName.toLowerCase().includes(search) ||
          t.assignees.some((a) => a.name.toLowerCase().includes(search)) ||
          t.requester.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      tasks = tasks.filter((t) => t.status === statusFilter);
    }

    return tasks;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchValue, statusFilter]);

  // Table columns configuration
  const columns = [
    { key: "id", header: "Task ID" },
    { key: "actionType", header: "Action Type" },
    { key: "datasetName", header: "Dataset / Metadata N..." },
    { key: "status", header: "Status" },
    { key: "assignees", header: "Assignee(s) / Approv..." },
    { key: "dateSubmitted", header: "Date Submitted" },
    { key: "dueDate", header: "Due Date" },
    { key: "actions", header: "" },
  ];

  // Format table cell data
  const getFormattedValue = (item: Task, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="font-medium text-gray-900">{item.id}</span>;
      case "actionType":
        return (
          <span className="text-gray-700">
            {TASK_ACTION_TYPE_LABELS[item.actionType]}
          </span>
        );
      case "datasetName":
        return (
          <span
            className="text-gray-700 truncate max-w-[180px] block"
            title={item.datasetName}
          >
            {item.datasetName}
          </span>
        );
      case "status":
        const statusConfig = TASK_STATUS_CONFIG[item.status];
        return (
          <span className={`flex items-center gap-1.5 ${statusConfig.color}`}>
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
            {statusConfig.label}
          </span>
        );
      case "assignees":
        return (
          <span
            className="text-gray-700 truncate max-w-[180px] block"
            title={formatAssignees(item.assignees)}
          >
            {formatAssignees(item.assignees)}
          </span>
        );
      case "dateSubmitted":
        return (
          <span className="text-gray-700">
            {formatDate(item.dateSubmitted, { format: "short", includeTime: true })}
          </span>
        );
      case "dueDate":
        return (
          <span className="text-gray-700">
            {item.dueDate
              ? formatDate(item.dueDate, { format: "short" })
              : "-"}
          </span>
        );
      case "actions":
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewTask(item)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Eye className="w-4 h-4" />
          </Button>
        );
      default:
        return null;
    }
  };

  // Handle view task
  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  // Handle task actions - open confirmation modals
  const handleApprove = (task: Task) => {
    setSelectedTask(task);
    setViewModalOpen(false);
    setApproveModalOpen(true);
  };

  const handleRequestChanges = (task: Task) => {
    setSelectedTask(task);
    setViewModalOpen(false);
    setRequestChangesModalOpen(true);
  };

  const handleReject = (task: Task) => {
    setSelectedTask(task);
    setViewModalOpen(false);
    setRejectModalOpen(true);
  };

  // Confirm actions
  const handleConfirmApprove = (task: Task, comment?: string) => {
    console.log("Confirmed approval for task:", task.id, "Comment:", comment);
    setApproveModalOpen(false);
    setSelectedTask(null);
    // In real app, call API and refresh data
  };

  const handleConfirmRequestChanges = (task: Task, reason: string) => {
    console.log("Confirmed request changes for task:", task.id, "Reason:", reason);
    setRequestChangesModalOpen(false);
    setSelectedTask(null);
    // In real app, call API and refresh data
  };

  const handleConfirmReject = (task: Task, reason: string) => {
    console.log("Confirmed rejection for task:", task.id, "Reason:", reason);
    setRejectModalOpen(false);
    setSelectedTask(null);
    // In real app, call API and refresh data
  };

  // Tab configuration
  const tabs: { key: TabType; label: string }[] = [
    { key: "my_pending", label: "My Pending Tasks" },
    { key: "my_submissions", label: "My Submissions" },
    { key: "all_tasks", label: "All Tasks" },
  ];

  // Pagination
  const itemsPerPage = 10;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredTasks.length);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // Reset page when changing tabs or filters
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Workflow Task Manager
        </h1>
        <p className="text-gray-600 mt-2">
          View, sort, and manage your governance-related tasks in one place.
          Track approvals you need to complete and submissions you&apos;ve made.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "pb-3 text-sm font-medium transition-colors relative",
                activeTab === tab.key
                  ? "text-[#4A4A7A]"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A4A7A]" />
              )}
            </button>
          ))}
        </div>
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
            onChange={(e) =>
              setStatusFilter(e.target.value as TaskStatus | "all")
            }
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent cursor-pointer"
          >
            {TASK_STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Tasks Table */}
      <AdvancedTable
        data={filteredTasks}
        columns={columns}
        isLoading={false}
        showCheckBox={false}
        getFormattedValue={getFormattedValue}
        onRowClick={handleViewTask}
      />

      {/* Pagination */}
      {filteredTasks.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            {startItem} - {endItem} of {filteredTasks.length} tasks
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found</p>
          <p className="text-sm text-gray-400 mt-1">
            {activeTab === "my_pending"
              ? "You have no pending tasks to review"
              : activeTab === "my_submissions"
                ? "You haven't submitted any tasks yet"
                : "No tasks match your search criteria"}
          </p>
        </div>
      )}

      {/* View Task Modal */}
      <ViewTaskModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        task={selectedTask}
        onApprove={handleApprove}
        onRequestChanges={handleRequestChanges}
        onReject={handleReject}
        showActions={activeTab === "my_pending"}
      />

      {/* Action Confirmation Modals */}
      <ApproveTaskModal
        open={approveModalOpen}
        onOpenChange={setApproveModalOpen}
        task={selectedTask}
        onConfirm={handleConfirmApprove}
      />

      <RequestChangesModal
        open={requestChangesModalOpen}
        onOpenChange={setRequestChangesModalOpen}
        task={selectedTask}
        onConfirm={handleConfirmRequestChanges}
      />

      <RejectTaskModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        task={selectedTask}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
