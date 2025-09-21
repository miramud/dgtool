"use client";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { TForgotPasswordFormValues } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../lib/validators";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/FormInput";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "../controllers/forgotPasswordController";
import { AUTH_ROUTES } from "@/constants/routes";
import { Fragment } from "react";
import AuthFormHeader from "./AuthFormHeader";

export default function ForgotPasswordClient() {
    const form = useForm<TForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const router = useRouter();

    const { forgotPassword, isLoading: isForgotPasswordLoading } =
        useForgotPassword();

    const onSubmit: SubmitHandler<TForgotPasswordFormValues> = async ({
        email,
    }) => {
        await forgotPassword({ email });
        router.push(
            `${AUTH_ROUTES.VERIFY_OTP}?email=${email}&type=RESET_PASSWORD`
        );
    };

    return (
        <Fragment>
            <AuthFormHeader
                title="Reset Your Password"
                description="Enter your email to receive a password reset link"
            />

            <Form {...form}>
                <form
                    className="space-y-5"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormInput
                        label="Email Address"
                        name="email"
                        placeholder="abc@email.com"
                        required
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isForgotPasswordLoading}
                    >
                        Send Reset Link
                    </Button>
                </form>
            </Form>
        </Fragment>
    );
}
