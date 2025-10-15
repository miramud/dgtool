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
  isLoading?: boolean;
}

export default function DeleteDataCatalogueModal({
  open,
  onOpenChange,
  selectedDataCatalogue,
  onConfirm,
  isLoading = false,
}: DeleteDataCatalogueModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Data Asset</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{selectedDataCatalogue?.businessTechnicalSpecification || 'this data asset'}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
