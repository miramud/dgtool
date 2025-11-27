"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import {
  useIssue,
  useMarkIssueResolved,
  useMarkIssueClosed,
  useMarkIssueInProgress,
} from "@/modules/dataCatalogue/controllers/issueController";
import { IssueStatus, ISSUE_TYPE_OPTIONS, ISSUE_STATUS_LABELS } from "../types/issue";

const resolveSchema = z.object({
  resolution_notes: z.string().min(10, "Resolution notes must be at least 10 characters"),
});

const closeSchema = z.object({
  closure_notes: z.string().min(10, "Closure notes must be at least 10 characters"),
});

interface IssueDetailModalProps {
  issueId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function IssueDetailModal({
  issueId,
  open,
  onOpenChange,
}: IssueDetailModalProps) {
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [showCloseForm, setShowCloseForm] = useState(false);

  const { data: issueData, isLoading, isError } = useIssue(issueId || "", !!issueId && open);
  const { mutate: markResolved, isPending: isResolving } = useMarkIssueResolved();
  const { mutate: markClosed, isPending: isClosing } = useMarkIssueClosed();
  const { mutate: markInProgress, isPending: isMarkingInProgress } = useMarkIssueInProgress();

  const resolveForm = useForm({
    resolver: zodResolver(resolveSchema),
    defaultValues: { resolution_notes: "" },
  });

  const closeForm = useForm({
    resolver: zodResolver(closeSchema),
    defaultValues: { closure_notes: "" },
  });

  const issue = issueData;

  const handleMarkInProgress = () => {
    if (!issueId) return;
    markInProgress(issueId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleMarkResolved = (data: { resolution_notes: string }) => {
    if (!issueId) return;
    markResolved(
      { id: issueId, resolution_notes: data.resolution_notes },
      {
        onSuccess: () => {
          setShowResolveForm(false);
          resolveForm.reset();
          onOpenChange(false);
        },
      }
    );
  };

  const handleMarkClosed = (data: { closure_notes: string }) => {
    if (!issueId) return;
    markClosed(
      { id: issueId, closure_notes: data.closure_notes },
      {
        onSuccess: () => {
          setShowCloseForm(false);
          closeForm.reset();
          onOpenChange(false);
        },
      }
    );
  };

  const getIssueTypeLabel = (type: string): string => {
    const option = ISSUE_TYPE_OPTIONS.find((opt) => opt.value === type);
    return option?.label || type;
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

  const handleClose = () => {
    setShowResolveForm(false);
    setShowCloseForm(false);
    resolveForm.reset();
    closeForm.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Issue Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-600 mt-4">Loading issue details...</p>
          </div>
        )}

        {isError && (
          <div className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-600">Failed to load issue details</p>
          </div>
        )}

        {issue && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="border-b pb-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {issue.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge
                      status={ISSUE_STATUS_LABELS[issue.status]}
                      className={getStatusBadgeClass(issue.status)}
                    />
                    <span className="text-sm text-gray-600">
                      {getIssueTypeLabel(issue.issue_type)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      Severity: {issue.severity_level}
                    </span>
                    {issue.days_overdue > 0 && (
                      <span className="text-sm text-red-600 font-medium">
                        {issue.days_overdue} days overdue
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    Created by {issue.created_by.first_name} {issue.created_by.last_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(issue.created_datetime)}</span>
                </div>
                {issue.due_date && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {formatDate(issue.due_date)}</span>
                  </div>
                )}
                {issue.next_review_date && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Next Review: {formatDate(issue.next_review_date)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dataset Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Dataset Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  <span className="font-medium">{issue.dataset.name}</span>
                </p>
                <p>
                  <span className="text-gray-600">Reference:</span>{" "}
                  <span className="font-medium">{issue.dataset.reference}</span>
                </p>
                {issue.dataset.description && (
                  <p>
                    <span className="text-gray-600">Description:</span>{" "}
                    <span>{issue.dataset.description}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
            </div>

            {/* Attachments */}
            {issue.attachments && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                <p className="text-sm text-gray-600">{issue.attachments}</p>
              </div>
            )}


            {/* Status Action Forms */}
            {showResolveForm && (
              <form
                onSubmit={resolveForm.handleSubmit(handleMarkResolved)}
                className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-4"
              >
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Mark as Resolved
                </h4>
                <div>
                  <Label htmlFor="resolution_notes">
                    Resolution Notes <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="resolution_notes"
                    placeholder="Describe how this issue was resolved..."
                    rows={4}
                    {...resolveForm.register("resolution_notes")}
                    className="mt-1"
                  />
                  {resolveForm.formState.errors.resolution_notes && (
                    <p className="text-sm text-red-600 mt-1">
                      {resolveForm.formState.errors.resolution_notes.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isResolving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isResolving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resolving...
                      </>
                    ) : (
                      "Confirm Resolution"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowResolveForm(false)}
                    disabled={isResolving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {showCloseForm && (
              <form
                onSubmit={closeForm.handleSubmit(handleMarkClosed)}
                className="border border-gray-300 bg-gray-50 rounded-lg p-4 space-y-4"
              >
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-gray-600" />
                  Close Issue
                </h4>
                <div>
                  <Label htmlFor="closure_notes">
                    Closure Notes <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="closure_notes"
                    placeholder="Explain why this issue is being closed..."
                    rows={4}
                    {...closeForm.register("closure_notes")}
                    className="mt-1"
                  />
                  {closeForm.formState.errors.closure_notes && (
                    <p className="text-sm text-red-600 mt-1">
                      {closeForm.formState.errors.closure_notes.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isClosing}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    {isClosing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Closing...
                      </>
                    ) : (
                      "Confirm Close"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCloseForm(false)}
                    disabled={isClosing}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Action Buttons */}
            {!showResolveForm && !showCloseForm && (
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {issue.status === IssueStatus.OPEN && (
                  <>
                    <Button
                      onClick={handleMarkInProgress}
                      disabled={isMarkingInProgress}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      {isMarkingInProgress ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Mark In Progress
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowResolveForm(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </Button>
                    <Button
                      onClick={() => setShowCloseForm(true)}
                      variant="outline"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Close Issue
                    </Button>
                  </>
                )}

                {issue.status === IssueStatus.IN_PROGRESS && (
                  <>
                    <Button
                      onClick={() => setShowResolveForm(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </Button>
                    <Button
                      onClick={() => setShowCloseForm(true)}
                      variant="outline"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Close Issue
                    </Button>
                  </>
                )}

                {(issue.status === IssueStatus.RESOLVED || issue.status === IssueStatus.CLOSED) && (
                  <div className="text-sm text-gray-600">
                    This issue has been {issue.status.toLowerCase()}.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
