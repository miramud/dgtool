"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormSelect from "@/components/shared/FormSelect";
import FormTextarea from "@/components/shared/FormTextarea";
import {
  ISSUE_TYPE_OPTIONS,
  SEVERITY_LEVEL_OPTIONS,
  IssueType,
  SeverityLevel,
  IssueStatus,
} from "../types/issue";
import { useIssue, useUpdateIssue } from "@/modules/dataCatalogue/controllers/issueController";

const STATUS_OPTIONS = [
  { value: IssueStatus.OPEN, label: "Open" },
  { value: IssueStatus.IN_PROGRESS, label: "In Progress" },
  { value: IssueStatus.RESOLVED, label: "Resolved" },
  { value: IssueStatus.CLOSED, label: "Closed" },
];

const updateIssueSchema = z.object({
  title: z.string().min(1, "Issue title is required"),
  issue_type: z.nativeEnum(IssueType, { message: "Please select an issue type" }),
  severity_level: z.nativeEnum(SeverityLevel, { message: "Please select a severity level" }),
  next_review_date: z.string().optional(),
  status: z.nativeEnum(IssueStatus, { message: "Please select a status" }),
  due_date: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type UpdateIssueFormData = z.infer<typeof updateIssueSchema>;

interface UpdateIssueModalProps {
  issueId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateIssueModal({
  issueId,
  open,
  onOpenChange,
}: UpdateIssueModalProps) {
  const { data: issueData, isLoading } = useIssue(issueId || "", !!issueId && open);
  const { mutate: updateIssue, isPending } = useUpdateIssue();

  const form = useForm<UpdateIssueFormData>({
    resolver: zodResolver(updateIssueSchema),
    defaultValues: {
      title: "",
      issue_type: undefined,
      severity_level: undefined,
      next_review_date: "",
      status: undefined,
      due_date: "",
      description: "",
    },
  });

  // Update form when issue data is loaded
  useEffect(() => {
    if (issueData) {
      form.reset({
        title: issueData.title,
        issue_type: issueData.issue_type,
        severity_level: issueData.severity_level,
        next_review_date: issueData.next_review_date || "",
        status: issueData.status,
        due_date: issueData.due_date || "",
        description: issueData.description,
      });
    }
  }, [issueData, form]);

  const handleSubmit = (data: UpdateIssueFormData) => {
    if (!issueId || !issueData) return;

    updateIssue(
      {
        id: issueId,
        data: {
          dataset: issueData.dataset.id,
          title: data.title,
          issue_type: data.issue_type,
          severity_level: data.severity_level,
          next_review_date: data.next_review_date || undefined,
          status: data.status,
          due_date: data.due_date || undefined,
          description: data.description,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Update Issue</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-600 mt-4">Loading issue details...</p>
          </div>
        ) : (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Issue Title */}
                <FormInput
                  name="title"
                  label="Issue Title"
                  placeholder="Enter issue title"
                  required
                />

                {/* Issue Type */}
                <FormSelect
                  name="issue_type"
                  label="Issue Type"
                  placeholder="Select issue type"
                  options={ISSUE_TYPE_OPTIONS}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Severity Level */}
                <FormSelect
                  name="severity_level"
                  label="Severity Level"
                  placeholder="Select Severity Level"
                  options={SEVERITY_LEVEL_OPTIONS}
                  required
                />

                {/* Status */}
                <FormSelect
                  name="status"
                  label="Status"
                  placeholder="Select Status"
                  options={STATUS_OPTIONS}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Next Review Date */}
                <FormInput
                  name="next_review_date"
                  label="Next Review Date"
                  type="date"
                  placeholder="Enter your review date"
                />

                {/* Due Date */}
                <FormInput
                  name="due_date"
                  label="Due Date"
                  type="date"
                  placeholder="Select Date"
                />
              </div>

              {/* Description */}
              <FormTextarea
                name="description"
                label="Description"
                placeholder="Enter a description"
                required
                rows={4}
              />

              {/* Buttons */}
              <div className="flex justify-between gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Issue"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
