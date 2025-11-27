import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/http";
import { DASHBOARD_ROUTES } from "@/constants/dashboard-api-routes";
import { DashboardStats, ChartData } from "@/modules/dashboard/types/dashboard";

export const dashboardService = {
  async getStats(): Promise<IResponse<DashboardStats>> {
    const response = await apiClient.get<IResponse<DashboardStats>>(DASHBOARD_ROUTES.STATS);
    return response.data;
  },

  async getBusinessDomainChart(): Promise<IResponse<ChartData>> {
    const response = await apiClient.get<IResponse<ChartData>>(DASHBOARD_ROUTES.BUSINESS_DOMAIN_CHART);
    return response.data;
  },
};
