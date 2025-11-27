import {
  Task,
  TaskStatus,
  StepStatus,
  TaskActionType,
  TASK_ACTION_TYPE_LABELS,
} from "../types/task";

// Current user for filtering (in real app, get from auth context)
export const CURRENT_USER = "Mary Smith";
export const CURRENT_USER_ROLE = "Steward";

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: "WF-1042",
    actionType: "upload_dataset",
    datasetName: "Well Production Data - Block A",
    datasetId: "ds-001",
    status: TaskStatus.PENDING,
    assignees: [
      { name: "Mary Smith", role: "Steward" },
      { name: "Jane Lee", role: "Compliance" },
    ],
    requester: "Richard Okon",
    requesterRole: "Production Engineer",
    dateSubmitted: "2025-08-18T14:32:00Z",
    dueDate: "2025-08-20",
    currentStep: 1,
    workflowSteps: [
      {
        stepNumber: 1,
        name: "Steward Review",
        status: StepStatus.PENDING,
        approver: "Mary Smith",
        approverRole: "Steward",
      },
      {
        stepNumber: 2,
        name: "Compliance Review",
        status: StepStatus.NOT_STARTED,
        approver: "Jane Lee",
        approverRole: "Compliance",
      },
      {
        stepNumber: 3,
        name: "Publish",
        status: StepStatus.NOT_STARTED,
      },
    ],
    history: [
      {
        id: "h1",
        action: "Task Created",
        performedBy: "Richard Okon",
        performedAt: "2025-08-18T14:32:00Z",
        details: "Submitted upload dataset request",
      },
    ],
  },
  {
    id: "WF-1038",
    actionType: "update_metadata",
    datasetName: "Reservoir Simulation Results Q2",
    datasetId: "ds-002",
    status: TaskStatus.PENDING,
    assignees: [{ name: "John Doe", role: "Owner" }],
    requester: "Sarah Johnson",
    requesterRole: "Data Analyst",
    dateSubmitted: "2025-08-15T09:21:00Z",
    currentStep: 1,
    workflowSteps: [
      {
        stepNumber: 1,
        name: "Owner Review",
        status: StepStatus.PENDING,
        approver: "John Doe",
        approverRole: "Owner",
      },
      {
        stepNumber: 2,
        name: "Publish",
        status: StepStatus.NOT_STARTED,
      },
    ],
    history: [
      {
        id: "h2",
        action: "Task Created",
        performedBy: "Sarah Johnson",
        performedAt: "2025-08-15T09:21:00Z",
        details: "Submitted metadata update request",
      },
    ],
  },
  {
    id: "WF-1035",
    actionType: "edit_template",
    datasetName: "Seismic Survey Metadata Template",
    datasetId: "ds-003",
    status: TaskStatus.PENDING,
    assignees: [{ name: "Jane Lee", role: "Compliance" }],
    requester: "Mike Chen",
    requesterRole: "Geophysicist",
    dateSubmitted: "2025-08-14T10:15:00Z",
    dueDate: "2025-08-16",
    currentStep: 1,
    workflowSteps: [
      {
        stepNumber: 1,
        name: "Compliance Review",
        status: StepStatus.PENDING,
        approver: "Jane Lee",
        approverRole: "Compliance",
      },
      {
        stepNumber: 2,
        name: "Publish",
        status: StepStatus.NOT_STARTED,
      },
    ],
    history: [
      {
        id: "h3",
        action: "Task Created",
        performedBy: "Mike Chen",
        performedAt: "2025-08-14T10:15:00Z",
        details: "Submitted template edit request",
      },
    ],
  },
  {
    id: "WF-1030",
    actionType: "grant_access",
    datasetName: "Drilling Operations Log 2024",
    datasetId: "ds-004",
    status: TaskStatus.APPROVED,
    assignees: [
      { name: "Mary Smith", role: "Steward" },
      { name: "Admin User", role: "Admin" },
    ],
    requester: "Emily Davis",
    requesterRole: "Junior Analyst",
    dateSubmitted: "2025-08-10T11:00:00Z",
    dueDate: "2025-08-12",
    currentStep: 3,
    workflowSteps: [
      {
        stepNumber: 1,
        name: "Steward Review",
        status: StepStatus.COMPLETED,
        approver: "Mary Smith",
        approverRole: "Steward",
        completedAt: "2025-08-10T15:30:00Z",
        completedBy: "Mary Smith",
      },
      {
        stepNumber: 2,
        name: "Admin Approval",
        status: StepStatus.COMPLETED,
        approver: "Admin User",
        approverRole: "Admin",
        completedAt: "2025-08-11T09:45:00Z",
        completedBy: "Admin User",
      },
      {
        stepNumber: 3,
        name: "Access Granted",
        status: StepStatus.COMPLETED,
        completedAt: "2025-08-11T09:45:00Z",
      },
    ],
    history: [
      {
        id: "h4",
        action: "Task Created",
        performedBy: "Emily Davis",
        performedAt: "2025-08-10T11:00:00Z",
        details: "Submitted access request",
      },
      {
        id: "h5",
        action: "Approved by Steward",
        performedBy: "Mary Smith",
        performedAt: "2025-08-10T15:30:00Z",
        details: "First level approval completed",
      },
      {
        id: "h6",
        action: "Approved by Admin",
        performedBy: "Admin User",
        performedAt: "2025-08-11T09:45:00Z",
        details: "Final approval - access granted",
      },
    ],
  },
  {
    id: "WF-1028",
    actionType: "delete_dataset",
    datasetName: "Legacy Production Reports",
    datasetId: "ds-005",
    status: TaskStatus.REJECTED,
    assignees: [{ name: "John Doe", role: "Owner" }],
    requester: "Tom Wilson",
    requesterRole: "Data Manager",
    dateSubmitted: "2025-08-08T14:20:00Z",
    currentStep: 1,
    workflowSteps: [
      {
        stepNumber: 1,
        name: "Owner Review",
        status: StepStatus.COMPLETED,
        approver: "John Doe",
        approverRole: "Owner",
        completedAt: "2025-08-09T10:00:00Z",
        completedBy: "John Doe",
      },
    ],
    history: [
      {
        id: "h7",
        action: "Task Created",
        performedBy: "Tom Wilson",
        performedAt: "2025-08-08T14:20:00Z",
        details: "Submitted delete request",
      },
      {
        id: "h8",
        action: "Rejected",
        performedBy: "John Doe",
        performedAt: "2025-08-09T10:00:00Z",
        details: "Dataset still in active use by multiple departments",
      },
    ],
  },
  {
    id: "WF-1025",
    actionType: "upload_dataset",
    datasetName: "Environmental Impact Assessment",
    datasetId: "ds-006",
    status: TaskStatus.CHANGES_REQUESTED,
    assignees: [{ name: "Jane Lee", role: "Compliance" }],
    requester: "Mary Smith",
    requesterRole: "Steward",
    dateSubmitted: "2025-08-05T09:00:00Z",
    currentStep: 1,
    workflowSteps: [
      {
        stepNumber: 1,
        name: "Compliance Review",
        status: StepStatus.PENDING,
        approver: "Jane Lee",
        approverRole: "Compliance",
      },
      {
        stepNumber: 2,
        name: "Publish",
        status: StepStatus.NOT_STARTED,
      },
    ],
    history: [
      {
        id: "h9",
        action: "Task Created",
        performedBy: "Mary Smith",
        performedAt: "2025-08-05T09:00:00Z",
        details: "Submitted upload request",
      },
      {
        id: "h10",
        action: "Changes Requested",
        performedBy: "Jane Lee",
        performedAt: "2025-08-06T11:30:00Z",
        details: "Missing required environmental compliance fields",
      },
    ],
  },
  {
    id: "WF-1020",
    actionType: "assign_steward",
    datasetName: "Geological Survey Data 2024",
    datasetId: "ds-007",
    status: TaskStatus.IN_PROGRESS,
    assignees: [{ name: "Admin User", role: "Admin" }],
    requester: "John Doe",
    requesterRole: "Owner",
    dateSubmitted: "2025-08-01T16:45:00Z",
    currentStep: 1,
    workflowSteps: [
      {
        stepNumber: 1,
        name: "Admin Review",
        status: StepStatus.PENDING,
        approver: "Admin User",
        approverRole: "Admin",
      },
      {
        stepNumber: 2,
        name: "Assignment Complete",
        status: StepStatus.NOT_STARTED,
      },
    ],
    history: [
      {
        id: "h11",
        action: "Task Created",
        performedBy: "John Doe",
        performedAt: "2025-08-01T16:45:00Z",
        details: "Submitted steward assignment request",
      },
    ],
  },
];

