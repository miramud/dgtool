import z from "zod";
import { createStrongPasswordSchema } from "./helpers";

export const signUpSchema = z
    .object({
        first_name: z.string().min(1, "Please enter your first name"),
        last_name: z.string().min(1, "Please enter your last name"),
        email: z
            .email("Please enter a valid email")
            .min(1, "Please enter an email"),
        password: createStrongPasswordSchema(),
        confirm_password: createStrongPasswordSchema(),
    })
    .check((ctx) => {
        const { password, confirm_password } = ctx.value;
        if (password !== confirm_password) {
            ctx.issues.push({
                code: "custom",
                message: "Passwords do not match",
                path: ["password"],
                input: password,
            });
            ctx.issues.push({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirm_password"],
                input: confirm_password,
            });
        }
    });

export const signInSchema = z.object({
    email: z
        .email("Please enter a valid email")
        .min(1, "Please enter your email"),
    password: z.string().min(1, "Please enter your password"),
});

export const forgotPasswordSchema = z.object({
    email: z
        .email("Please enter a valid email")
        .min(1, "Please enter your email"),
});

export const resetPasswordSchema = z.object({
    email: z.string(),
    token: z.string().min(6),
    new_password: createStrongPasswordSchema(),
    confirm_password: createStrongPasswordSchema(),
});
