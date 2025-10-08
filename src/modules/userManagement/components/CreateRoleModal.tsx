"use client";
import { useState, useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/shared/FormInput";
import { Role } from "../types/roles";
import {
  useCreateRole,
  useUpdateRole,
  useGetPermissions,
  useGetRole,
} from "../controllers/rolesController";
import { toast } from "sonner";

import { Plus } from "lucide-react";
import RolePermissionsConfiguration from "../../../components/shared/RolePermissionsConfiguration";

const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional().nullable(),
});

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSuccess?: () => void;
}

type RoleFormData = z.infer<typeof createRoleSchema>;

export default function CreateRoleModal({
  open,
  onOpenChange,
  role,
  onSuccess,
}: CreateRoleModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const { createRole, isLoading: isCreating } = useCreateRole();
  const { updateRole, isLoading: isUpdating } = useUpdateRole(role?.id || "");
  const { getPermissions } = useGetPermissions();
  const { getRole, data: roleData } = useGetRole(role?.id || "");

  // Load permissions on component mount
  useEffect(() => {
    if (open) {
      getPermissions();
      getRole();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Populate form when editing a role
  useEffect(() => {
    if (roleData) {
      form.setValue("name", roleData.name);
      form.setValue("description", role?.description); // Description not available in current Role interface
      form.setValue("permissions", roleData.permissions);

      const flatPermissionIds =
        roleData.permissions?.flatMap((module) =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          module.permissions.map((perm) => perm.id)
        ) || [];

      setSelectedPermissions(flatPermissionIds);
    } else if (open) {
      // Reset form when creating new role
      form.reset();
      setSelectedPermissions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, form, roleData]);

  const isLoading = isCreating || isUpdating;

  const isFormDisabled = useMemo(() => {
    const { name } = form.getValues();
    return !name || selectedPermissions.length === 0;
  }, [form, selectedPermissions]);

  const onSubmit: SubmitHandler<RoleFormData> = async (data) => {
    try {
      const roleData = {
        name: data.name,
        description: data.description,
        permissions: selectedPermissions,
      };

      if (role) {
        await updateRole(roleData);
        toast.success("Role updated successfully");
      } else {
        await createRole(roleData);
        toast.success("Role created successfully");
      }

      form.reset();
      setSelectedPermissions([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(`Failed to ${role ? "update" : "create"} role: ${error}`);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedPermissions([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Plus className='w-5 h-5' />
            {role ? "Update Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormInput
                label='Role Name'
                name='name'
                placeholder='Enter role name'
                required
              />

              <FormInput
                label='Role Description (Optional)'
                name='description'
                placeholder="Describe the role's purpose"
                // isTextArea
              />
            </div>

            <div className='space-y-4'>
              <label className='text-sm font-medium text-gray-700'>
                Permissions <span className='text-red-500'>*</span>
              </label>

              <RolePermissionsConfiguration
                selectedPermissions={selectedPermissions}
                setSelectedPermissions={setSelectedPermissions}
              />
              {form.formState.errors.permissions && (
                <p className='text-sm text-red-500'>
                  {form.formState.errors.permissions.message}
                </p>
              )}

              {selectedPermissions?.length > 0 && (
                <p className='text-sm text-gray-600'>
                  {selectedPermissions?.length} permission(s) selected
                </p>
              )}
            </div>

            <DialogFooter className='pt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                className='border-gray-300'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                isLoading={isLoading}
                disabled={isFormDisabled}
                className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
              >
                {role ? "Update Role" : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
