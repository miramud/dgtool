import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";

const QUERY_KEYS = {
  stats: "dashboard-stats",
  businessDomainChart: "dashboard-business-domain-chart",
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.stats],
    queryFn: () => dashboardService.getStats(),
    select: (data) => data.data,
  });
};

export const useBusinessDomainChart = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.businessDomainChart],
    queryFn: () => dashboardService.getBusinessDomainChart(),
    select: (data) => data.data,
  });
};
