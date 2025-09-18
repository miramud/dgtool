"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { headerNavItems } from "../data/header-nav-items";
import Image from "next/image";
import { X } from "lucide-react";

export default function LandingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header
                className="w-full bg-[#F8FDF6E5] border-b border-border py-2 relative z-40"
                data-aos="fade-in"
            >
                <div className="max-w-[80%] mx-auto px-4 py-4 flex items-center justify-between">
                    <Image
                        src="/images/logo.svg"
                        alt="Data Loom Logo"
                        width={200}
                        height={200}
                        className="w-[130px]"
                    />

                    <nav className="hidden md:flex items-center space-x-8">
                        {headerNavItems.map(({ label, href }, i) => (
                            <a
                                key={i}
                                href={href}
                                className="text-[#181918] font-semibold text-base hover:text-primary transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-3 text-base">
                        <Button size="lg">Sign Up</Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-transparent"
                        >
                            Sign In
                        </Button>
                    </div>

                    <button
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                                isMenuOpen
                                    ? "rotate-45 translate-y-1"
                                    : "-translate-y-0.5"
                            }`}
                        ></span>
                        <span
                            className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                                isMenuOpen ? "opacity-0" : "opacity-100"
                            }`}
                        ></span>
                        <span
                            className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                                isMenuOpen
                                    ? "-rotate-45 -translate-y-1"
                                    : "translate-y-0.5"
                            }`}
                        ></span>
                    </button>
                </div>
            </header>

            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 w-full h-full bg-white z-50 flex flex-col items-center justify-start pt-6">
                    <div className="w-full px-4 py-4 flex justify-between items-center border-b border-border">
                        <Image
                            src="/images/logo.svg"
                            alt="Data Loom Logo"
                            width={150}
                            height={150}
                            className="w-[100px]"
                        />

                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <X className="text-[#181918] h-6 w-6" />
                        </Button>
                    </div>

                    <nav className="flex flex-col items-center space-y-6 w-full py-8">
                        {headerNavItems.map(({ label, href }, i) => (
                            <a
                                key={i}
                                href={href}
                                className="text-[#181918] font-semibold text-xl hover:text-primary transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex flex-col space-y-4 w-3/4 max-w-xs px-4">
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign Up
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full bg-transparent"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign In
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
