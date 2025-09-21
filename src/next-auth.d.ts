import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { IUser } from "./modules/auth/lib/types";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            token: string;
            first_time_login: boolean;
            user: IUser;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        token: string;
        first_time_login: boolean;
        user: IUser;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        token: string;
        first_time_login: boolean;
        user: IUser;
    }
}
