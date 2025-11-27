import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/http";
import { ISSUE_ROUTES } from "@/constants/issue-api-routes";
import {
  IssueListResponse,
  IssueDetail,
  CreateIssueRequest,
  UpdateIssueRequest,
  IssueFilters,
} from "@/modules/dataCatalogue/types/issue";

export const issueService = {
  async getIssues(filters?: IssueFilters): Promise<IResponse<IssueListResponse>> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append("search", filters.search);
    if (filters?.issue_type) params.append("issue_type", filters.issue_type);
    if (filters?.severity_level) params.append("severity_level", filters.severity_level);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.dataset) params.append("dataset", filters.dataset);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.page_size) params.append("page_size", filters.page_size.toString());

    const url = `${ISSUE_ROUTES.LIST}${params.toString() ? `?${params}` : ""}`;
    const response = await apiClient.get<IResponse<IssueListResponse>>(url);
    return response.data;
  },

  async getIssueById(id: string): Promise<IResponse<IssueDetail>> {
    const response = await apiClient.get<IResponse<IssueDetail>>(
      ISSUE_ROUTES.GET_BY_ID(id)
    );
    return response.data;
  },

  async createIssue(data: CreateIssueRequest): Promise<IResponse<IssueDetail>> {
    const response = await apiClient.post<IResponse<IssueDetail>>(
      ISSUE_ROUTES.CREATE,
      data
    );
    return response.data;
  },

  async updateIssue(
    id: string,
    data: UpdateIssueRequest
  ): Promise<IResponse<IssueDetail>> {
    const response = await apiClient.put<IResponse<IssueDetail>>(
      ISSUE_ROUTES.UPDATE(id),
      data
    );
    return response.data;
  },

  async deleteIssue(id: string): Promise<IResponse<void>> {
    const response = await apiClient.delete<IResponse<void>>(
      ISSUE_ROUTES.DELETE(id)
    );
    return response.data;
  },

  async markIssueResolved(id: string, resolution_notes: string): Promise<IResponse<IssueDetail>> {
    const response = await apiClient.post<IResponse<IssueDetail>>(
      ISSUE_ROUTES.MARK_RESOLVED(id),
      { resolution_notes }
    );
    return response.data;
  },

  async markIssueClosed(id: string, closure_notes: string): Promise<IResponse<IssueDetail>> {
    const response = await apiClient.post<IResponse<IssueDetail>>(
      ISSUE_ROUTES.MARK_CLOSED(id),
      { closure_notes }
    );
    return response.data;
  },

  async markIssueInProgress(id: string): Promise<IResponse<IssueDetail>> {
    const response = await apiClient.post<IResponse<IssueDetail>>(
      ISSUE_ROUTES.MARK_IN_PROGRESS(id)
    );
    return response.data;
  },
};
