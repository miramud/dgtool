"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/shared/FormSelect";
import FormMultiSelect from "@/components/shared/FormMultiSelect";
import FormTextarea from "@/components/shared/FormTextarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateDataGovernor } from "../controllers/dataGovernanceController";
import { useGetDataCatalogue } from "../controllers/dataCatalogueController";
import { useGetStaffs } from "@/modules/userManagement/controllers/staffController";

const assignOwnershipSchema = z.object({
  dataset: z.string().min(1, "Please select a dataset"),
  data_owners: z
    .array(z.string())
    .min(1, "Please select at least one data owner"),
  data_stewards: z
    .array(z.string())
    .min(1, "Please select at least one steward"),
  description: z.string().min(1, "Please provide a description"),
});

type AssignOwnershipFormData = z.infer<typeof assignOwnershipSchema>;

interface AssignOwnershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AssignOwnershipFormData) => void;
  isLoading?: boolean;
}

export default function AssignOwnershipModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: AssignOwnershipModalProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const form = useForm<AssignOwnershipFormData>({
    resolver: zodResolver(assignOwnershipSchema),
    defaultValues: {
      dataset: "",
      data_owners: [],
      data_stewards: [],
      description: "",
    },
  });

  const { createDataGovernor, isLoading: isCreating } = useCreateDataGovernor();
  const { data: datasets } = useGetDataCatalogue();
  const { data: staffsData, getStaffs } = useGetStaffs();

  // Fetch staffs when component mounts
  useEffect(() => {
    if (open) {
      getStaffs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async (data: AssignOwnershipFormData) => {
    try {
      // Transform form data to match API expected payload
      const payload = {
        dataset: data.dataset,
        data_owners: data.data_owners.map((userId) => ({
          is_eligible: true,
          user: userId,
        })),
        data_stewards: data.data_stewards.map((userId) => ({
          is_eligible: true,
          user: userId,
        })),
        description: data.description,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await createDataGovernor(payload);
      onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating data governor:", error);
    }
  };
  console.log({ staffsData });

  const handleCancel = () => {
    // Check if form has any values
    const formValues = form.getValues();
    const hasData =
      formValues.dataset ||
      formValues.data_owners.length > 0 ||
      formValues.data_stewards.length > 0 ||
      formValues.description;

    if (hasData) {
      setShowCancelModal(true);
    } else {
      form.reset();
      onOpenChange(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    form.reset();
    onOpenChange(false);
  };

  const handleCancelDismiss = () => {
    setShowCancelModal(false);
  };

  // Prepare options from API data
  const datasetOptions =
    datasets?.map((dataset: any) => ({
      value: dataset.id,
      label: dataset.name,
    })) || [];

  const staffOptions =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    staffsData?.results?.map((staff: any) => ({
      value: staff.user?.id || staff.id,
      label: `${staff.user?.first_name || staff.first_name} ${
        staff.user?.last_name || staff.last_name
      } (${staff.user?.email || staff.email})`,
    })) || [];

  const dataOwnerOptions = staffOptions;
  const stewardOptions = staffOptions;

  return (
    <>
      <Dialog open={open && !showCancelModal} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Assign Dataset Ownership</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-6'
            >
              <div className='grid grid-cols-1 gap-4'>
                {/* Dataset Selection */}
                <FormSelect
                  name='dataset'
                  label='Select Dataset'
                  placeholder='Choose a dataset'
                  options={datasetOptions}
                  required
                />

                {/* Data Owners Multi-Select */}
                <FormMultiSelect
                  name='data_owners'
                  label='Data Owners'
                  placeholder='Select data owners'
                  options={dataOwnerOptions}
                  required
                />

                {/* Stewards Multi-Select */}
                <FormMultiSelect
                  name='data_stewards'
                  label='Data Stewards'
                  placeholder='Select data stewards'
                  options={stewardOptions}
                  required
                />

                {/* Description */}
                <FormTextarea
                  name='description'
                  label='Description'
                  placeholder='Provide a description for this ownership assignment'
                  rows={4}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
                  disabled={isLoading || isCreating}
                >
                  {isLoading || isCreating
                    ? "Assigning..."
                    : "Assign Ownership"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={handleCancelDismiss}>
        <DialogContent className='max-w-2xl'>
          <div className='p-8 text-center'>
            <h2 className='text-xl font-medium text-gray-900 mb-8'>
              Are you sure you want to exit? Unsaved data will be lost.
            </h2>

            <div className='space-y-4'>
              <Button
                onClick={handleCancelDismiss}
                className='w-full bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white'
              >
                Continue Editing
              </Button>

              <Button
                variant='outline'
                onClick={handleCancelConfirm}
                className='w-full font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              >
                Exit without saving
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
