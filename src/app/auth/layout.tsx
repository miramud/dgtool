import Logo from "@/components/shared/Logo";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-screen bg-[#F4F5F6] p-5">
            <div className="space-y-16 overflow-y-scroll scrollbar-none">
                <header className="container">
                    <Logo />
                </header>
                <section className="max-w-xl mx-auto space-y-6">
                    {children}
                </section>
            </div>

            <div className="bg-[url(/images/auth-bg.jpg)] bg-cover bg-top rounded-2xl hidden md:block"></div>
        </div>
    );
}
