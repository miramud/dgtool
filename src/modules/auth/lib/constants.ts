import { AUTH_API_ROUTES } from "@/constants/api-routes";
import { axiosCaller } from "@/lib/helpers";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                totp: { label: "Totp", type: "number" },
            },
            async authorize(credentials) {
                try {
                    const loginRes = await axiosCaller.post(
                        AUTH_API_ROUTES.VERIFY_EMAIL,
                        {
                            email: credentials?.email,
                            totp: credentials?.totp,
                        }
                    );

                    return loginRes?.data?.data;
                } catch (error: any) {
                    if (error?.response?.data) {
                        console.log(error?.response?.data);
                        throw new Error(JSON.stringify(error.response.data));
                    }
                }

                return null;
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.token = user.token;
                token.first_time_login = user.first_time_login;
                token.user = user.user;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                token: token.token,
                first_time_login: token.first_time_login,
                user: token.user,
            };
            return session;
        },
    },
};

export const authHandler = NextAuth(authOptions);

export const passwordStrengthLabels = [
    {
        label: "Minimum 8 characters",
        name: "minLength",
    },

    {
        label: "At least one uppercase letter",
        name: "hasUppercase",
    },
    {
        label: "At least one number",
        name: "hasNumber",
    },
    {
        label: "At least one special character",
        name: "hasSpecialChar",
    },
];
