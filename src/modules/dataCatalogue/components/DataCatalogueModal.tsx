"use client";
import MultiStepDialog from "@/components/shared/MultiStepDialog";
import FormInput from "@/components/shared/FormInput";
import FormSelect from "@/components/shared/FormSelect";
import FormTextarea from "@/components/shared/FormTextarea";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataCatalogue, DataCatalogueFormData, createDataCatalogueSchema } from "../types/dataCatalogue";
import { useState, useEffect } from "react";

interface DataCatalogueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataCatalogue?: DataCatalogue | null;
}

export default function DataCatalogueModal({
  open,
  onOpenChange,
  dataCatalogue,
}: DataCatalogueModalProps) {
  const isEdit = !!dataCatalogue;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const form = useForm<DataCatalogueFormData>({
    resolver: zodResolver(createDataCatalogueSchema),
    defaultValues: {
      datasetName: dataCatalogue?.businessTechnicalSpecification || "",
      businessDomain: dataCatalogue?.businessDescription || "",
      tags: dataCatalogue?.tags?.join(", ") || "",
      sensitivity: "",
      description: dataCatalogue?.usageGuidelines || "",
      datasetType: dataCatalogue?.dataSource || "",
    },
  });

  // Reset form when dataCatalogue changes
  useEffect(() => {
    if (dataCatalogue) {
      form.reset({
        datasetName: dataCatalogue.businessTechnicalSpecification || "",
        businessDomain: dataCatalogue.businessDescription || "",
        tags: dataCatalogue.tags?.join(", ") || "",
        sensitivity: "",
        description: dataCatalogue.usageGuidelines || "",
        datasetType: dataCatalogue.dataSource || "",
      });
    } else {
      form.reset({
        datasetName: "",
        businessDomain: "",
        tags: "",
        sensitivity: "",
        description: "",
        datasetType: "",
      });
    }
  }, [dataCatalogue, form]);

  const metadataStep = {
    id: "metadata",
    // title: isEdit ? "Edit Metadata" : "Metadata",
    content: (
      <Form {...form}>
        <div>
          <h2 className="text-xl font-semibold mb-6">{isEdit ? "Edit Basic Metadata" : "Enter Basic Metadata"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="datasetName"
              label="Dataset Name"
              placeholder="Enter dataset's name"
            />
            <FormSelect
              name="businessDomain"
              label="Business Domain"
              placeholder="Select business's domain"
              options={[
                { value: "finance", label: "Finance" },
                { value: "hr", label: "HR" },
                { value: "operations", label: "Operations" },
                { value: "marketing", label: "Marketing" },
              ]}
            />
            <FormSelect
              name="tags"
              label="Tags"
              placeholder="Select Tags"
              options={[
                { value: "production", label: "Production" },
                { value: "seismic", label: "Seismic" },
                { value: "reservoir", label: "Reservoir" },
              ]}
            />
            <FormSelect
              name="sensitivity"
              label="Dataset Sensitivity"
              placeholder="Select Data's sensitivity"
              options={[
                { value: "public", label: "Public" },
                { value: "internal", label: "Internal" },
                { value: "confidential", label: "Confidential" },
                { value: "restricted", label: "Restricted" },
              ]}
            />
          </div>
          <div className="mt-4">
            <FormTextarea
              name="description"
              label="Description"
              placeholder="Enter a description"
              rows={4}
            />
          </div>
        </div>
      </Form>
    ),
  };

  const allSteps = [
    {
      id: "upload",
      title: "Upload File",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload File</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-2">Choose a File or drag and drop it here (2MB)</p>
            <p className="text-gray-500 text-sm mb-4">PDF, DOCX, XLSX</p>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Select File
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "dataset-type",
      title: "Select Dataset type",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-2">Select Dataset Type</h2>
          <p className="text-gray-600 mb-6">Please select the dataset type. This determines which metadata fields will be required.</p>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Upload File</h3>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">employee_data_q2_2025.csv</p>
                  <p className="text-sm text-gray-600">Uploaded</p>
                </div>
                <button className="ml-auto text-red-500 hover:text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <Form {...form}>
            <FormSelect
              name="datasetType"
              label="Select Dataset Type"
              placeholder="Select a dataset type"
              options={[
                { value: "customer", label: "Customer Data" },
                { value: "employee", label: "Employee Data" },
                { value: "financial", label: "Financial Data" },
                { value: "operational", label: "Operational Data" },
              ]}
            />
          </Form>
        </div>
      ),
    },
    metadataStep,
  ];

  // Use only metadata step for edit mode, all steps for create mode
  const steps = isEdit ? [metadataStep] : allSteps;

  const handleComplete = () => {
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onOpenChange(false);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    onOpenChange(false);
  };

  const handleCancelDismiss = () => {
    setShowCancelModal(false);
  };

  return (
    <>
      <MultiStepDialog
        open={open && !showSuccessModal && !showCancelModal}
        onOpenChange={handleCancel}
        // title={isEdit ? "Edit Data Asset" : "Add New Dataset"}
        steps={steps}
        onComplete={handleComplete}
        finalButtonLabel="Save Dataset"
        hideStepIndicator={isEdit}
      />

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={handleSuccessClose}>
        <DialogContent className="max-w-2xl">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-[24px] font-semibold text-gray-900">Dataset saved successfully</h2>
            </div>

            <p className="text-[16px] text-gray-600 mb-8">
              Dataset Employee Payroll Data – Q2 2025 uploaded successfully.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium mb-2">Records detected</h3>
                      <p className="text-4xl font-bold text-gray-900">2450</p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium mb-2">Fields detected</h3>
                      <p className="text-4xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={handleSuccessClose}
              className="w-full bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white font-medium"
            >
              Go to Dataset
            </Button>
          </div>
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