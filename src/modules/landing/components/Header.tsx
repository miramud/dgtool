"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { headerNavItems, serviceNavItems } from "../data/header-nav-items";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import Logo from "@/components/shared/Logo";
import Link from "next/link";
import { AUTH_ROUTES, LANDING_ROUTES } from "@/constants/routes";

export default function LandingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

    return (
        <>
            <header
                className="w-full bg-[#F8FDF6E5] border-b border-border py-2 relative z-40"
                data-aos="fade-in"
            >
                <div className="max-w-[80%] mx-auto px-4 py-4 flex items-center justify-between">
                    <Logo />

                    <nav className="hidden md:flex items-center space-x-8">
                        {headerNavItems.map(({ label, href, children }, i) => (
                            <div
                                key={i}
                                className="relative"
                                onMouseEnter={() => children && setIsServicesOpen(true)}
                                onMouseLeave={() => children && setIsServicesOpen(false)}
                            >
                                <Link
                                    href={href}
                                    className="text-[#181918] font-semibold text-base hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    {label}
                                    {children && (
                                        <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
                                    )}
                                </Link>

                                {children && isServicesOpen && (
                                    <div className="absolute top-full left-0 pt-2 w-64">
                                        <div className="bg-white rounded-lg shadow-lg border border-border py-2">
                                            {children.map((child, j) => (
                                                <Link
                                                    key={j}
                                                    href={child.href}
                                                    className="block px-4 py-3 text-sm font-medium text-[#181918] hover:bg-primary/5 hover:text-primary transition-colors"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-3 text-base">
                        <Link href={LANDING_ROUTES.CONTACT}>
                            <Button size="lg">Book Demo</Button>
                        </Link>
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
                <div className="md:hidden fixed inset-0 w-full h-full bg-white z-50 flex flex-col items-center justify-start pt-6 overflow-y-auto">
                    <div className="w-full px-4 py-4 flex justify-between items-center border-b border-border">
                        <Image
                            src="/images/logo.svg"
                            alt="StewardCore Logo"
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

                    <nav className="flex flex-col items-center space-y-4 w-full py-8">
                        <Link
                            href={LANDING_ROUTES.HOME}
                            className="text-[#181918] font-semibold text-xl hover:text-primary transition-colors py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>

                        <button
                            className="text-[#181918] font-semibold text-xl hover:text-primary transition-colors py-2 flex items-center gap-1"
                            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        >
                            Services
                            <ChevronDown className={`w-5 h-5 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                        </button>

                        {mobileServicesOpen && (
                            <div className="flex flex-col items-center space-y-3 pb-2">
                                {serviceNavItems.map((child, j) => (
                                    <Link
                                        key={j}
                                        href={child.href}
                                        className="text-[#475467] font-medium text-base hover:text-primary transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <Link
                            href={LANDING_ROUTES.ABOUT}
                            className="text-[#181918] font-semibold text-xl hover:text-primary transition-colors py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About Us
                        </Link>

                        <Link
                            href={LANDING_ROUTES.CONTACT}
                            className="text-[#181918] font-semibold text-xl hover:text-primary transition-colors py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact Us
                        </Link>
                    </nav>

                    <div className="flex flex-col space-y-4 w-3/4 max-w-xs px-4">
                        <Link href={AUTH_ROUTES.SIGN_UP}>
                            <Button
                                size="lg"
                                className="w-full"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Button>
                        </Link>

                        <Link href={AUTH_ROUTES.SIGN_IN}>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full bg-transparent"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