// Helper function to get tasks assigned to current user (My Pending Tasks)
export const getMyPendingTasks = (userName: string = CURRENT_USER): Task[] => {
  return mockTasks.filter(
    (task) =>
      task.assignees.some((a) => a.name === userName) &&
      (task.status === TaskStatus.PENDING || task.status === TaskStatus.IN_PROGRESS)
  );
};

// Helper function to get tasks submitted by current user (My Submissions)
export const getMySubmissions = (userName: string = CURRENT_USER): Task[] => {
  return mockTasks.filter((task) => task.requester === userName);
};

// Helper function to get all tasks
export const getAllTasks = (): Task[] => {
  return mockTasks;
};

// Helper function to get task by ID
export const getTaskById = (taskId: string): Task | undefined => {
  return mockTasks.find((task) => task.id === taskId);
};

// Helper function to format action type
export const formatActionType = (actionType: TaskActionType): string => {
  return TASK_ACTION_TYPE_LABELS[actionType];
};

// Helper function to format assignees
export const formatAssignees = (assignees: { name: string; role: string }[]): string => {
  return assignees.map((a) => `${a.name} (${a.role})`).join(", ");
};

// Filter options for status
export const TASK_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: TaskStatus.PENDING, label: "Pending" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.APPROVED, label: "Approved" },
  { value: TaskStatus.REJECTED, label: "Rejected" },
  { value: TaskStatus.CHANGES_REQUESTED, label: "Changes Requested" },
];
