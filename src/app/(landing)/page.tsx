import LandingPageClient from "@/modules/landing/components/LandingPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Governance Tool -  Take Control of Your Data with Smart Governance",
    description:
        " Ensure data quality, compliance, and trust with a platform designed for enterprises of all sizes. Our Data Governance platform helps enterprises ensure data quality, security, and compliance — all in one simple, modern workspace.",
    keywords:
        "data governance tool, best data governance software, enterprise data governance solutions, open source data governance tools, data governance platform, cloud data governance tools",
};

export default function LandingPage() {
    return <LandingPageClient />;
}
