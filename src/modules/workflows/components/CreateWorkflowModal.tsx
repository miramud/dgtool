"use client";

import { useState } from "react";
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
import { Plus, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useCreateWorkflow } from "@/modules/workflows/controllers/workflowController";
import { useGetDatasetTypes } from "@/modules/metadataLibrary/controllers/datasetTypeController";

interface ApproverInput {
  id: string;
  approver: string; // Staff ID
  role: string; // Role ID
  approval_order: number;
}

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ORDINAL_LABELS = [
  "FIRST",
  "SECOND",
  "THIRD",
  "FOURTH",
  "FIFTH",
  "SIXTH",
  "SEVENTH",
  "EIGHTH",
  "NINTH",
  "TENTH",
];

const getApproverLevelText = (count: number): string => {
  if (count <= 1) return "";

  const levels = ORDINAL_LABELS.slice(0, count).map((label) => `${label} LEVEL`);

  if (levels.length === 2) {
    return `both ${levels[0]} and ${levels[1]}`;
  }

  const lastLevel = levels.pop();
  return `${levels.join(", ")}, and ${lastLevel}`;
};

export default function CreateWorkflowModal({
  open,
  onOpenChange,
}: CreateWorkflowModalProps) {
  const [workflowName, setWorkflowName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDatasetType, setSelectedDatasetType] = useState("");
  const [approvers, setApprovers] = useState<ApproverInput[]>([
    { id: "1", approver: "", role: "", approval_order: 1 },
  ]);
  const [understandConfirmation, setUnderstandConfirmation] = useState(false);

  // Fetch data
  const { mutate: createWorkflow, isPending } = useCreateWorkflow();
  const { data: datasetTypesData, isLoading: loadingDatasetTypes } = useGetDatasetTypes();

  // Fetch staffs using React Query
  const { data: staffsData, isLoading: loadingStaffs } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const { axiosCallerWithToken } = await import("@/lib/helpers");
      const { AUTH_API_ROUTES } = await import("@/constants/api-routes");
      const response = await axiosCallerWithToken.get(AUTH_API_ROUTES.STAFFS);
      return response.data;
    },
    enabled: open,
  });

  const datasetTypes = datasetTypesData?.data?.results || [];
  const staffs = staffsData?.data?.results || [];

  // Helper function to get role names for a staff member
  const getStaffRoleNames = (staffId: string): string => {
    const staff = staffs.find((s: any) => s.id === staffId);
    if (!staff || !staff.roles || staff.roles.length === 0) return "";
    return staff.roles.map((role: any) => role.name).join(", ");
  };

  const addApprover = () => {
    const newId = (approvers.length + 1).toString();
    setApprovers([...approvers, { id: newId, approver: "", role: "", approval_order: approvers.length + 1 }]);
  };

  const updateApprover = (id: string, value: string) => {
    setApprovers(
      approvers.map((a) => {
        if (a.id === id) {
          // When updating approver, auto-populate role from staff's first role
          const selectedStaff = staffs.find((s: any) => s.id === value);
          const staffRole = selectedStaff?.roles?.[0]?.id || "";
          return { ...a, approver: value, role: staffRole };
        }
        return a;
      })
    );
  };

  const handleSubmit = () => {
    const validApprovers = approvers.filter((a) => a.approver && a.role);

    createWorkflow(
      {
        name: workflowName,
        description: description || undefined,
        dataset_type: selectedDatasetType,
        approvers: validApprovers.map(a => ({
          approver: a.approver,
          role: a.role,
          approval_order: a.approval_order,
        })),
      },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      }
    );
  };

  const resetForm = () => {
    setWorkflowName("");
    setDescription("");
    setSelectedDatasetType("");
    setApprovers([{ id: "1", approver: "", role: "", approval_order: 1 }]);
    setUnderstandConfirmation(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const isValid =
    workflowName &&
    selectedDatasetType &&
    approvers.some((a) => a.approver && a.role) &&
    (approvers.length === 1 || understandConfirmation);

  const hasMultipleApprovers = approvers.filter((a) => a.approver && a.role).length > 1;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Workflow</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Row 1: Workflow Name and Dataset Type */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="workflow-name" className="text-sm font-medium">
                Workflow Name <span className="text-red-500">*</span>
              </Label>
              <input
                id="workflow-name"
                type="text"
                placeholder="Enter workflow name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataset-type" className="text-sm font-medium">
                Dataset Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedDatasetType}
                onValueChange={setSelectedDatasetType}
                disabled={loadingDatasetTypes}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingDatasetTypes ? "Loading..." : "Select dataset type"} />
                </SelectTrigger>
                <SelectContent>
                  {datasetTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Enter workflow description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm min-h-[80px]"
            />
          </div>

          {/* Row 3: First Approver */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Assign Approver <span className="text-red-500">*</span>
              </Label>
              <Select
                value={approvers[0]?.approver || ""}
                onValueChange={(value) => updateApprover("1", value)}
                disabled={loadingStaffs}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingStaffs ? "Loading..." : "Select approver"} />
                </SelectTrigger>
                <SelectContent>
                  {staffs.map((staff: any) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.user.first_name} {staff.user.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Approver Role(s) <span className="text-red-500">*</span>
              </Label>
              <input
                type="text"
                value={getStaffRoleNames(approvers[0]?.approver || "")}
                disabled
                placeholder="Roles will appear here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Additional Approvers */}
          {approvers.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Approver</h3>
              {approvers.slice(1).map((approver, index) => (
                <div key={approver.id} className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Assign Approver {index + 2}{" "}
                      <span className="text-gray-400 italic text-xs">
                        (This is the {index === 0 ? "second" : `${index + 2}th`} approver)
                      </span>
                    </Label>
                    <Select
                      value={approver.approver}
                      onValueChange={(value) =>
                        updateApprover(approver.id, value)
                      }
                      disabled={loadingStaffs}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffs.map((staff: any) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.user.first_name} {staff.user.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium invisible">Role(s)</Label>
                    <input
                      type="text"
                      value={getStaffRoleNames(approver.approver)}
                      disabled
                      placeholder="Roles will appear here"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm text-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Another Approver Button */}
          <button
            type="button"
            onClick={addApprover}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <Plus className="w-4 h-4" />
            Do you want to assign another approver?
          </button>

          {/* Confirmation Checkbox (only show when multiple approvers) */}
          {hasMultipleApprovers && (
            <div className="flex items-start gap-3 pt-4">
              <Checkbox
                id="understand"
                checked={understandConfirmation}
                onCheckedChange={(checked) =>
                  setUnderstandConfirmation(checked === true)
                }
              />
              <Label htmlFor="understand" className="text-sm text-gray-600">
                I understand that this workflow requires {getApproverLevelText(approvers.filter((a) => a.approver && a.role).length)} approver
              </Label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isPending}
              className="flex-1 bg-[#4A4A7A] hover:bg-[#3A3A6A] disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workflow"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
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
