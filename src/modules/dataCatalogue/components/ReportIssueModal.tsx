"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Paperclip } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormSelect from "@/components/shared/FormSelect";
import FormTextarea from "@/components/shared/FormTextarea";
import { 
  ISSUE_TYPE_OPTIONS, 
  SEVERITY_LEVEL_OPTIONS,
  IssueType, 
  SeverityLevel,
  IssueStatus,
  ReportIssueFormData 
} from "../types/issue";
import { useCreateIssue } from "@/modules/dataCatalogue/controllers/issueController";
import { useUserProfile } from "@/modules/userManagement/controllers/userController";

const STATUS_OPTIONS = [
  { value: IssueStatus.OPEN, label: "Open" },
  { value: IssueStatus.IN_PROGRESS, label: "In Progress" },
  { value: IssueStatus.RESOLVED, label: "Resolved" },
  { value: IssueStatus.CLOSED, label: "Closed" },
];

const reportIssueSchema = z.object({
  title: z.string().min(1, "Issue title is required"),
  type: z.nativeEnum(IssueType, { message: "Please select an issue type" }),
  severity: z.nativeEnum(SeverityLevel, { message: "Please select a severity level" }),
  nextReviewDate: z.string().optional(),
  status: z.nativeEnum(IssueStatus, { message: "Please select a status" }),
  dueDate: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

interface ReportIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetId: string;
  datasetName: string;
}

export default function ReportIssueModal({
  open,
  onOpenChange,
  datasetId,
  datasetName: _datasetName,
}: ReportIssueModalProps) {
  void _datasetName;
  const { data: profile } = useUserProfile();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedIssueId, setSubmittedIssueId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate: createIssue, isPending } = useCreateIssue();

  // Get user info from profile endpoint
  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Loading...";

  const userRole = profile?.roles && profile.roles.length > 0
    ? profile.roles.map(r => r.name).join(", ")
    : "User";

  const form = useForm<ReportIssueFormData>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      title: "",
      type: undefined,
      severity: undefined,
      nextReviewDate: "",
      status: undefined,
      dueDate: "",
      description: "",
    },
  });

  const handleSubmit = (data: ReportIssueFormData) => {
    createIssue(
      {
        dataset: datasetId,
        title: data.title,
        issue_type: data.type,
        severity_level: data.severity,
        next_review_date: data.nextReviewDate || undefined,
        due_date: data.dueDate || undefined,
        description: data.description,
        attachments: selectedFile?.name,
      },
      {
        onSuccess: (response) => {
          setSubmittedIssueId(response.data.id);
          setIsSubmitted(true);
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => {
      setIsSubmitted(false);
      setSubmittedIssueId("");
      setSelectedFile(null);
      form.reset();
    }, 200);
  };

  const handleViewIssue = () => {
    // Navigate to issue detail page or open issue view
    console.log("View issue:", submittedIssueId);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Report Data Issue
          </DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          // Confirmation View
          <div className="py-6 space-y-6">
            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Issue submitted and resolved successfully
                </h3>
                <p className="text-sm text-gray-600">
                  Issue submitted. A resolution workflow has been triggered.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="w-full max-w-md"
                onClick={handleViewIssue}
              >
                View Issue
              </Button>
            </div>
          </div>
        ) : (
          // Form View
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
              {/* Name and Role (Read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    value={userName}
                    disabled
                    className="bg-gray-100 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <Input
                    value={userRole}
                    disabled
                    className="bg-gray-100 text-gray-700"
                  />
                </div>
              </div>

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
                  name="type"
                  label="Issue Type"
                  placeholder="Select issue type"
                  options={ISSUE_TYPE_OPTIONS}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Severity Level */}
                <FormSelect
                  name="severity"
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
                  name="nextReviewDate"
                  label="Next Review Date"
                  type="date"
                  placeholder="Enter your review date"
                />

                {/* Due Date */}
                <FormInput
                  name="dueDate"
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

              {/* Upload File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Choose a File or drag and drop it here (2MB)
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, DOCX, XLSX
                    </p>
                    <div className="pt-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          <Paperclip className="w-4 h-4" />
                          Select File
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.docx,.xlsx"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-gray-600 pt-2">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white"
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Submit Issue"}
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
