"use client";
import {
    QueryClient,
    QueryClientProvider as QCProvider,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface IProps {
    children: ReactNode;
}

export default function QueryClientProvider({ children }: IProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 3000 * 60 * 5,
                refetchOnWindowFocus: false,
            },
        },
    }));

    return <QCProvider client={queryClient}>{children}</QCProvider>;
}
