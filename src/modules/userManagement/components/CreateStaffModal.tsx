"use client";
import { useState, useEffect, useMemo } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
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
import { BackendStaff } from "../types/user";
import {
  useCreateStaff,
  useUpdateStaff,
  useGetStaff,
} from "../controllers/staffController";
import { useGetRoles } from "../controllers/rolesController";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus } from "lucide-react";

const createStaffSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  mobile_number: z.string().optional(),
  roles: z.array(z.string()).optional(),
});

interface CreateStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: BackendStaff | null;
  onSuccess?: () => void;
}

type StaffFormData = z.infer<typeof createStaffSchema>;

export default function CreateStaffModal({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: CreateStaffModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const form = useForm<StaffFormData>({
    resolver: zodResolver(createStaffSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
      roles: [],
    },
  });

  const { createStaff, isLoading: isCreating } = useCreateStaff();
  const { updateStaff, isLoading: isUpdating } = useUpdateStaff(
    staff?.id || ""
  );
  const { getStaff, data: staffData } = useGetStaff(staff?.id || "");
  const { getRoles, data: rolesData } = useGetRoles();

  // Load roles on component mount
  useEffect(() => {
    if (open) {
      getRoles();
      if (staff?.id) {
        getStaff();
      }
    }
  }, [open, staff?.id]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (staff) {
        // Editing existing staff

        const formData = {
          first_name: staff.user?.first_name || "",
          last_name: staff.user?.last_name || "",
          email: staff.user?.email || "",
          mobile_number: staff.user?.mobile_number || "",
          roles: [],
        };

        form.reset(formData);

        const roleIds = staff.roles?.map((role) => role.id) || [];
        form.setValue("roles", roleIds);
        setSelectedRoles(roleIds);
      } else {
        // Creating new staff - only reset if not already empty
        form.reset({
          first_name: "",
          last_name: "",
          email: "",
          mobile_number: "",
          roles: [],
        });
        setSelectedRoles([]);
      }
    }
  }, [open, staff?.id]); // Changed dependency to avoid constant resets
  // Watch form values in real-time to debug
  const watchedValues = useWatch({
    control: form.control,
  });

  const isLoading = isCreating || isUpdating;
  const availableRoles = rolesData?.results || [];

  const handleRoleChange = (roleId: string, checked: boolean) => {
    let newRoles: string[];
    if (checked) {
      newRoles = [...selectedRoles, roleId];
    } else {
      newRoles = selectedRoles.filter((r) => r !== roleId);
    }
    setSelectedRoles(newRoles);
    form.setValue("roles", newRoles);
  };

  // const isFormDisabled = useMemo(() => {
  //   const { first_name, last_name, email } = form.getValues();
  //   console.log(">>>>>creakd", { first_name, last_name, email });

  //   return !first_name || !last_name || !email;
  // }, [form]);

  const onSubmit: SubmitHandler<StaffFormData> = async (data) => {
    try {
      const staffData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile_number: data.mobile_number,
        roles: selectedRoles,
      };

      if (staff) {
        // For update, exclude roles from main update (roles are handled separately)

        const { ...updateData } = staffData;
        await updateStaff(updateData);
        toast.success("Staff updated successfully");
      } else {
        await createStaff(staffData);
        toast.success("Staff created successfully");
      }

      form.reset();
      setSelectedRoles([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(`Failed to ${staff ? "update" : "create"} staff: ${error}`);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedRoles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <UserPlus className='w-5 h-5' />
            {staff ? "Update Staff Member" : "Add New Staff Member"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
            key={staff?.id || "new"} // Force re-render when staff changes
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormInput
                label='First Name'
                name='first_name'
                placeholder='Enter first name'
                required
              />

              <FormInput
                label='Last Name'
                name='last_name'
                placeholder='Enter last name'
                required
              />
            </div>

            <FormInput
              label='Email Address'
              name='email'
              type='email'
              placeholder='Enter email address'
              required
            />

            <FormInput
              label='Phone Number (Optional)'
              name='mobile_number'
              placeholder='Enter mobile_number number'
            />

            <div className='space-y-4'>
              <label className='text-sm font-medium text-gray-700'>
                Roles (Optional)
              </label>

              {availableRoles.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4'>
                  {availableRoles.map((role) => (
                    <div key={role.id} className='flex items-start space-x-3'>
                      <Checkbox
                        id={role.id}
                        checked={selectedRoles.includes(role.id)}
                        onCheckedChange={(checked) =>
                          handleRoleChange(role.id, !!checked)
                        }
                      />
                      <div className='grid gap-1.5 leading-none'>
                        <label
                          htmlFor={role.id}
                          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
                        >
                          {role.name}
                        </label>
                        {role.description && (
                          <p className='text-xs text-muted-foreground'>
                            {role.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <p>Loading roles...</p>
                </div>
              )}

              {selectedRoles.length > 0 && (
                <p className='text-sm text-gray-600'>
                  {selectedRoles.length} role(s) selected
                </p>
              )}
            </div>

            <DialogFooter className='pt-6'>
              {/* <Button
                type='button'
                variant='outline'
                onClick={() => {
                  console.log("Manual form check:", form.getValues());
                  console.log("Form state:", form.formState);
                  console.log("Selected roles:", selectedRoles);
                }}
                className='border-gray-300'
              >
                Debug Form
              </Button> */}
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
                // disabled={isFormDisabled}
                className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
              >
                {staff ? "Update Staff" : "Create Staff"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
