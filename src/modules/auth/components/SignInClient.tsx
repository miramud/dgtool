"use client";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { TSignInFormValues } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "../lib/validators";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/FormInput";
import Link from "next/link";
import { AUTH_ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSignIn } from "../controllers/signInController";
import { toast } from "sonner";
import AuthFormHeader from "./AuthFormHeader";
import { Fragment } from "react";

export default function SignInClient() {
    const form = useForm<TSignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { signIn, isLoading: isSignInLoading, data: loginResponse } = useSignIn();

    const router = useRouter();

    const onSubmit: SubmitHandler<TSignInFormValues> = async (data) => {
        const response = await signIn(data);
        
        if (response?.data?.is_mfa_required) {
            toast.success("Please verify with MFA");
            router.push(`${AUTH_ROUTES.VERIFY_OTP}?email=${data.email}&mfa=true`);
        } else if (response?.data?.access_token) {
            localStorage.setItem("access_token", response.data.access_token);
            toast.success("Sign in successful");
            router.push("/dashboard");
        } else {
            toast.success("Please verify your email");
            router.push(`${AUTH_ROUTES.VERIFY_OTP}?email=${data.email}`);
        }
    };

    return (
        <Fragment>
            <AuthFormHeader
                title="Welcome"
                description="Log in to continue your DataLoom journey"
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

                    <FormInput
                        type="password"
                        label="Password"
                        name="password"
                        placeholder="Enter password"
                        required
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Checkbox />
                            <Label>Remember me</Label>
                        </div>

                        <Link
                            href={AUTH_ROUTES.FORGOT_PASSWORD}
                            className="text-primary text-sm font-normal"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isSignInLoading}
                    >
                        Sign In
                    </Button>
                </form>
            </Form>

            <footer className="flex items-center justify-between text-sm mt-20">
                <p>
                    New here?&nbsp;
                    <Link href={AUTH_ROUTES.SIGN_UP} className="text-[#3F3465]">
                        Sign Up
                    </Link>
                </p>

                <Link href="#" className="text-[#3F3465]">
                    Terms & Conditions
                </Link>
            </footer>
        </Fragment>
    );
}
