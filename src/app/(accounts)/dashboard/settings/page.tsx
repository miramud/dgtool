"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/shared/FormInput";
import {
    useGetUserProfile,
    useUpdateUserProfile,
    useUpdateUserPassword,
} from "@/modules/userManagement/controllers/userProfileController";

// Profile form schema
const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    roleName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Password form schema
const passwordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch user profile
    const { data: userProfile, isLoading, error, isError } = useGetUserProfile();
    const updateProfile = useUpdateUserProfile();
    const updatePassword = useUpdateUserPassword();

    // Profile form
    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            roleName: "",
        },
    });

    // Password form
    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Populate form with user profile data
    useEffect(() => {
        if (userProfile) {
            profileForm.reset({
                firstName: userProfile.first_name || "",
                lastName: userProfile.last_name || "",
                email: userProfile.email || "",
                phone: userProfile.mobile_number || "",
                roleName: "",
            });
            // Set avatar preview from backend profile picture
            if (userProfile.profile_picture) {
                setAvatarPreview(userProfile.profile_picture);
            }
        }
    }, [userProfile, profileForm]);

    const handleProfileSubmit = async (data: ProfileFormValues) => {
        const formData = new FormData();
        formData.append("first_name", data.firstName);
        formData.append("last_name", data.lastName);
        formData.append("email", data.email);
        formData.append("mobile_number", data.phone || "");

        // Append the file if a new file is selected
        if (selectedFile) {
            formData.append("profile_picture", selectedFile);
        }

        const result = await updateProfile.updateProfile(formData as any);

        // Reload page after successful update
        if (result) {
            window.location.reload();
        }
    };

    const handlePasswordSubmit = async (data: PasswordFormValues) => {
        const result = await updatePassword.updatePassword({
            old_password: data.oldPassword,
            new_password: data.newPassword,
        });
        if (result) {
            passwordForm.reset();
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be under 5MB");
                return;
            }

            // Validate file type
            const validTypes = ["image/png", "image/jpeg", "image/gif"];
            if (!validTypes.includes(file.type)) {
                alert("Only PNG, JPEG, and GIF files are supported");
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangePicture = () => {
        fileInputRef.current?.click();
    };

    // const handleDeletePicture = () => {
    //     setAvatarPreview(null);
    //     setSelectedFile(null);
    //     if (fileInputRef.current) {
    //         fileInputRef.current.value = "";
    //     }
    // };

    return (
        <div className="w-full h-full bg-background p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground mb-2">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Add and manage your internal users. Only authorized users can access your company dashboard on Rigshare.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-8">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Account Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <div className="max-w-4xl mx-auto">
                        {isLoading ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-8 mb-8">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
                                    <div className="space-y-3">
                                        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="h-12 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-12 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="h-12 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-12 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ) : isError ? (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 font-medium">Error loading profile</p>
                                <p className="text-red-600 text-sm mt-1">
                                    {(error as any)?.response?.data?.message || (error as any)?.message || "Failed to load profile data. The endpoint may not be implemented yet."}
                                </p>
                            </div>
                        ) : !userProfile ? (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 font-medium">No profile data</p>
                                <p className="text-yellow-600 text-sm mt-1">
                                    The API returned successfully but no profile data was found. The endpoint might not be fully implemented yet. Check the console for API response details.
                                </p>
                            </div>
                        ) : (
                            <>
                        <div className="flex items-center gap-8 mb-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {avatarPreview ? (
                            // eslint-disable-next-line
                                        <img
                                            src={avatarPreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/gif"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="default"
                                        onClick={handleChangePicture}
                                        className="bg-[#4A4A7A] hover:bg-[#4A4A7A]/90"
                                    >
                                        Changed Picture
                                    </Button>
                                    {/* <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleDeletePicture}
                                    >
                                        Delete Picture
                                    </Button> */}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Supported files; PNG, JPEGs and GIFs under 5MB
                                </p>
                            </div>
                        </div>

                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <FormInput
                                        name="firstName"
                                        label="First Name"
                                        placeholder="Enter first name"
                                    />
                                    <FormInput
                                        name="lastName"
                                        label="Last Name"
                                        placeholder="Enter last name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <FormInput
                                        name="email"
                                        label="Email"
                                        type="email"
                                        placeholder="Enter work email"
                                    />
                                    <FormInput
                                        name="phone"
                                        label="Phone"
                                        type="tel"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <FormInput
                                        name="roleName"
                                        label="Role Name"
                                        placeholder="Enter role name"
                                        disabled
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => profileForm.reset()}
                                        className="text-destructive border-destructive hover:bg-destructive/10"
                                        disabled={updateProfile.isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-[#4A4A7A] hover:bg-[#4A4A7A]/90"
                                        isLoading={updateProfile.isLoading}
                                        disabled={updateProfile.isLoading}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                        </>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="security">
                    <div className="max-w-4xl mx-auto">
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                                <FormInput
                                    name="oldPassword"
                                    label="Old Password"
                                    type="password"
                                    placeholder="Enter old password"
                                />

                                <div className="grid grid-cols-2 gap-6">
                                    <FormInput
                                        name="newPassword"
                                        label="New Password"
                                        type="password"
                                        placeholder="Enter new password"
                                    />
                                    <FormInput
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="Enter confirm password"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => passwordForm.reset()}
                                        className="text-destructive border-destructive hover:bg-destructive/10"
                                        disabled={updatePassword.isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-[#4A4A7A] hover:bg-[#4A4A7A]/90"
                                        isLoading={updatePassword.isLoading}
                                        disabled={updatePassword.isLoading}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
