"use client";
import FormInput from "@/components/shared/FormInput";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { evaluatePassword } from "../lib/helpers";
import { signUpSchema } from "@/modules/auth/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpFormValues } from "../lib/types";
import { Button } from "@/components/ui/button";
import { useSignUp } from "../controllers/signUpController";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/constants/routes";
import Link from "next/link";
import AuthFormHeader from "./AuthFormHeader";
import { Fragment } from "react";

export default function SignUpClient() {
    const form = useForm<TSignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
        },
    });

    const router = useRouter();

    const requirements = evaluatePassword(form.watch("password"));

    const { signUp, isLoading: isSignUpLoading } = useSignUp();

    const onSubmit: SubmitHandler<TSignUpFormValues> = async (data) => {
        await signUp(data);
        toast.success("Sign up successful");
        router.push(`${AUTH_ROUTES.VERIFY_OTP}?email=${data.email}`);
    };

    return (
        <Fragment>
            <AuthFormHeader
                title="Create An Account"
                description="Sign up to start tracking your sustainability goals."
            />

            <Form {...form}>
                <form
                    className="space-y-5"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormInput
                        label="First Name"
                        name="first_name"
                        placeholder="Enter your first name"
                        required
                    />

                    <FormInput
                        label="Last Name"
                        name="last_name"
                        placeholder="Enter your last name"
                        required
                    />

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

                    <FormInput
                        type="password"
                        label="Confirm Password"
                        name="confirm_password"
                        placeholder="Re-enter password"
                        required
                    />

                    <PasswordStrengthIndicator requirements={requirements} />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isSignUpLoading}
                    >
                        Sign Up
                    </Button>
                </form>
            </Form>

            <footer className="flex items-center justify-between text-sm mt-20">
                <p>
                    Already have an account?&nbsp;
                    <Link href={AUTH_ROUTES.SIGN_IN} className="text-[#3F3465]">
                        Sign In
                    </Link>
                </p>

                <Link href="#" className="text-[#3F3465]">
                    Terms & Conditions
                </Link>
            </footer>
        </Fragment>
    );
}
