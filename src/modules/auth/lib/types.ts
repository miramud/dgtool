import z from "zod";
import {
    forgotPasswordSchema,
    resetPasswordSchema,
    signInSchema,
    signUpSchema,
} from "./validators";

export type TSignUpFormValues = z.infer<typeof signUpSchema>;

export interface ISignUpResponse {
    status: boolean;
    message: string;
    user_id: string;
}

export interface TVerifyEmailFormValues {
    email: string;
    totp: string;
}

export type TSignInFormValues = z.infer<typeof signInSchema>;

export type TForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type TResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string | null;
    created_datetime: string;
    updated_datetime: string;
}
