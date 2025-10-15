"use client";
import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  content: ReactNode;
  title?: string;
  isValid?: boolean | (() => boolean);
}

interface MultiStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  steps: Step[];
  onComplete?: () => void;
  finalButtonLabel?: string;
  hideStepIndicator?: boolean;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  isLoading?: boolean;
}

export default function MultiStepDialog({
  open,
  onOpenChange,
  title,
  steps,
  onComplete,
  finalButtonLabel = "Complete",
  hideStepIndicator = false,
  currentStep: externalCurrentStep,
  onStepChange,
  isLoading = false,
}: MultiStepDialogProps) {
  const [internalCurrentStep, setInternalCurrentStep] = useState(0);
  
  // Use external step if provided, otherwise use internal
  const currentStep = externalCurrentStep !== undefined ? externalCurrentStep : internalCurrentStep;
  const setCurrentStep = onStepChange || setInternalCurrentStep;

  const isCurrentStepValid = () => {
    const step = steps[currentStep];
    if (step?.isValid === undefined) return true;
    if (typeof step.isValid === 'function') {
      return step.isValid();
    }
    return step.isValid;
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      return; // Don't proceed if current step is not valid
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setCurrentStep(0);
    onOpenChange(false);
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        {!hideStepIndicator && (
          <div className='flex items-center justify-center mb-6'>
            {steps.map((step, index) => (
              <div key={step.id} className='flex items-center'>
                {/* Step Number */}
                <div className='flex items-center'>
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                      index < currentStep
                        ? "bg-green-500 text-white"
                        : index === currentStep
                        ? "bg-[#3A3A6A] text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium",
                      index === currentStep ? "text-[#3A3A6A]" : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className='mx-4 text-gray-400'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <div className='min-h-[400px] py-4'>{steps[currentStep]?.content}</div>

        {/* Navigation Buttons */}
        <DialogFooter className='flex justify-between'>
          <div>
            {!isFirstStep && (
              <Button variant='outline' onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>
          <div className='flex gap-4'>
            <Button
              variant='outline'
              onClick={handleCancel}
              className='min-w-[120px]'
            >
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid() || isLoading}
              className='bg-[#4A4A7A] hover:bg-[#3A3A6A] min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading && isLastStep ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                  </svg>
                  {finalButtonLabel}
                </div>
              ) : (
                isLastStep ? finalButtonLabel : "Next"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
