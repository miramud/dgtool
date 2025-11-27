"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWorkflowById } from "@/modules/workflows/controllers/workflowController";

interface ViewWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string | null;
}

export default function ViewWorkflowModal({
  open,
  onOpenChange,
  workflowId,
}: ViewWorkflowModalProps) {
  const { data: workflow, isLoading } = useWorkflowById(workflowId || "");

  if (!open || !workflowId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">View Workflow</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#4A4A7A]" />
          </div>
        ) : workflow ? (
          <div className="space-y-6 py-4">
            {/* Workflow Name */}
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700">Workflow Name</span>
              <span className="text-gray-900 text-right max-w-[60%]">
                {workflow.name}
              </span>
            </div>

            {/* Description */}
            {workflow.description && (
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-700">Description</span>
                <span className="text-gray-900 text-right max-w-[60%]">
                  {workflow.description}
                </span>
              </div>
            )}

            {/* Dataset Type */}
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700">Dataset Type</span>
              <span className="text-gray-900 text-right max-w-[60%]">
                {workflow.dataset_type.name}
              </span>
            </div>

            {/* Client */}
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700">Client</span>
              <span className="text-gray-900 text-right max-w-[60%]">
                {workflow.client.name}
              </span>
            </div>

            {/* Workflow Approvers */}
            <div className="space-y-2">
              <span className="font-medium text-gray-700">Workflow Approvers</span>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                {workflow.workflow_approvers
                  .sort((a, b) => a.approval_order - b.approval_order)
                  .map((wa) => (
                    <li key={wa.id} className="text-gray-900">
                      <span className="font-medium">{wa.role.name}</span> →{" "}
                      {wa.approver.first_name} {wa.approver.last_name}{" "}
                      <span className="text-gray-500 text-sm">
                        ({wa.approver.email})
                      </span>
                    </li>
                  ))}
              </ol>
            </div>

            {/* Created By */}
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700">Created By</span>
              <span className="text-gray-900 text-right max-w-[60%]">
                {workflow.created_by.first_name} {workflow.created_by.last_name}
              </span>
            </div>

            {/* Close Button */}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Workflow not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
