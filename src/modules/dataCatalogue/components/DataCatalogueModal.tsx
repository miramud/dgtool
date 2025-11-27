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
import { useGetMetadataTemplates, useGetDatasetTypes, useCreateDataCatalogue, CreateDatasetFormData } from "../controllers/dataCatalogueController";
import { useState, useEffect, useRef } from "react";
import { useCentrifugo } from "@/hooks/useCentrifugo";
import { Progress } from "@/components/ui/progress";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'preparing' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string>('');
  const [processingResults, setProcessingResults] = useState<{
    totalRows?: number;
    rowsCleaned?: number;
    errorSummary?: Array<{
      error_message: string;
      count: number;
      rows: number[];
    }>;
  }>({});
  const [processedErrors, setProcessedErrors] = useState<Array<{
    row: number;
    error_message: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const form = useForm<DataCatalogueFormData>({
    resolver: zodResolver(createDataCatalogueSchema),
    defaultValues: {
      name: dataCatalogue?.businessTechnicalSpecification || "",
      business_domain: dataCatalogue?.businessDescription || "",
      tags: dataCatalogue?.tags?.join(", ") || "",
      sensitivity: "INTERNAL",
      description: dataCatalogue?.usageGuidelines || "",
      raw_file: "",
      dataset_type: "",
      metadata_template: "",
    },
  });

  // Watch dataset type to conditionally fetch templates
  const selectedDatasetType = form.watch('dataset_type');
  
  // Get dataset types and templates
  const { data: datasetTypes, isLoading: isLoadingDatasetTypes } = useGetDatasetTypes();
  const { data: metadataTemplates, isLoading: isLoadingTemplates } = useGetMetadataTemplates(selectedDatasetType);
  
  // Create dataset hook
  const { createDataCatalogue, isLoading: isCreatingDataset } = useCreateDataCatalogue();

  // Centrifugo WebSocket connection
  const { connect, disconnect, subscribeToChannel } = useCentrifugo({
    url: process.env.NEXT_PUBLIC_CENTRIFUGO_WS_URL || 'wss://centrifugo-v5-zkss.onrender.com/connection/websocket',
    onProgress: (progress) => {
      setUploadProgress(progress.percentage);
      setUploadStatus(progress.status);
      setUploadMessage(progress.message || '');
      
      // Collect errors during processing
      if (progress.error_message && progress.current_row !== undefined) {
        setProcessedErrors(prev => {
          // Check if this error for this row already exists
          const exists = prev.some(err => err.row === progress.current_row && err.error_message === progress.error_message);
          if (!exists) {
            return [...prev, {
              row: progress.current_row!,
              error_message: progress.error_message!
            }];
          }
          return prev;
        });
      }
    },
    onDatasetProcessed: async (data: any) => {
      // Handle dataset processing completion
      console.log('Processing completed with data:', data);
      
      // Clear the timeout since we received completion
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      
      try {
        // For now, set what we have from Centrifugo
        setProcessingResults({
          totalRows: data.total_rows,
          rowsCleaned: data.rows_cleaned,
          errorSummary: data.error_summary,
        });
        
        // Check if processing completed with errors or successfully
        const hasErrors = processedErrors.length > 0 || (data.error_summary && data.error_summary.length > 0);
        
        if (data.status === 'failed' || data.status === 'error') {
          setUploadStatus('error');
          setUploadMessage('Dataset processing failed. Please review errors and try again.');
        } else {
          setUploadStatus('completed');
          if (hasErrors) {
            setUploadMessage(`Dataset processed with ${processedErrors.length > 0 ? processedErrors.length : data.error_summary?.length || 0} issues that need attention.`);
          } else {
            setUploadMessage('Dataset processed successfully without issues.');
          }
        }
        
        setUploadProgress(100);
      } catch (error) {
        console.error('Error processing dataset completion:', error);
        setUploadStatus('error');
        setUploadMessage('An error occurred while processing completion data.');
      }
    }
  });

  // Reset form when dataCatalogue changes
  useEffect(() => {
    if (dataCatalogue) {
      form.reset({
        name: dataCatalogue.businessTechnicalSpecification || "",
        business_domain: dataCatalogue.businessDescription || "",
        tags: dataCatalogue.tags?.join(", ") || "",
        sensitivity: "INTERNAL",
        description: dataCatalogue.usageGuidelines || "",
        raw_file: "",
        metadata_template: "",
      });
    } else {
      form.reset({
        name: "",
        business_domain: "",
        tags: "",
        sensitivity: "INTERNAL",
        description: "",
        raw_file: "",
        dataset_type: "",
        metadata_template: "",
      });
    }
  }, [dataCatalogue, form]);

  // File validation function
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allowedExtensions = ['.xlsx', '.csv'];

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload only .xlsx or .csv files.'
      };
    }

    return { valid: true };
  };

  // File selection handlers
  const handleFileSelect = () => {
    setFileError('');
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);

      if (!validation.valid) {
        setFileError(validation.error || 'Invalid file');
        setSelectedFile(null);
        form.setValue('raw_file', '');
        return;
      }

      setFileError('');
      setSelectedFile(file);
      // Set the file name in the form for display purposes
      form.setValue('raw_file', file.name);
      // Auto-advance to next step after a short delay
      setTimeout(() => {
        setCurrentStep(1);
      }, 500);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validation = validateFile(file);

      if (!validation.valid) {
        setFileError(validation.error || 'Invalid file');
        setSelectedFile(null);
        form.setValue('raw_file', '');
        return;
      }

      setFileError('');
      setSelectedFile(file);
      form.setValue('raw_file', file.name);
      // Auto-advance to next step after a short delay
      setTimeout(() => {
        setCurrentStep(1);
      }, 500);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFileError('');
    form.setValue('raw_file', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const metadataStep = {
    id: "metadata",
    content: (
      <Form {...form}>
        <div>
          <h2 className="text-xl font-semibold mb-6">{isEdit ? "Edit Basic Metadata" : "Enter Basic Metadata"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="name"
              label="Dataset Name"
              placeholder="Enter dataset's name"
            />
            <FormSelect
              name="business_domain"
              label="Business Domain"
              placeholder="Select business's domain"
              options={[
                { value: "finance", label: "Finance" },
                { value: "hr", label: "HR" },
                { value: "operations", label: "Operations" },
                { value: "marketing", label: "Marketing" },
              ]}
            />
            <FormInput
              name="tags"
              label="Tags"
              placeholder="Enter tags (comma separated)"
            />
            <FormSelect
              name="sensitivity"
              label="Dataset Sensitivity"
              placeholder="Select Data's sensitivity"
              options={[
                { value: "INTERNAL", label: "Internal" },
                { value: "EXTERNAL", label: "External" },
                { value: "PRIVATE", label: "PRIVATE" },
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

          {!selectedFile ? (
            <>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : fileError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <svg
                    className={`w-12 h-12 mb-4 ${
                      isDragging ? 'text-blue-500' : fileError ? 'text-red-400' : 'text-gray-400'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className={`text-lg mb-2 font-medium ${
                    isDragging ? 'text-blue-600' : fileError ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {isDragging ? 'Drop file here' : 'Choose a file or drag and drop it here'}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">XLSX, CSV</p>
                  <button
                    onClick={handleFileSelect}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Select File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx,.csv"
                    className="hidden"
                  />
                </div>
              </div>

              {fileError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Upload Error</p>
                    <p className="text-sm text-red-700 mt-1">{fileError}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">Selected successfully</p>
                </div>
                <button 
                  onClick={handleFileRemove}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      ),
      isValid: !!selectedFile,
    },
    {
      id: "dataset-type",
      title: "Select Dataset type",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-2">Select Dataset Type</h2>
          <p className="text-gray-600 mb-6">Please select the dataset type. This determines which metadata fields will be required.</p>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Uploaded File</h3>
            {selectedFile ? (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">Selected</p>
                  </div>
                  <button 
                    onClick={handleFileRemove}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4 bg-red-50">
                <p className="text-red-600">No file selected. Please go back to select a file.</p>
              </div>
            )}
          </div>

          <Form {...form}>
            <div className="space-y-4">
              <FormSelect
                name="dataset_type"
                label="Select Dataset Type"
                placeholder="Select a dataset type"
                isLoading={isLoadingDatasetTypes}
                emptyMessage="No dataset types available"
                options={
                  Array.isArray(datasetTypes) 
                    ? datasetTypes.map((type: any) => ({
                        value: type.id,
                        label: type.name,
                      }))
                    : []
                }
              />
              
              {selectedDatasetType && (
                <FormSelect
                  name="metadata_template"
                  label="Select Template"
                  placeholder="Select a template"
                  isLoading={isLoadingTemplates}
                  emptyMessage="No templates available for this dataset type"
                  options={
                    Array.isArray(metadataTemplates) 
                      ? metadataTemplates.map((template: any) => ({
                          value: template.id,
                          label: template.name,
                        }))
                      : []
                  }
                />
              )}
            </div>
          </Form>
        </div>
      ),
      isValid: !!selectedFile && !!selectedDatasetType && (
        !!form.watch('metadata_template') || 
        (Array.isArray(metadataTemplates) && metadataTemplates.length === 0)
      ),
    },
    {
      ...metadataStep,
      isValid: () => {
        // Use watch to make validation reactive to form changes
        const name = form.watch('name');
        const business_domain = form.watch('business_domain');
        const description = form.watch('description');
        const sensitivity = form.watch('sensitivity');
        const dataset_type = form.watch('dataset_type');
        const raw_file = form.watch('raw_file');
        
        return !!(name && business_domain && description && sensitivity && dataset_type && raw_file);
      },
    },
  ];

  // Use only metadata step for edit mode, all steps for create mode
  const steps = isEdit ? [metadataStep] : allSteps;

  const handleComplete = async () => {
    try {
      const formValues = form.getValues();
      
      if (!selectedFile) {
        console.error("No file selected");
        return;
      }

      // Initialize upload progress
      setUploadStatus('preparing');
      setUploadProgress(0);
      setProcessedErrors([]); // Clear any previous errors
      
      // Connect to Centrifugo
      connect();

      const submitData: CreateDatasetFormData = {
        name: formValues.name,
        description: formValues.description,
        business_domain: formValues.business_domain,
        sensitivity: formValues.sensitivity,
        tags: formValues.tags,
        raw_file: selectedFile,
        dataset_type: formValues.dataset_type,
        metadata_template: formValues.metadata_template,
      };

      const response = await createDataCatalogue(submitData);
      
      // Get the reference ID from the response to subscribe to the channel
      // The response structure might be in different places depending on API
      const datasetRef = (response as any)?.data?.data?.reference || 
                        (response as any)?.data?.reference ||
                        (response as any)?.reference;
      if (datasetRef) {
        subscribeToChannel(`dataset:${datasetRef}`);
        
        // Set a timeout for processing completion (5 minutes)
        processingTimeoutRef.current = setTimeout(() => {
          console.warn('Processing timeout reached, marking as completed with potential issues');
          setUploadStatus('completed');
          setUploadProgress(100);
          setUploadMessage(processedErrors.length > 0 
            ? `Processing completed with ${processedErrors.length} known issues. Some operations may have timed out.`
            : 'Processing completed. Some operations may have timed out.'
          );
        }, 5 * 60 * 1000); // 5 minutes timeout
        
      } else {
        console.warn('No dataset reference found in response:', response);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating dataset:", error);
      setUploadStatus('error');
      setUploadMessage('Upload failed. Please try again.');
    }
  };

  const handleCancel = () => {
    if (uploadStatus === 'preparing' || uploadStatus === 'uploading' || uploadStatus === 'processing') {
      // Don't allow cancel during active upload/processing
      return;
    }
    setShowCancelModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Reset file state
    setSelectedFile(null);
    setCurrentStep(0);
    // Reset upload state
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadMessage('');
    setProcessingResults({});
    setProcessedErrors([]);
    // Reset form to initial state
    form.reset({
      name: "",
      business_domain: "",
      tags: "",
      sensitivity: "INTERNAL",
      description: "",
      raw_file: "",
      dataset_type: "",
      metadata_template: "",
    });
    // Disconnect from WebSocket
    disconnect();
    // Clear processing timeout
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    // Reset file state
    setSelectedFile(null);
    setCurrentStep(0);
    // Reset upload state
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadMessage('');
    setProcessingResults({});
    setProcessedErrors([]);
    // Reset form to initial state
    form.reset({
      name: "",
      business_domain: "",
      tags: "",
      sensitivity: "INTERNAL",
      description: "",
      raw_file: "",
      dataset_type: "",
      metadata_template: "",
    });
    // Disconnect from WebSocket
    disconnect();
    // Clear processing timeout
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const handleCancelDismiss = () => {
    setShowCancelModal(false);
  };

  return (
    <>
      <MultiStepDialog
        open={open && !showSuccessModal && !showCancelModal}
        onOpenChange={uploadStatus === 'idle' ? handleCancel : () => {}}
        steps={steps}
        onComplete={uploadStatus === 'error' ? () => {
          // Reset error state and retry
          setUploadStatus('idle');
          setUploadMessage('');
          setUploadProgress(0);
          setProcessedErrors([]);
          handleComplete();
        } : handleComplete}
        finalButtonLabel={
          uploadStatus === 'idle' ? "Save Dataset" : 
          uploadStatus === 'error' ? "Retry Upload" :
          uploadStatus === 'completed' ? "Dataset Saved" :
          "Processing..."
        }
        isLoading={isCreatingDataset || (uploadStatus !== 'idle' && uploadStatus !== 'error' && uploadStatus !== 'completed')}
        hideStepIndicator={isEdit}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      {/* Success Modal with Upload Progress */}
      <Dialog open={showSuccessModal} onOpenChange={uploadStatus === 'completed' ? handleSuccessClose : () => {}}>
        <DialogContent className="max-w-2xl">
          <div className="p-8">
            {uploadStatus === 'completed' ? (
              // Success content
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-[24px] font-semibold text-gray-900">Dataset processed successfully</h2>
                </div>

                <p className="text-[16px] text-gray-600 mb-8">
                  Dataset {form.watch('name')} uploaded and processed successfully.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-gray-500 text-sm font-medium mb-2">Records Detected</h3>
                          <p className="text-4xl font-bold text-gray-900">{processingResults.totalRows ?? '--'}</p>
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
                          <h3 className="text-gray-500 text-sm font-medium mb-2">Records Cleaned</h3>
                          <p className="text-4xl font-bold text-gray-900">{processingResults.rowsCleaned ?? '--'}</p>
                        </div>
                        <div className="text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Error Summary Section */}
                {(processedErrors.length > 0 || processingResults.errorSummary) && (
                  <div className="mb-8">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Processing Issues Summary
                        </h3>
                        
                        {processingResults.errorSummary && processingResults.errorSummary.length > 0 ? (
                          <div className="space-y-3">
                            {processingResults.errorSummary.map((errorGroup, index) => (
                              <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-orange-900">{errorGroup.error_message}</h4>
                                  <span className="text-sm bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                                    {errorGroup.count} occurrences
                                  </span>
                                </div>
                                <p className="text-sm text-orange-700">
                                  Affected rows: {errorGroup.rows.slice(0, 10).join(', ')}
                                  {errorGroup.rows.length > 10 && ` and ${errorGroup.rows.length - 10} more...`}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {processedErrors.map((error, index) => (
                              <div key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                                <span className="font-medium">Row {error.row}:</span> {error.error_message}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> These issues were automatically flagged during processing. 
                            You can review and fix them in the Data Quality tab of your dataset.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <Button 
                  onClick={handleSuccessClose}
                  className="w-full bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white font-medium"
                >
                  Go to Dataset
                </Button>
              </>
            ) : (
              // Upload progress content
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    uploadStatus === 'error' ? 'bg-red-500' : 'bg-[#3A3A6A]'
                  }`}>
                    {uploadStatus === 'error' ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                      </svg>
                    )}
                  </div>
                  <h2 className="text-[24px] font-semibold text-gray-900">
                    {uploadStatus === 'error' ? 'Upload Failed' : 'Processing Dataset...'}
                  </h2>
                </div>

                <div className="mb-6">
                  <p className="text-[16px] text-gray-600 mb-2">
                    {uploadMessage || 'Please wait while we process your dataset.'}
                  </p>
                  {processedErrors.length > 0 && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm font-medium text-orange-800 mb-2">
                        Processing Issues ({processedErrors.length})
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {processedErrors.slice(-5).map((error, index) => (
                          <p key={index} className="text-xs text-orange-700">
                            Row {error.row}: {error.error_message}
                          </p>
                        ))}
                        {processedErrors.length > 5 && (
                          <p className="text-xs text-orange-600 italic">
                            ...and {processedErrors.length - 5} more issues
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {uploadStatus === 'preparing' && 'Preparing upload...'}
                      {uploadStatus === 'uploading' && 'Uploading file...'}
                      {uploadStatus === 'processing' && 'Processing data...'}
                      {uploadStatus === 'error' && 'Upload failed'}
                    </span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>

                {uploadStatus === 'error' && (
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleSuccessClose}
                      variant="outline"
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={handleComplete}
                      className="flex-1 bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </>
            )}
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