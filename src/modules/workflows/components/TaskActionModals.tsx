"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Task } from "../types/task";

// Approve Task Modal
interface ApproveTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onConfirm: (task: Task, comment?: string) => void;
}

export function ApproveTaskModal({
  open,
  onOpenChange,
  task,
  onConfirm,
}: ApproveTaskModalProps) {
  const [comment, setComment] = useState("");

  if (!task) return null;

  const handleConfirm = () => {
    onConfirm(task, comment);
    setComment("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <DialogTitle className="text-lg font-semibold">
              Approve Task
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to approve task <strong>{task.id}</strong>?
            This will move the workflow to the next step.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="approve-comment" className="text-sm font-medium">
              Comment (optional)
            </Label>
            <Textarea
              id="approve-comment"
              placeholder="Add any notes or comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Request Changes Modal
interface RequestChangesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onConfirm: (task: Task, reason: string) => void;
}

export function RequestChangesModal({
  open,
  onOpenChange,
  task,
  onConfirm,
}: RequestChangesModalProps) {
  const [reason, setReason] = useState("");

  if (!task) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(task, reason);
    setReason("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-100">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <DialogTitle className="text-lg font-semibold">
              Request Changes
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Please specify what changes are required for task{" "}
            <strong>{task.id}</strong>. The requester will be notified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="changes-reason" className="text-sm font-medium">
              Reason for changes <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="changes-reason"
              placeholder="Describe what changes are needed..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
          >
            Request Changes
          </Button>
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reject Task Modal
interface RejectTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onConfirm: (task: Task, reason: string) => void;
}

export function RejectTaskModal({
  open,
  onOpenChange,
  task,
  onConfirm,
}: RejectTaskModalProps) {
  const [reason, setReason] = useState("");

  if (!task) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(task, reason);
    setReason("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-semibold">
              Reject Task
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to reject task <strong>{task.id}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reject-reason" className="text-sm font-medium">
              Reason for rejection <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reject-reason"
              placeholder="Explain why this task is being rejected..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            variant="destructive"
            className="flex-1"
          >
            Reject
          </Button>
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
