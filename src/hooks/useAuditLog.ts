import { useQuery } from "@tanstack/react-query";
import { AUDIT_LOG_API_ROUTES } from "@/constants/audit-log-api-routes";
import { AuditLogResponse } from "@/types/audit-log";

export const useAuditLogs = (search?: string, page?: number, size?: number) => {
  return useQuery({
    queryKey: ["audit-logs", search, page, size],
    queryFn: async () => {
      const { axiosCallerWithToken } = await import("@/lib/helpers");

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (page) params.append("page", page.toString());
      if (size) params.append("size", size.toString());

      const url = `${AUDIT_LOG_API_ROUTES.GET_AUDIT_LOGS}${
        params.toString() ? `?${params}` : ""
      }`;

      const response = await axiosCallerWithToken.get<AuditLogResponse>(url);
      return response.data;
    },
  });
};
