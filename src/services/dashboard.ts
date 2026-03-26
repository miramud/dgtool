import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/http";
import { DASHBOARD_ROUTES } from "@/constants/dashboard-api-routes";
import { DashboardStats, ChartData } from "@/modules/dashboard/types/dashboard";

export interface DashboardDateFilter {
  start_date?: string;
  end_date?: string;
}

export const dashboardService = {
  async getStats(filters?: DashboardDateFilter): Promise<IResponse<DashboardStats>> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    const url = `${DASHBOARD_ROUTES.STATS}${params.toString() ? `?${params}` : ""}`;
    const response = await apiClient.get<IResponse<DashboardStats>>(url);
    return response.data;
  },

  async getBusinessDomainChart(filters?: DashboardDateFilter): Promise<IResponse<ChartData>> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    const url = `${DASHBOARD_ROUTES.BUSINESS_DOMAIN_CHART}${params.toString() ? `?${params}` : ""}`;
    const response = await apiClient.get<IResponse<ChartData>>(url);
    return response.data;
  },
};
