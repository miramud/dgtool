"use client";

import { useState } from "react";
import { AlertCircle, Clock, CheckCircle2, XCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IssueStatus, ISSUE_TYPE_OPTIONS, ISSUE_STATUS_LABELS } from "../types/issue";
import { useIssues, useDeleteIssue } from "@/modules/dataCatalogue/controllers/issueController";
import IssueDetailModal from "./IssueDetailModal";
import UpdateIssueModal from "./UpdateIssueModal";

interface IssueLogPanelProps {
  datasetId: string;
  className?: string;
}

const getStatusIcon = (status: IssueStatus) => {
  switch (status) {
    case IssueStatus.OPEN:
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case IssueStatus.IN_PROGRESS:
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case IssueStatus.RESOLVED:
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case IssueStatus.CLOSED:
      return <XCircle className="w-4 h-4 text-gray-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusBadgeClass = (status: IssueStatus): string => {
  switch (status) {
    case IssueStatus.OPEN:
      return "bg-red-100 text-red-800 border-red-200";
    case IssueStatus.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case IssueStatus.RESOLVED:
      return "bg-green-100 text-green-800 border-green-200";
    case IssueStatus.CLOSED:
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusLabel = (status: IssueStatus): string => {
  return ISSUE_STATUS_LABELS[status] || status;
};

export default function IssueLogPanel({ datasetId, className }: IssueLogPanelProps) {
  const { data, isLoading, isError } = useIssues({ dataset: datasetId });
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [deleteIssueId, setDeleteIssueId] = useState<string | null>(null);
  const { mutate: deleteIssue, isPending: isDeleting } = useDeleteIssue();

  const handleViewIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
    setIsViewModalOpen(true);
  };

  const handleUpdateIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteIssue = (issueId: string) => {
    setDeleteIssueId(issueId);
  };

  const confirmDelete = () => {
    if (deleteIssueId) {
      deleteIssue(deleteIssueId, {
        onSuccess: () => {
          setDeleteIssueId(null);
        },
      });
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setTimeout(() => setSelectedIssueId(null), 200);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setTimeout(() => setSelectedIssueId(null), 200);
  };

  if (isLoading) {
    return (
      <div className={cn("p-4", className)}>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn("p-4", className)}>
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load issues</p>
        </div>
      </div>
    );
  }

  const issues = data?.results || [];

  if (issues.length === 0) {
    return (
      <div className={cn("p-4", className)}>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600">No issues reported for this dataset</p>
          <p className="text-sm text-gray-400 mt-1">
            Issues reported by users will appear here
          </p>
        </div>
      </div>
    );
  }

  const openIssues = issues.filter(
    (i) => i.status === IssueStatus.OPEN || i.status === IssueStatus.IN_PROGRESS
  );
  const closedIssues = issues.filter(
    (i) => i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED
  );

  return (
    <div className={cn("p-4 space-y-6", className)}>
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium">
          {openIssues.length} Open
        </div>
        <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
          {closedIssues.length} Resolved/Closed
        </div>
      </div>

      {/* Issue List */}
      <div className="space-y-4">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onView={handleViewIssue}
            onUpdate={handleUpdateIssue}
            onDelete={handleDeleteIssue}
          />
        ))}
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issueId={selectedIssueId}
        open={isViewModalOpen}
        onOpenChange={handleCloseViewModal}
      />

      {/* Update Issue Modal */}
      <UpdateIssueModal
        issueId={selectedIssueId}
        open={isUpdateModalOpen}
        onOpenChange={handleCloseUpdateModal}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteIssueId} onOpenChange={() => setDeleteIssueId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Issue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this issue? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface IssueCardProps {
  issue: {
    id: string;
    title: string;
    issue_type: string;
    severity_level: string;
    status: IssueStatus;
    due_date?: string;
    created_by_name: string;
    created_datetime: string;
    is_overdue?: boolean;
  };
  onView: (issueId: string) => void;
  onUpdate: (issueId: string) => void;
  onDelete: (issueId: string) => void;
}

function IssueCard({ issue, onView, onUpdate, onDelete }: IssueCardProps) {
  const getIssueTypeLabel = (type: string): string => {
    const option = ISSUE_TYPE_OPTIONS.find((opt) => opt.value === type);
    return option?.label || type;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {getStatusIcon(issue.status)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900">{issue.title}</span>
              <StatusBadge
                status={getStatusLabel(issue.status)}
                className={`text-xs ${getStatusBadgeClass(issue.status)}`}
              />
              {issue.is_overdue && (
                <span className="text-xs text-red-600 font-medium">Overdue</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {getIssueTypeLabel(issue.issue_type)} • {issue.severity_level}
            </p>
            {issue.due_date && (
              <p className="text-xs text-gray-500 mt-1">
                Due: {formatDate(issue.due_date)}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>Reported by {issue.created_by_name}</span>
              <span>{formatDate(issue.created_datetime)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(issue.id)}
            className="h-8 px-3"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate(issue.id)}
            className="h-8 px-3"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Update
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(issue.id)}
            className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
