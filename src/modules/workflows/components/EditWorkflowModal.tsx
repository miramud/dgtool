"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import type { WorkflowAction } from "../types/workflow";
import { WORKFLOW_ACTION_LABELS } from "../types/workflow";
import { DATASET_TYPES } from "../data/mockWorkflows";

interface EditWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string | null;
}

const ACTION_OPTIONS: WorkflowAction[] = [
  "publish",
  "edit_metadata",
  "delete",
  "assign_steward",
  "export",
  "access_grant",
];

export default function EditWorkflowModal({
  open,
  onOpenChange,
}: EditWorkflowModalProps) {
  // TODO: Implement edit workflow with real API
  const workflow = null; // Placeholder
  const [workflowName, setWorkflowName] = useState("");
  const [selectedDatasetType, setSelectedDatasetType] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedActions, setSelectedActions] = useState<WorkflowAction[]>([]);
  const [approvers, setApprovers] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  // Initialize form with workflow data
  useEffect(() => {
    // TODO: Implement when workflow data is fetched from API
    // if (workflow) {
    //   setWorkflowName(workflow.name);
    //   setSelectedDatasetType(workflow.datasetTypes[0] || "");
    //   setIsActive(workflow.status === "active");
    //   setSelectedActions(workflow.actionsCovered);
    //   setApprovers(workflow.assignedApprovers);
    //   setEmail(workflow.createdBy?.email || "");
    // }
  }, [workflow]);

  const toggleAction = (action: WorkflowAction) => {
    setSelectedActions((prev) =>
      prev.includes(action)
        ? prev.filter((a) => a !== action)
        : [...prev, action]
    );
  };

  const addApprover = () => {
    const newApprover = {
      id: `new-${Date.now()}`,
      name: "",
      role: "",
      order: approvers.length + 1,
    };
    setApprovers([...approvers, newApprover]);
  };

  const removeApprover = (id: string) => {
    setApprovers(approvers.filter((a) => a.id !== id));
  };

  const handleSubmit = () => {
    // TODO: Implement workflow update API call
    // const data = {
    //   id: workflow?.id,
    //   name: workflowName,
    //   datasetTypes: [selectedDatasetType],
    //   actionsCovered: selectedActions,
    //   status: isActive,
    //   approvers,
    //   email,
    // };
    // onSubmit(data);
    console.log("Edit workflow - not yet implemented");
    handleOpenChange(false);
  };

  const resetForm = () => {
    setWorkflowName("");
    setSelectedDatasetType("");
    setIsActive(false);
    setSelectedActions([]);
    setApprovers([]);
    setEmail("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  // TODO: Remove this when workflow fetching is implemented
  // if (!workflow) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Workflow (Not Yet Implemented)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Workflow Name */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <Label className="text-sm font-medium text-gray-700">
              Workflow Name
            </Label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm bg-gray-100"
            />
          </div>

          {/* Dataset Types */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <Label className="text-sm font-medium text-gray-700">
              Dataset Types
            </Label>
            <Select
              value={selectedDatasetType}
              onValueChange={setSelectedDatasetType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select dataset type" />
              </SelectTrigger>
              <SelectContent>
                {DATASET_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Toggle */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* Actions Covered */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Actions Covered
            </Label>
            <div className="space-y-2 pl-2">
              {ACTION_OPTIONS.map((action) => (
                <div key={action} className="flex items-center gap-3">
                  <Checkbox
                    id={`action-${action}`}
                    checked={selectedActions.includes(action)}
                    onCheckedChange={() => toggleAction(action)}
                  />
                  <Label
                    htmlFor={`action-${action}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {WORKFLOW_ACTION_LABELS[action]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Approver Roles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Approver Roles
              </Label>
              <button
                type="button"
                onClick={addApprover}
                className="flex items-center gap-1 text-sm text-[#4A4A7A] hover:text-[#3A3A6A]"
              >
                <Plus className="w-4 h-4" />
                Add Approver
              </button>
            </div>

            {/* Approvers Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Field Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Type
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                      More
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {approvers.map((approver) => (
                    <tr key={approver.id} className="bg-white">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {approver.role}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {approver.name}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeApprover(approver.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm bg-gray-100"
              placeholder="Enter email"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#4A4A7A] hover:bg-[#3A3A6A]"
            >
              Update Workflow
            </Button>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Save as Draft
            </Button>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
