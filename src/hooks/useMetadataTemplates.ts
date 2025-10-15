import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { metadataTemplateService } from "@/services/metadata-template";
import {
  // MetadataTemplate,
  CreateMetadataTemplateRequest,
  UpdateMetadataTemplateRequest,
  MetadataTemplateFilters,
} from "@/types/metadata-template";

const QUERY_KEYS = {
  templates: "metadata-templates",
  template: (id: string) => ["metadata-template", id],
} as const;

export const useMetadataTemplates = (filters?: MetadataTemplateFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.templates, filters],
    queryFn: () => metadataTemplateService.getTemplates(filters),
    select: (data) => data.data,
  });
};

export const useMetadataTemplate = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.template(id),
    queryFn: () => metadataTemplateService.getTemplateById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateMetadataTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMetadataTemplateRequest) =>
      metadataTemplateService.createTemplate(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.templates] });
      toast.success(response.message || "Template created successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create template";
      toast.error(message);
    },
  });
};

export const useUpdateMetadataTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMetadataTemplateRequest;
    }) => metadataTemplateService.updateTemplate(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.templates] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.template(id) });
      toast.success(response.message || "Template updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update template";
      toast.error(message);
    },
  });
};

export const usePartialUpdateMetadataTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<UpdateMetadataTemplateRequest>;
    }) => metadataTemplateService.partialUpdateTemplate(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.templates] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.template(id) });
      toast.success(response.message || "Template updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update template";
      toast.error(message);
    },
  });
};

export const useDeleteMetadataTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => metadataTemplateService.deleteTemplate(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.templates] });
      toast.success(response.message || "Template deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete template";
      toast.error(message);
    },
  });
};

export const useActivateMetadataTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => metadataTemplateService.activateTemplate(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.templates] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.template(id) });
      toast.success(response.message || "Template activated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to activate template";
      toast.error(message);
    },
  });
};

export const useDeactivateMetadataTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => metadataTemplateService.deactivateTemplate(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.templates] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.template(id) });
      toast.success(response.message || "Template deactivated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to deactivate template";
      toast.error(message);
    },
  });
};
