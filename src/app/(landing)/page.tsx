import LandingPageClient from "@/modules/landing/components/LandingPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Governance Platform for Oil & Gas | Steward Core",
    description:
        "Data governance platform for oil and gas companies. Improve data quality, compliance, lineage, and decision-making with Steward Core.",
    keywords:
        "data governance platform, oil and gas data governance, enterprise data catalog, data lineage, metadata management, Steward Core",
};

export default function LandingPage() {
    return <LandingPageClient />;
}
