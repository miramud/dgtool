// Task status enum
export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  APPROVED = "approved",
  REJECTED = "rejected",
  CHANGES_REQUESTED = "changes_requested",
}

// Workflow step status
export enum StepStatus {
  NOT_STARTED = "not_started",
  PENDING = "pending",
  COMPLETED = "completed",
  SKIPPED = "skipped",
}

// Task action types
export type TaskActionType =
  | "upload_dataset"
  | "update_metadata"
  | "edit_template"
  | "delete_dataset"
  | "assign_steward"
  | "export_data"
  | "grant_access";

// Task workflow step interface (different from workflow.ts WorkflowStep)
export interface TaskWorkflowStep {
  stepNumber: number;
  name: string;
  status: StepStatus;
  approver?: string;
  approverRole?: string;
  completedAt?: string;
  completedBy?: string;
}

// Approver interface for task
export interface TaskApprover {
  name: string;
  role: string;
}

// Main Task interface
export interface Task {
  id: string;
  actionType: TaskActionType;
  datasetName: string;
  datasetId: string;
  status: TaskStatus;
  assignees: TaskApprover[];
  requester: string;
  requesterRole: string;
  dateSubmitted: string;
  dueDate?: string;
  workflowSteps: TaskWorkflowStep[];
  currentStep: number;
  notes?: string;
  history?: TaskHistoryEntry[];
}

// Task history entry for audit log
export interface TaskHistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details?: string;
}

// Task action type labels
export const TASK_ACTION_TYPE_LABELS: Record<TaskActionType, string> = {
  upload_dataset: "Upload Dataset",
  update_metadata: "Update Metadata",
  edit_template: "Edit Template",
  delete_dataset: "Delete Dataset",
  assign_steward: "Assign Steward",
  export_data: "Export Data",
  grant_access: "Grant Access",
};

// Task status labels
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "Pending",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.APPROVED]: "Approved",
  [TaskStatus.REJECTED]: "Rejected",
  [TaskStatus.CHANGES_REQUESTED]: "Changes Requested",
};

// Task status config for styling
export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  [TaskStatus.PENDING]: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    dotColor: "bg-yellow-500",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    dotColor: "bg-blue-500",
  },
  [TaskStatus.APPROVED]: {
    label: "Approved",
    color: "text-green-700",
    bgColor: "bg-green-100",
    dotColor: "bg-green-500",
  },
  [TaskStatus.REJECTED]: {
    label: "Rejected",
    color: "text-red-700",
    bgColor: "bg-red-100",
    dotColor: "bg-red-500",
  },
  [TaskStatus.CHANGES_REQUESTED]: {
    label: "Changes Requested",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    dotColor: "bg-orange-500",
  },
};

// Step status labels
export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  [StepStatus.NOT_STARTED]: "Not Started",
  [StepStatus.PENDING]: "Pending",
  [StepStatus.COMPLETED]: "Completed",
  [StepStatus.SKIPPED]: "Skipped",
};
