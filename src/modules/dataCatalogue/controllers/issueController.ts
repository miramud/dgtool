import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { issueService } from "@/services/issue";
import {
  IssueFilters,
  CreateIssueRequest,
  UpdateIssueRequest,
} from "@/modules/dataCatalogue/types/issue";

const QUERY_KEYS = {
  issues: "issues",
  issue: "issue",
};

export const useIssues = (filters?: IssueFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.issues, filters],
    queryFn: () => issueService.getIssues(filters),
    select: (data) => data.data,
  });
};

export const useIssue = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.issue, id],
    queryFn: () => issueService.getIssueById(id),
    select: (data) => data.data,
    enabled: enabled && !!id,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateIssueRequest) => issueService.createIssue(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issues] });
      toast.success(response.message || "Issue created successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create issue";
      toast.error(message);
    },
  });
};

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIssueRequest }) =>
      issueService.updateIssue(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issues] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issue, variables.id] });
      toast.success(response.message || "Issue updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update issue";
      toast.error(message);
    },
  });
};

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => issueService.deleteIssue(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issues] });
      toast.success(response.message || "Issue deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete issue";
      toast.error(message);
    },
  });
};

export const useMarkIssueResolved = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, resolution_notes }: { id: string; resolution_notes: string }) =>
      issueService.markIssueResolved(id, resolution_notes),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issues] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issue, variables.id] });
      toast.success(response.message || "Issue marked as resolved");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to mark issue as resolved";
      toast.error(message);
    },
  });
};

export const useMarkIssueClosed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, closure_notes }: { id: string; closure_notes: string }) =>
      issueService.markIssueClosed(id, closure_notes),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issues] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issue, variables.id] });
      toast.success(response.message || "Issue marked as closed");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to mark issue as closed";
      toast.error(message);
    },
  });
};

export const useMarkIssueInProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => issueService.markIssueInProgress(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issues] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.issue, id] });
      toast.success(response.message || "Issue marked as in progress");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to mark issue as in progress";
      toast.error(message);
    },
  });
};
