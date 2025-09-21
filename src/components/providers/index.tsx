"use client";
import { ReactNode } from "react";
import QueryClientProvider from "./QueryClientProvider";
import { SessionProvider } from "./SessionProvider";
// import QueryClientProvider from "./query-client";
// import { SessionProvider } from "./session-provider";
// import { Provider } from "react-redux";
// import { store } from "../../store";

interface IProps {
    children: ReactNode;
}

export default function Providers({ children }: IProps) {
    return (
        // <Provider store={store}>
        <QueryClientProvider>
            <SessionProvider>{children}</SessionProvider>
        </QueryClientProvider>
        // </Provider>
    );
}
