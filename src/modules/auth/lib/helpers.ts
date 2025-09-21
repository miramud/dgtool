import * as z from "zod";

export function createStrongPasswordSchema() {
    return (
        z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            // .regex(/[a-z]/, {
            //     message: "Password must contain at least one lowercase letter",
            // })
            .regex(/[A-Z]/, {
                message: "Password must contain at least one uppercase letter",
            })
            .regex(/[0-9]/, {
                message: "Password must contain at least one number",
            })
            .regex(/[^A-Za-z0-9]/, {
                message: "Password must contain at least one special character",
            })
    );
}

export function evaluatePassword(password: string) {
    return {
        minLength: password.length >= 8,
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };
}
