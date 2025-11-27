import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/http";
import { WORKFLOW_ROUTES } from "@/constants/workflow-api-routes";
import type {
  WorkflowListResponse,
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WorkflowFilters,
} from "@/modules/workflows/types/workflow";

export const workflowService = {
  /**
   * Get list of workflows with pagination and filters
   */
  async getWorkflows(filters?: WorkflowFilters): Promise<IResponse<WorkflowListResponse>> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.dataset_type) params.append("dataset_type", filters.dataset_type);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.page_size) params.append("page_size", filters.page_size.toString());

    const url = `${WORKFLOW_ROUTES.LIST}${params.toString() ? `?${params}` : ""}`;
    const response = await apiClient.get<IResponse<WorkflowListResponse>>(url);
    return response.data;
  },

  /**
   * Get single workflow by ID
   */
  async getWorkflowById(id: string): Promise<IResponse<Workflow>> {
    const response = await apiClient.get<IResponse<Workflow>>(WORKFLOW_ROUTES.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create a new workflow
   */
  async createWorkflow(data: CreateWorkflowRequest): Promise<IResponse<Workflow>> {
    const response = await apiClient.post<IResponse<Workflow>>(WORKFLOW_ROUTES.CREATE, data);
    return response.data;
  },

  /**
   * Update an existing workflow
   */
  async updateWorkflow(id: string, data: UpdateWorkflowRequest): Promise<IResponse<Workflow>> {
    const response = await apiClient.put<IResponse<Workflow>>(WORKFLOW_ROUTES.UPDATE(id), data);
    return response.data;
  },

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: string): Promise<IResponse<void>> {
    const response = await apiClient.delete<IResponse<void>>(WORKFLOW_ROUTES.DELETE(id));
    return response.data;
  },
};
