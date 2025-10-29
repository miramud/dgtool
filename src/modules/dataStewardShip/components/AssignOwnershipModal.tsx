"use client";
import { useState } from "react";
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

const assignOwnershipSchema = z.object({
  dataset_id: z.string().min(1, "Please select a dataset"),
  data_owners: z
    .array(z.string())
    .min(1, "Please select at least one data owner"),
  stewards: z.array(z.string()).min(1, "Please select at least one steward"),
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
      dataset_id: "",
      data_owners: [],
      stewards: [],
      description: "",
    },
  });

  const handleSubmit = (data: AssignOwnershipFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleCancel = () => {
    // Check if form has any values
    const formValues = form.getValues();
    const hasData = formValues.dataset_id || 
                   formValues.data_owners.length > 0 || 
                   formValues.stewards.length > 0 || 
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

  // Mock data - replace with actual API calls
  const datasetOptions = [
    { value: "1", label: "Customer Analytics Dataset" },
    { value: "2", label: "Sales Performance Data" },
    { value: "3", label: "Employee Management System" },
    { value: "4", label: "Financial Reports Database" },
    { value: "5", label: "Product Inventory Data" },
  ];

  const dataOwnerOptions = [
    { value: "1", label: "John Smith (Data Manager)" },
    { value: "2", label: "Sarah Johnson (Analytics Lead)" },
    { value: "3", label: "Michael Brown (IT Director)" },
    { value: "4", label: "Emily Davis (Finance Manager)" },
    { value: "5", label: "David Wilson (Operations Head)" },
  ];

  const stewardOptions = [
    { value: "1", label: "Alice Cooper (Data Analyst)" },
    { value: "2", label: "Bob Martinez (Business Analyst)" },
    { value: "3", label: "Carol White (Data Scientist)" },
    { value: "4", label: "Daniel Lee (System Administrator)" },
    { value: "5", label: "Eva Rodriguez (Quality Analyst)" },
  ];

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
                  name='dataset_id'
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
                  name='stewards'
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
                  disabled={isLoading}
                >
                  {isLoading ? "Assigning..." : "Assign Ownership"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={handleCancelDismiss}>
        <DialogContent className="max-w-2xl">
          <div className="p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              Are you sure you want to exit? Unsaved data will be lost.
            </h2>

            <div className="space-y-4">
              <Button 
                onClick={handleCancelDismiss}
                className="w-full bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white"
              >
                Continue Editing
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleCancelConfirm}
                className="w-full font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
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
