"use client";
import { useState, useEffect } from "react";
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
import {
  // useGetDataGovernorByDatasetId,
  useGetDataGovernorById,
  useUpdateDatasetStewards,
} from "../controllers/dataGovernanceController";

interface DataSteward {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  governanceRole: string;
  is_eligible: boolean;
}

interface DataOwner {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  governanceRole: string;
  is_eligible: boolean;
}

interface EditStewardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDataset: DataCatalogue | null;
  onSave: (
    datasetId: string,
    stewards: DataSteward[],
    owners: DataOwner[]
  ) => void;
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
  const [stewards, setStewards] = useState<DataSteward[]>([]);
  const [initialStewards, setInitialStewards] = useState<DataSteward[]>([]);
  const [owners, setOwners] = useState<DataOwner[]>([]);
  const [initialOwners, setInitialOwners] = useState<DataOwner[]>([]);

  const { data: dataGovernor } = useGetDataGovernorById(
    selectedDataset?.id || ""
  );
  const { updateStewards, isLoading: isUpdating } = useUpdateDatasetStewards();

  // Load stewards and owners data when dataGovernor is available
  useEffect(() => {
    if (dataGovernor?.stewards) {
      const stewardsData = dataGovernor.stewards.map((steward: any) => ({
        id: steward.id,
        userId: steward.user.id, // Store the actual user ID separately
        fullName: `${steward.user.first_name} ${steward.user.last_name}`,
        email: steward.user.email,
        governanceRole: "Data Steward",
        is_eligible: steward.is_eligible,
      }));
      setStewards(stewardsData);
      setInitialStewards([...stewardsData]);
    }
    console.log({ dataGovernor });

    if (dataGovernor?.owners) {
      const ownersData = dataGovernor.owners.map((owner: any) => ({
        id: owner.id,
        userId: owner.user.id, // Store the actual user ID separately
        fullName: `${owner.user.first_name} ${owner.user.last_name}`,
        email: owner.user.email,
        governanceRole: "Data Owner",
        is_eligible: owner.is_eligible,
      }));
      setOwners(ownersData);
      setInitialOwners([...ownersData]);
    }
  }, [dataGovernor]);

  const handleStatusToggle = (stewardId: string) => {
    setStewards((prev) =>
      prev.map((steward) =>
        steward.id === stewardId
          ? { ...steward, is_eligible: !steward.is_eligible }
          : steward
      )
    );
  };

  const handleOwnerStatusToggle = (ownerId: string) => {
    setOwners((prev) =>
      prev.map((owner) =>
        owner.id === ownerId
          ? { ...owner, is_eligible: !owner.is_eligible }
          : owner
      )
    );
  };

  const handleSave = async () => {
    if (selectedDataset && dataGovernor) {
      try {
        // Transform stewards data to match API expectations
        const transformedStewards = stewards.map((steward) => ({
          is_eligible: steward.is_eligible,
          data_governor: dataGovernor.id,
          user: steward.userId, // Use the actual user ID
        }));

        // Transform owners data to match API expectations
        const transformedOwners = owners.map((owner) => ({
          is_eligible: owner.is_eligible,
          data_governor: dataGovernor.id,
          user: owner.userId, // Use the actual user ID
          created_by: dataGovernor.created_by,
          updated_by: dataGovernor.created_by, // Using created_by as updated_by for now
        }));

        const updatePayload = {
          data_stewards: transformedStewards,
          data_owners: transformedOwners,
          description: dataGovernor.description,
          created_by: dataGovernor.created_by,
          updated_by: dataGovernor.created_by,
          dataset: dataGovernor.dataset.id,
        };

        await updateStewards({
          datasetId: selectedDataset.id,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          stewards: updatePayload,
        });
        onSave(selectedDataset.id, stewards, owners);
        onOpenChange(false);
      } catch (error) {
        console.error("Error updating stewards:", error);
      }
    }
  };

  const handleCancel = () => {
    // Check if there are any changes made to the stewards or owners
    const hasStewardChanges = stewards.some(
      (steward, index) =>
        steward.is_eligible !== initialStewards[index]?.is_eligible
    );
    const hasOwnerChanges = owners.some(
      (owner, index) => owner.is_eligible !== initialOwners[index]?.is_eligible
    );

    if (hasStewardChanges || hasOwnerChanges) {
      setShowCancelModal(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    // Reset stewards and owners to initial state
    setStewards(initialStewards);
    setOwners(initialOwners);
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
                  {dataGovernor?.dataset?.name ||
                    selectedDataset.name ||
                    "Payroll System"}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium text-gray-700'>
                  Business Domain
                </span>
                <span className='text-gray-900'>
                  {dataGovernor?.dataset?.business_domain ||
                    selectedDataset.description ||
                    "HR"}
                </span>
              </div>
            </div>

            {/* Data Owners List */}
            {owners.length > 0 && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Data Owners
                </h3>
                {owners.map((owner) => (
                  <div
                    key={owner.id}
                    className='bg-gray-50 p-4 rounded-lg space-y-3'
                  >
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-700'>
                        Full Name
                      </span>
                      <span className='text-gray-900'>{owner.fullName}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-700'>
                        Governance Role
                      </span>
                      <span className='text-gray-900'>
                        {owner.governanceRole}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-700'>Email</span>
                      <span className='text-gray-900'>{owner.email}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-gray-700'>Status</span>
                      <div className='flex items-center space-x-2'>
                        <Switch
                          checked={owner.is_eligible}
                          onCheckedChange={() =>
                            handleOwnerStatusToggle(owner.id)
                          }
                          className='data-[state=checked]:bg-green-500'
                        />
                        <span className='text-gray-900'>
                          {owner.is_eligible ? "Eligible" : "Not Eligible"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stewards List */}
            {stewards.length > 0 && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Data Stewards
                </h3>
                {stewards.map((steward) => (
                  <div
                    key={steward.id}
                    className='bg-gray-50 p-4 rounded-lg space-y-3'
                  >
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-700'>
                        Full Name
                      </span>
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
                          checked={steward.is_eligible}
                          onCheckedChange={() => handleStatusToggle(steward.id)}
                          className='data-[state=checked]:bg-green-500'
                        />
                        <span className='text-gray-900'>
                          {steward.is_eligible ? "Eligible" : "Not Eligible"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              disabled={isLoading || isUpdating}
              className='flex-1 bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white'
            >
              {isLoading || isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={handleCancelDismiss}>
        <DialogContent className='max-w-2xl'>
          <div className='p-8 text-center'>
            <h2 className='text-xl font-medium text-gray-900 mb-8'>
              Are you sure you want to exit? Unsaved changes will be lost.
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
