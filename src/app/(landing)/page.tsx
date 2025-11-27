import LandingPageClient from "@/modules/landing/components/LandingPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "StewardCore -  Take Control of Your Data with Smart Governance",
    description:
        " Ensure data quality, compliance, and trust with a platform designed for enterprises of all sizes. Our StewardCore platform helps enterprises ensure data quality, security, and compliance — all in one simple, modern workspace.",
    keywords:
        "StewardCore, best StewardCore software, enterprise StewardCore solutions, open source StewardCores, StewardCore platform, cloud StewardCores",
};

export default function LandingPage() {
    return <LandingPageClient />;
}
