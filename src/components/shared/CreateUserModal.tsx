"use client";
import { useState } from "react";
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
import {
  UserFormData,
  UserRole,
  User,
} from "../../modules/userManagement/types/user";
import { useCreateUser } from "../../modules/userManagement/controllers/userController";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const createUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  roles: z.array(z.string()).min(1, "At least one role must be selected"),
});

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export default function CreateUserModal({
  open,
  onOpenChange,
}: CreateUserModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      roles: [],
    },
  });

  const { createUser, isLoading } = useCreateUser();

  const availableRoles = Object.values(UserRole);

  const handleRoleChange = (role: string, checked: boolean) => {
    let newRoles: string[];
    if (checked) {
      newRoles = [...selectedRoles, role];
    } else {
      newRoles = selectedRoles.filter((r) => r !== role);
    }
    setSelectedRoles(newRoles);
    form.setValue("roles", newRoles);
  };

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    try {
      await createUser(data);
      toast.success("User created successfully");
      form.reset();
      setSelectedRoles([]);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create user: " + error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormInput
              label='Full Name'
              name='fullName'
              placeholder='Enter full name'
              required
            />

            <FormInput
              label='Email Address'
              name='email'
              type='email'
              placeholder='Enter email address'
              required
            />

            <FormInput
              label='Phone Number'
              name='phone'
              placeholder='Enter phone number'
              required
            />

            <div className='space-y-3'>
              <label className='text-sm font-medium text-gray-700'>
                Roles <span className='text-red-500'>*</span>
              </label>
              <div className='space-y-2'>
                {availableRoles.map((role) => (
                  <div key={role} className='flex items-center space-x-2'>
                    <Checkbox
                      id={role}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={(checked) =>
                        handleRoleChange(role, !!checked)
                      }
                    />
                    <label
                      htmlFor={role}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {role}
                    </label>
                  </div>
                ))}
              </div>
              {form.formState.errors.roles && (
                <p className='text-sm text-red-500'>
                  {form.formState.errors.roles.message}
                </p>
              )}
            </div>

            <DialogFooter className='pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                isLoading={isLoading}
                className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
              >
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
