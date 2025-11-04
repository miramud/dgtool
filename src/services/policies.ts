import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/http";
import { POLICIES_ROUTES } from "@/constants/api-routes";
import { Policy, PolicyFormData } from "@/modules/policies/types/policy";

export interface PoliciesFilters {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  page_size?: number;
}

export interface PoliciesApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Policy[];
}

export interface CreatePolicyRequest extends PolicyFormData {
  status?: "Published" | "Draft";
}

export interface UpdatePolicyRequest extends Partial<PolicyFormData> {
  status?: "Published" | "Draft";
  is_draft?: boolean;
}

export const policiesService = {
  async getPolicies(filters?: PoliciesFilters): Promise<PoliciesApiResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size)
      params.append("page_size", String(filters.page_size));

    const queryString = params.toString();
    const url = `${POLICIES_ROUTES.LIST}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiClient.get<PoliciesApiResponse>(url);
    return response.data;
  },

  async createPolicy(data: CreatePolicyRequest): Promise<IResponse<Policy>> {
    const response = await apiClient.post<IResponse<Policy>>(
      POLICIES_ROUTES.CREATE,
      data
    );
    return response.data;
  },

  async getPolicyById(id: string): Promise<IResponse<Policy>> {
    const response = await apiClient.get<IResponse<Policy>>(
      POLICIES_ROUTES.GET_BY_ID(id)
    );
    return response.data;
  },

  async updatePolicy(
    id: string,
    data: UpdatePolicyRequest
  ): Promise<IResponse<Policy>> {
    const response = await apiClient.put<IResponse<Policy>>(
      POLICIES_ROUTES.UPDATE(id),
      data
    );
    return response.data;
  },

  async partialUpdatePolicy(
    id: string,
    data: Partial<UpdatePolicyRequest>
  ): Promise<IResponse<Policy>> {
    const response = await apiClient.patch<IResponse<Policy>>(
      POLICIES_ROUTES.PARTIAL_UPDATE(id),
      data
    );
    return response.data;
  },

  async deletePolicy(id: string): Promise<IResponse<void>> {
    const response = await apiClient.delete<IResponse<void>>(
      POLICIES_ROUTES.DELETE(id)
    );
    return response.data;
  },

  async publishPolicy(id: string): Promise<IResponse<Policy>> {
    return this.partialUpdatePolicy(id, { is_draft: false });
  },

  async unpublishPolicy(id: string): Promise<IResponse<Policy>> {
    return this.partialUpdatePolicy(id, { is_draft: true });
  },
};
