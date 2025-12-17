"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactUsPageClient() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
        },
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Message sent successfully!");
                form.reset();
            } else {
                toast.error(result.message || "Failed to send message. Please try again.");
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-[#F6F6F6] py-8 md:py-12 lg:py-20 min-h-screen flex items-center">
            <div className="relative w-full">
                <div className="absolute top-5 left-5 md:top-10 md:left-10 w-32 h-32 md:w-48 md:h-48 lg:w-72 lg:h-72 bg-primary rounded-full filter blur-[60px] md:blur-[80px] lg:blur-[100px] opacity-40 animate-pulse"></div>
                <div className="absolute top-20 right-5 md:top-40 md:right-10 lg:right-20 w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-primary rounded-full filter blur-[80px] md:blur-[100px] lg:blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-10 left-1/4 w-40 h-40 md:w-56 md:h-56 lg:w-80 lg:h-80 bg-primary rounded-full filter blur-[80px] md:blur-[100px] lg:blur-[120px] opacity-35 animate-pulse"></div>
                <div className="absolute bottom-5 right-1/3 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-primary rounded-full filter blur-[60px] md:blur-[80px] lg:blur-[100px] opacity-25 animate-pulse"></div>

                <div className="container px-4 md:px-6 lg:px-8 relative z-10">
                    <div className="bg-white p-5 md:p-8 lg:p-10 rounded-lg shadow-lg max-w-3xl mx-auto">
                        <div className="mb-6 md:mb-8">
                            <h1 className="text-[#26292C] font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4">
                                Get in touch with us
                            </h1>

                            <p className="text-[#6C757D] font-medium text-xs sm:text-sm md:text-base">
                                We&apos;d love to hear from you. Reach out to our
                                team today.
                            </p>
                        </div>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 md:space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <FormInput
                                        label="First Name"
                                        name="firstName"
                                        placeholder="Enter your first name"
                                        className="bg-[#F4F5F6] h-10"
                                    />
                                    <FormInput
                                        label="Last Name"
                                        name="lastName"
                                        placeholder="Enter your last name"
                                        className="bg-[#F4F5F6] h-10"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <FormInput
                                        label="Email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-[#F4F5F6] h-10"
                                    />
                                    <FormInput
                                        label="Phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="bg-[#F4F5F6] h-10"
                                    />
                                </div>

                                <FormTextarea
                                    label="Message"
                                    name="message"
                                    placeholder="Enter your message"
                                    className="bg-[#F4F5F6]"
                                />

                                <div className="flex justify-center mt-8 md:mt-12 lg:mt-20">
                                    <Button
                                        type="submit"
                                        className="w-full md:w-3/5"
                                        disabled={!form.formState.isValid || isSubmitting}
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    );
}
