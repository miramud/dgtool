"use client";
import { useState } from "react";
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
  onSuccess,
}: CreateDatasetTypeModalProps) {
  const [name, setName] = useState(datasetType?.name || "");
  const [description, setDescription] = useState(datasetType?.description || "");

  const isEdit = !!datasetType;

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const datasetTypeData: CreateDatasetTypeRequest = {
      name: name.trim(),
      description: description.trim(),
    };

    // Create new dataset type with generated ID and metadata
    const newDatasetType: DatasetType = {
      id: datasetType?.id || Date.now().toString(),
      ...datasetTypeData,
      createdBy: "Current User",
      lastModified: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'active',
    };

    onSuccess?.(newDatasetType);
    onOpenChange(false);
    resetForm();
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Dataset Type" : "Create Dataset Type"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dataset Type Info Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Dataset Type Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="datasetTypeName">Dataset Type Name</Label>
                <Input
                  id="datasetTypeName"
                  placeholder="Enter dataset type name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for this dataset type"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-[#4A4A7A] hover:bg-[#3A3A6A]"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}