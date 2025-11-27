// Types
export * from "./types/workflow";
export * from "./types/task";

// Data
export * from "./data/mockWorkflows";
export * from "./data/mockTasks";

// Components
export { default as CreateWorkflowModal } from "./components/CreateWorkflowModal";
export { default as ViewWorkflowModal } from "./components/ViewWorkflowModal";
export { default as ViewAsFlowCard } from "./components/ViewAsFlowCard";
export { default as EditWorkflowModal } from "./components/EditWorkflowModal";
export { default as ConfirmUpdateModal } from "./components/ConfirmUpdateModal";
export { default as DeactivateWorkflowModal } from "./components/DeactivateWorkflowModal";
export { default as ViewTaskModal } from "./components/ViewTaskModal";
export {
  ApproveTaskModal,
  RequestChangesModal,
  RejectTaskModal,
} from "./components/TaskActionModals";

// Views
export { default as WorkflowTemplates } from "./views/WorkflowTemplates";
export { default as TaskManager } from "./views/TaskManager";
