"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { DataCatalogue } from "../types/dataCatalogue";

interface DeleteDataCatalogueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDataCatalogue: DataCatalogue | null;
  onConfirm: () => void;
}

export default function DeleteDataCatalogueModal({
  open,
  onOpenChange,
  // selectedDataCatalogue,
  onConfirm,
}: DeleteDataCatalogueModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Data Asset</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this data asset? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
