"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Task,
  TASK_ACTION_TYPE_LABELS,
  TASK_STATUS_CONFIG,
  STEP_STATUS_LABELS,
  StepStatus,
} from "../types/task";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ViewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onApprove?: (task: Task) => void;
  onRequestChanges?: (task: Task) => void;
  onReject?: (task: Task) => void;
  showActions?: boolean;
}

export default function ViewTaskModal({
  open,
  onOpenChange,
  task,
  onApprove,
  onRequestChanges,
  onReject,
  showActions = true,
}: ViewTaskModalProps) {
  if (!task) return null;

  const statusConfig = TASK_STATUS_CONFIG[task.status];
  const isPending = task.status === "pending" || task.status === "in_progress";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Task {task.id} &ndash; Approval Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Task Details */}
          <div className="space-y-4">
            <DetailRow
              label="Action Type"
              value={TASK_ACTION_TYPE_LABELS[task.actionType]}
            />
            <DetailRow label="Dataset" value={task.datasetName} />
            <DetailRow
              label="Requester"
              value={`${task.requester} (${task.requesterRole})`}
            />
            <DetailRow
              label="Submitted On"
              value={formatDate(task.dateSubmitted, {
                format: "long",
                includeTime: true,
              })}
            />
            <div className="flex items-start">
              <span className="w-40 text-sm text-gray-600 font-medium">
                Status
              </span>
              <span className={`text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Assigned Approvers */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Assigned Approvers
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {task.assignees.map((assignee, index) => (
                <li key={index}>
                  {assignee.name} ({assignee.role})
                </li>
              ))}
            </ul>
          </div>

          {/* Workflow Progress Tracker */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Workflow Progress Tracker
            </h4>
            <ol className="space-y-2 text-sm">
              {task.workflowSteps.map((step) => (
                <li key={step.stepNumber} className="flex items-center gap-2">
                  <span className="text-gray-600">
                    {step.stepNumber}. Step {step.stepNumber}: {step.name}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <span
                    className={
                      step.status === StepStatus.COMPLETED
                        ? "text-green-600"
                        : step.status === StepStatus.PENDING
                          ? "text-yellow-600"
                          : "text-gray-500"
                    }
                  >
                    {STEP_STATUS_LABELS[step.status]}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Action Buttons */}
          {showActions && isPending && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={() => onApprove?.(task)}
                className="flex-1 bg-[#4A4A7A] hover:bg-[#3A3A6A]"
              >
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => onRequestChanges?.(task)}
                className="flex-1 border-orange-400 text-orange-600 hover:bg-orange-50"
              >
                Request Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => onReject?.(task)}
                className="flex-1 border-red-400 text-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
            </div>
          )}

          {/* Close button for non-pending tasks */}
          {(!showActions || !isPending) && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for detail rows
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start">
      <span className="w-40 text-sm text-gray-600 font-medium">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}
