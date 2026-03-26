import { useQuery } from "@tanstack/react-query";
import { dashboardService, DashboardDateFilter } from "@/services/dashboard";

const QUERY_KEYS = {
  stats: "dashboard-stats",
  businessDomainChart: "dashboard-business-domain-chart",
};

export const useDashboardStats = (filters?: DashboardDateFilter) => {
  return useQuery({
    queryKey: [QUERY_KEYS.stats, filters],
    queryFn: () => dashboardService.getStats(filters),
    select: (data) => data.data,
  });
};

export const useBusinessDomainChart = (filters?: DashboardDateFilter) => {
  return useQuery({
    queryKey: [QUERY_KEYS.businessDomainChart, filters],
    queryFn: () => dashboardService.getBusinessDomainChart(filters),
    select: (data) => data.data,
  });
};
