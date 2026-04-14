import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "../data/footer";
import { Dot } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="bg-[#181918] text-white">
            <div className="container py-16">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_1fr] gap-x-16 gap-y-8 md:gap-y-0 items-start justify-items-start">
                    <div>
                        <Image
                            src="/images/right-click-logo.svg"
                            alt="Right Click Solutions Logo"
                            width={200}
                            height={200}
                            className="w-[100px] mb-4"
                        />
                        <p className="text-sm text-white max-w-md leading-[24px]">
                            Experience unified, intelligent, and transparent
                            data management with StewardCore. Our advanced
                            platform provides 360-degree visibility into your
                            organization’s data landscape, ensuring seamless
                            governance, trusted insights, and optimal
                            decision-making across the enterprise.
                        </p>
                    </div>

                    <div className="min-w-[120px]">
                        <h3 className="text-white font-medium mb-4 text-lg">
                            Company
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {footerLinks.company.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="hover:text-white/80 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="min-w-[120px]">
                        <h3 className="text-white font-medium mb-4 text-lg">
                            Services
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {footerLinks.services.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="hover:text-white/80 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="min-w-[120px]">
                        <h3 className="text-white font-medium mb-4 text-lg">
                            Support
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {footerLinks.support.map(({ label, href }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="hover:text-white/80 transition-colors"
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4 text-lg">
                            Contact Us
                        </h3>
                        <address className="text-sm text-white not-italic max-w-xs">
                            Email:{" "}
                            <a
                                href="mailto:customersupport@nipex.com.ng"
                                className="hover:text-white"
                            >
                                info@rightclicksolutions.com.ng
                            </a>
                            <br />
                            <p className="mt-3">
                                45, TOS Benson crescent, Utako, Abuja, Nigeria
                            </p>
                        </address>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-white">
                        © {new Date().getFullYear()} StewardCore. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <a
                            href="#"
                            className="text-sm text-white hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </a>
                        <Dot className="h-4 w-4 text-white" />
                        <a
                            href="#"
                            className="text-sm text-white hover:text-white transition-colors"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
