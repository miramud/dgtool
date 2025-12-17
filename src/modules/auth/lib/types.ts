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
export interface ILoginData {
  access_token: string | null;
  refresh_token: string | null;
  token_type: string;
  force_password_reset: boolean;
  is_mfa_required: boolean;
}
export interface ILoginResponse {
  status: boolean;
  message: string;
  data: ILoginData;
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
  profile_picture?: string;
  created_datetime: string;
  updated_datetime: string;
  roles?: Array<{
    id: string;
    name: string;
  }>;
}
