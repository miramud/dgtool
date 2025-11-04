"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import { PolicyFormData, PolicyCategory } from "../types/policy";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { useGetStaffs } from "@/modules/userManagement/controllers/staffController";
import { policiesService } from "@/services/policies";
// import { BackendStaff } from "@/modules/userManagement/types/user";

interface PolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PolicyFormData, isDraft: boolean) => void;
  policy?: any; // For editing existing policies
}

export default function PolicyModal({
  open,
  onOpenChange,
  onSubmit,
  policy,
}: PolicyModalProps) {
  // console.log({ policy });

  const [formData, setFormData] = useState<PolicyFormData>({
    title: "",
    category: "",
    description: "",
    domains: "",
    dataOwner: "",
    effective_date: "",
    reviewDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);
  // const [staffOptions, setStaffOptions] = useState<BackendStaff[]>([]);

  // Get staff data for owner options
  const {
    getStaffs,
    data: staffData,
    isLoading: isLoadingStaff,
  } = useGetStaffs();

  // Mock data for dropdowns
  const domainOptions = [
    "All",
    "Finance",
    "HR",
    "Legal",
    "Compliance",
    "Engineering",
    "Analytics",
    "IT",
    "Security",
    "Marketing",
    "Operations",
  ];

  // Load staff data when component mounts
  useEffect(() => {
    if (open) {
      getStaffs();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Clear form data when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        category: "",
        description: "",
        domains: "",
        dataOwner: "",
        effective_date: "",
        reviewDate: "",
      });
    }
  }, [open]);

  // Fetch policy data when editing an existing policy
  useEffect(() => {
    const fetchPolicyData = async () => {
      if (!open || !policy?.id) {
        setPolicyError(null);
        return;
      }

      try {
        setIsLoadingPolicy(true);
        setPolicyError(null);
        const response = await policiesService.getPolicyById(policy.id);
        const fetchedPolicy = response.data;

        // console.log({ fetchedPolicy });

        // Update form data with fetched policy data
        setFormData({
          title: fetchedPolicy.title || "",
          category: fetchedPolicy.category || "",
          description: fetchedPolicy.description || "",
          domains: fetchedPolicy.domains || "",
          dataOwner: fetchedPolicy.owner.id || "",
          effective_date: fetchedPolicy.effective_date || "",
          reviewDate: fetchedPolicy.reviewDate || "",
        });
      } catch (err) {
        setPolicyError(
          err instanceof Error ? err.message : "Failed to fetch policy"
        );
        console.error("Error fetching policy:", err);
      } finally {
        setIsLoadingPolicy(false);
      }
    };

    fetchPolicyData();
  }, [open, policy?.id]);

  // // Update staff options when data is loaded
  // useEffect(() => {
  //   if (staffData?.status && staffData.data) {
  //     setStaffOptions(staffData.results);
  //   }
  // }, [staffData]);

  const staffOptions =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    staffData?.results?.map((staff: any) => ({
      value: staff.user?.id || staff.id,
      label: `${staff.user?.first_name || staff.first_name} ${
        staff.user?.last_name || staff.last_name
      } (${staff.user?.email || staff.email})`,
    })) || [];

  // console.log({ formData });

  const handleInputChange = (
    field: keyof PolicyFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (isDraft: boolean) => {
    setIsSubmitting(true);
    try {
      onSubmit(formData, isDraft);
      onOpenChange(false);
      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        domains: "",
        dataOwner: "",
        effective_date: "",
        reviewDate: "",
      });
    } catch (error) {
      console.error("Error submitting policy:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleDomainSelect = (domain: string) => {
  //   const currentDomains = formData.domains;
  //   if (currentDomains.includes(domain)) {
  //     handleInputChange(
  //       "domains",
  //       currentDomains.filter((d) => d !== domain)
  //     );
  //   } else {
  //     handleInputChange("domains", [...currentDomains, domain]);
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='pb-6'>
          <DialogTitle className='text-xl font-semibold'>
            {policy ? "Edit Policy" : "Assign Data Steward"}
          </DialogTitle>
        </DialogHeader>

        {/* Loading State */}
        {isLoadingPolicy && (
          <div className='flex items-center justify-center py-8'>
            <div className='text-sm text-gray-500'>Loading policy data...</div>
          </div>
        )}

        {/* Error State */}
        {policyError && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4'>
            Error loading policy: {policyError}
          </div>
        )}

        <div className='space-y-6'>
          {/* First Row - Policy Title & Category */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Policy Title
              </label>
              <Input
                placeholder='Enter policy title'
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className='h-12 border-gray-300'
                disabled={isLoadingPolicy}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Policy Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={isLoadingPolicy}
              >
                <SelectTrigger className='h-12 border-gray-300'>
                  <SelectValue placeholder='Enter policy category' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PolicyCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row - Domains & Owner */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Domains
              </label>
              <Select
                value={formData.domains}
                onValueChange={(value) => handleInputChange("domains", value)}
                disabled={isLoadingPolicy}
              >
                <SelectTrigger className='h-12 border-gray-300'>
                  <SelectValue placeholder='Select Domains' />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Owner
              </label>
              <Select
                value={formData.dataOwner}
                onValueChange={(value) => handleInputChange("dataOwner", value)}
                disabled={isLoadingPolicy}
              >
                <SelectTrigger className='h-12 border-gray-300'>
                  <SelectValue placeholder='Select Owner' />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingStaff ? (
                    <SelectItem value='loading' disabled>
                      Loading staff...
                    </SelectItem>
                  ) : (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    staffOptions.map((staff) => {
                      return (
                        <SelectItem key={staff.id} value={staff.value}>
                          {staff.label}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Third Row - Date */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Effective Date
              </label>
              <Input
                type='date'
                value={formData.effective_date}
                onChange={(e) =>
                  handleInputChange("effective_date", e.target.value)
                }
                className='h-12 border-gray-300'
                disabled={isLoadingPolicy}
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          {formData?.description && (
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Policy Content
              </label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) =>
                  handleInputChange("description", content)
                }
                placeholder='Enter policy content...'
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex gap-4 pt-4'>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || isLoadingPolicy}
              className='flex-1 h-12 bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white'
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || isLoadingPolicy}
              variant='outline'
              className='flex-1 h-12 border-gray-300'
            >
              <FileText className='w-4 h-4 mr-2' />
              {isSubmitting ? "Saving..." : "Save as draft"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
