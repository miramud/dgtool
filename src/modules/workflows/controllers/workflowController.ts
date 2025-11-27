import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { workflowService } from "@/services/workflow";
import type {
  WorkflowFilters,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
} from "@/modules/workflows/types/workflow";

const QUERY_KEYS = {
  workflows: "workflows",
  workflowById: (id: string) => ["workflows", id] as const,
};

/**
 * Hook to fetch list of workflows
 */
export const useWorkflows = (filters?: WorkflowFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.workflows, filters],
    queryFn: () => workflowService.getWorkflows(filters),
    select: (data) => data.data,
  });
};

/**
 * Hook to fetch single workflow by ID
 */
export const useWorkflowById = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.workflowById(id),
    queryFn: () => workflowService.getWorkflowById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

/**
 * Hook to create a new workflow
 */
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkflowRequest) => workflowService.createWorkflow(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workflows] });
      toast.success(response.message || "Workflow created successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create workflow";
      toast.error(message);
    },
  });
};

/**
 * Hook to update an existing workflow
 */
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkflowRequest }) =>
      workflowService.updateWorkflow(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workflows] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workflowById(variables.id) });
      toast.success(response.message || "Workflow updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update workflow";
      toast.error(message);
    },
  });
};

/**
 * Hook to delete a workflow
 */
export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowService.deleteWorkflow(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workflows] });
      toast.success(response.message || "Workflow deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete workflow";
      toast.error(message);
    },
  });
};
