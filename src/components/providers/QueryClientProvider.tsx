"use client";
import {
    QueryClient,
    QueryClientProvider as QCProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

export default function QueryClientProvider({ children }: IProps) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 3000 * 60 * 5,
                refetchOnWindowFocus: false,
            },
        },
    });

    return <QCProvider client={queryClient}>{children}</QCProvider>;
}
