"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
interface ConfirmUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string | null;
  onConfirm: () => void;
}

export default function ConfirmUpdateModal({
  open,
  onOpenChange,
  workflowId,
  onConfirm,
}: ConfirmUpdateModalProps) {
  if (!workflowId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gray-50">
        <div className="flex flex-col items-center text-center py-6">
          {/* Success Icon */}
          <div className="mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Confirm Workflow Update
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            You are about to update this workflow
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full">
            <Button
              onClick={onConfirm}
              className="flex-1 bg-[#4A4A7A] hover:bg-[#3A3A6A]"
            >
              Confirm Update
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
