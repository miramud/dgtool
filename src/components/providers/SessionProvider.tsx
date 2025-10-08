"use client";
import { SessionProvider as AuthProvider } from "next-auth/react";
import { SessionMonitor } from "../auth/SessionMonitor";

export function SessionProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SessionMonitor />
            {children}
        </AuthProvider>
    );
}
