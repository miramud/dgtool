"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeactivateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string | null;
  onConfirm: () => void;
}

export default function DeactivateWorkflowModal({
  open,
  onOpenChange,
  workflowId,
  onConfirm,
}: DeactivateWorkflowModalProps) {
  if (!workflowId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-semibold">
              Delete Workflow
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete this workflow?
            <span className="block mt-2 text-red-600">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 pt-4">
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
