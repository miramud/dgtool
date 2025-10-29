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
import { Switch } from "@/components/ui/switch";
import type { DataCatalogue } from "../types/dataCatalogue";

interface DataSteward {
  id: string;
  fullName: string;
  email: string;
  governanceRole: string;
  status: boolean;
}

interface EditStewardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDataset: DataCatalogue | null;
  onSave: (datasetId: string, stewards: DataSteward[]) => void;
  isLoading?: boolean;
}

export default function EditStewardsModal({
  open,
  onOpenChange,
  selectedDataset,
  onSave,
  isLoading = false,
}: EditStewardsModalProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Mock data for stewards - replace with actual API call based on selectedDataset
  const [stewards, setStewards] = useState<DataSteward[]>([
    {
      id: "1",
      fullName: "Chinwe Okonkwo",
      email: "chinweokonkwo@gmail.com",
      governanceRole: "Data Steward",
      status: true,
    },
    {
      id: "2",
      fullName: "Chinwe Okonkwo",
      email: "chinweokonkwo@gmail.com",
      governanceRole: "Data Steward",
      status: false,
    },
    {
      id: "3",
      fullName: "Chinwe Okonkwo",
      email: "chinweokonkwo@gmail.com",
      governanceRole: "Data Steward",
      status: false,
    },
  ]);

  // Store initial state to check for changes
  const [initialStewards] = useState<DataSteward[]>([
    {
      id: "1",
      fullName: "Chinwe Okonkwo",
      email: "chinweokonkwo@gmail.com",
      governanceRole: "Data Steward",
      status: true,
    },
    {
      id: "2",
      fullName: "Chinwe Okonkwo",
      email: "chinweokonkwo@gmail.com",
      governanceRole: "Data Steward",
      status: false,
    },
    {
      id: "3",
      fullName: "Chinwe Okonkwo",
      email: "chinweokonkwo@gmail.com",
      governanceRole: "Data Steward",
      status: false,
    },
  ]);

  const handleStatusToggle = (stewardId: string) => {
    setStewards((prev) =>
      prev.map((steward) =>
        steward.id === stewardId
          ? { ...steward, status: !steward.status }
          : steward
      )
    );
  };

  const handleSave = () => {
    if (selectedDataset) {
      onSave(selectedDataset.id, stewards);
    }
  };

  const handleCancel = () => {
    // Check if there are any changes made to the stewards
    const hasChanges = stewards.some((steward, index) => 
      steward.status !== initialStewards[index]?.status
    );

    if (hasChanges) {
      setShowCancelModal(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    // Reset stewards to initial state
    setStewards(initialStewards);
    onOpenChange(false);
  };

  const handleCancelDismiss = () => {
    setShowCancelModal(false);
  };

  if (!selectedDataset) return null;

  return (
    <>
      <Dialog open={open && !showCancelModal} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-2xl max-h-[80vh] flex flex-col'>
          <DialogHeader className='flex-shrink-0'>
            <DialogTitle>Data Steward</DialogTitle>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
            {/* Dataset Information */}
            <div className='bg-gray-50 p-4 rounded-lg space-y-3'>
              <div className='flex justify-between'>
                <span className='font-medium text-gray-700'>Dataset Name</span>
                <span className='text-gray-900'>
                  {selectedDataset.name || "Payroll System"}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium text-gray-700'>Business Domain</span>
                <span className='text-gray-900'>
                  {selectedDataset.description || "HR"}
                </span>
              </div>
            </div>

            {/* Stewards List */}
            <div className='space-y-4'>
              {stewards.map((steward) => (
                <div
                  key={steward.id}
                  className='bg-gray-50 p-4 rounded-lg space-y-3'
                >
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-700'>Full Name</span>
                    <span className='text-gray-900'>{steward.fullName}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-700'>
                      Governance Role
                    </span>
                    <span className='text-gray-900'>
                      {steward.governanceRole}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium text-gray-700'>Email</span>
                    <span className='text-gray-900'>{steward.email}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-gray-700'>Status</span>
                    <div className='flex items-center space-x-2'>
                      <Switch
                        checked={steward.status}
                        onCheckedChange={() => handleStatusToggle(steward.id)}
                        className='data-[state=checked]:bg-green-500'
                      />
                      <span className='text-gray-900'>
                        {steward.status ? "Eligible" : "Eligible"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className='flex-shrink-0 mt-6 border-t pt-4'>
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={isLoading}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className='flex-1 bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white'
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={handleCancelDismiss}>
        <DialogContent className="max-w-2xl">
          <div className="p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              Are you sure you want to exit? Unsaved changes will be lost.
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
