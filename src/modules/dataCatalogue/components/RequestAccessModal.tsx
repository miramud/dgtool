"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FormInput from "@/components/shared/FormInput";
import FormSelect from "@/components/shared/FormSelect";
import { useUserProfile } from "@/modules/userManagement/controllers/userController";
import type { DataCatalogue } from "../types/dataCatalogue";

interface RequestAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDataset: DataCatalogue | null;
  onSubmit?: (data: RequestAccessFormData) => void;
}

interface RequestAccessFormData {
  requesterName: string;
  datasetName: string;
  intendedUse: string;
  duration: string;
  status: string;
  statusRight: string;
  acknowledgment: boolean;
}

export default function RequestAccessModal({
  open,
  onOpenChange,
  selectedDataset,
  onSubmit
}: RequestAccessModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const { data: profile } = useUserProfile();

  const form = useForm<RequestAccessFormData>({
    defaultValues: {
      requesterName: "",
      datasetName: "",
      intendedUse: "",
      duration: "",
      status: "pending",
      statusRight: "pending",
      acknowledgment: false
    }
  });

  // Prefill form values when modal opens with selected dataset
  useEffect(() => {
    if (open && selectedDataset) {
      const requesterFullName = profile
        ? `${profile.first_name} ${profile.last_name}`
        : "";

      form.reset({
        requesterName: requesterFullName,
        datasetName: selectedDataset.name || "",
        intendedUse: "",
        duration: "",
        status: "pending",
        statusRight: "pending",
        acknowledgment: false
      });
      setAcknowledged(false);
    }
  }, [open, selectedDataset, profile, form]);

  const intendedUseOptions = [
    { value: "analytics", label: "Analytics" },
    { value: "reporting", label: "Reporting" },
    { value: "research", label: "Research" },
    { value: "development", label: "Development" }
  ];

  const durationOptions = [
    { value: "30_days", label: "30 Days" },
    { value: "60_days", label: "60 Days" },
    { value: "90_days", label: "90 Days" },
    { value: "6_months", label: "6 Months" },
    { value: "1_year", label: "1 Year" }
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ];

  const handleSubmit = (data: RequestAccessFormData) => {
    const formData = {
      ...data,
      acknowledgment: acknowledged
    };
    onSubmit?.(formData);
    onOpenChange(false);
    form.reset();
    setAcknowledged(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setAcknowledged(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Request Access</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-6">
            {/* Row 1: Requester Name and Dataset Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                name="requesterName"
                label="Requester Name"
                placeholder="Ibrahim Musa"
                required
                disabled
              />
              <FormInput
                name="datasetName"
                label="Dataset Name"
                placeholder="HR Employee Data"
                required
                disabled
              />
            </div>

            {/* Row 2: Intended Use and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                name="intendedUse"
                label="Intended Use"
                placeholder="Enter Intended Use"
                options={intendedUseOptions}
                required
              />
              <FormSelect
                name="duration"
                label="Duration"
                placeholder="Enter the duration"
                options={durationOptions}
                required
              />
            </div>

            {/* Row 3: Status fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                name="status"
                label="Status"
                placeholder="Select Status"
                options={statusOptions}
                required
                disabled
              />
              <FormSelect
                name="statusRight"
                label="Status"
                placeholder="Select Status"
                options={statusOptions}
                required
                disabled
              />
            </div>

            {/* Acknowledgment Checkbox */}
            <div className="flex items-start space-x-3 py-4">
              <Checkbox
                id="acknowledgment"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
              />
              <label
                htmlFor="acknowledgment"
                className="text-sm text-gray-700 leading-relaxed cursor-pointer"
              >
                I acknowledge that this dataset is classified as {selectedDataset?.sensitivity || "Confidential"} and agree to comply with company data usage policies.
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#4A4A7A] hover:bg-[#3A3A6A] px-8"
                disabled={!acknowledged}
              >
                Submit Request
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}