import MetadataManagementPageClient from "@/modules/landing/components/MetadataManagementPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Metadata Management Tool & Data Dictionary for Oil & Gas | Steward Core",
    description:
        "Enhance data governance with Steward Core's metadata management tool. Centralize your data dictionary, ensure compliance, and improve operational insights in the oil and gas sector.",
    keywords:
        "metadata management tool, data dictionary, oil and gas metadata, metadata governance, data standardization",
};

export default function MetadataManagement() {
    return <MetadataManagementPageClient />;
}
