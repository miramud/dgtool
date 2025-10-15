"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DatasetType, CreateDatasetTypeRequest } from "../types/datasetType";
import {
  useCreateDatasetType,
  useUpdateDatasetType,
  UpdateDatasetTypeRequest,
} from "../controllers/datasetTypeController";

interface CreateDatasetTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetType?: DatasetType;
  onSuccess?: (datasetType: DatasetType) => void;
}

export default function CreateDatasetTypeModal({
  open,
  onOpenChange,
  datasetType,
}: // onSuccess,
CreateDatasetTypeModalProps) {
  const [name, setName] = useState(datasetType?.name || "");
  const [description, setDescription] = useState(
    datasetType?.description || ""
  );
  // console.log({ datasetType });

  const isEdit = !!datasetType;

  const {
    createDatasetType,
    isLoading: isCreating,
    isSuccess: createSuccess,
    // data: createdData,
  } = useCreateDatasetType();

  const {
    updateDatasetType,
    isLoading: isUpdating,
    isSuccess: updateSuccess,
    // data: updatedData,
  } = useUpdateDatasetType(datasetType?.id || "");

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (createSuccess) {
      onOpenChange(false);
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      // onSuccess?.(updatedData);
      // false;
      onOpenChange(false);

      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSuccess]);

  useEffect(() => {
    if (datasetType) {
      setName(datasetType.name);
      setDescription(datasetType.description);
    } else {
      resetForm();
    }
  }, [datasetType]);

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      if (isEdit && datasetType) {
        const updateData: UpdateDatasetTypeRequest = {
          name: name.trim(),
          description: description.trim(),
          status: datasetType.status,
        };
        await updateDatasetType(updateData);
      } else {
        const createData: CreateDatasetTypeRequest = {
          name: name.trim(),
          description: description.trim(),
        };
        await createDatasetType(createData);
      }
    } catch (error) {
      console.error("Failed to save dataset type:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Dataset Type" : "Create Dataset Type"}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Dataset Type Info Section */}
          <div>
            <h3 className='text-lg font-medium mb-4'>
              Dataset Type Information
            </h3>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='datasetTypeName'>Dataset Type Name</Label>
                <Input
                  id='datasetTypeName'
                  placeholder='Enter dataset type name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  placeholder='Enter a description for this dataset type'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || isLoading}
            className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
          >
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
