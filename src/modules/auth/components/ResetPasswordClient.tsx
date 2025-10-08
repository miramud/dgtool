"use client";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { TResetPasswordFormValues } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../lib/validators";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/FormInput";
import { useRouter, useSearchParams } from "next/navigation";
import { AUTH_ROUTES } from "@/constants/routes";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { evaluatePassword } from "../lib/helpers";
import {
  useFirstResetPassword,
  useResetPassword,
} from "../controllers/resetPasswordController";
import { Fragment } from "react";
import AuthFormHeader from "./AuthFormHeader";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const isFpr = searchParams.get("fpr") === "true";

  const form = useForm<TResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email ?? "",
      token: token ?? "",
      new_password: "",
      confirm_password: "",
    },
  });

  const requirements = evaluatePassword(form.watch("new_password"));

  const router = useRouter();

  const { isLoading: isResetPasswordLoading } = useResetPassword();

  const { firstResetPassword, isLoading: isFirstResetPasswordLoading } =
    useFirstResetPassword();

  const onSubmit: SubmitHandler<TResetPasswordFormValues> = async ({
    new_password,
    confirm_password,
  }) => {
    if (email && token && isFpr) {
      await firstResetPassword({
        email,
        new_password: confirm_password && new_password,
      });
      router.push(AUTH_ROUTES.SIGN_IN);
      return;
    }

    if (email && token) {
      await firstResetPassword({
        email,
        new_password,
      });

      router.push(AUTH_ROUTES.SIGN_IN);
    }
  };

  return (
    <Fragment>
      <AuthFormHeader
        title='Create New Password'
        description='Create a strong password to secure your account.'
      />

      <Form {...form}>
        <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            type='password'
            label='Password'
            name='new_password'
            placeholder='Enter password'
            required
          />

          <FormInput
            type='password'
            label='Confirm Password'
            name='confirm_password'
            placeholder='Re-enter password'
            required
          />

          <PasswordStrengthIndicator requirements={requirements} />

          <Button
            type='submit'
            className='w-full'
            size='lg'
            isLoading={isResetPasswordLoading || isFirstResetPasswordLoading}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </Fragment>
  );
}
