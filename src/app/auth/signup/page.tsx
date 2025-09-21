import SignUpClient from "@/modules/auth/components/SignUpClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up - Data Goveranance Tool",
    description:
        " Ensure data quality, compliance, and trust with a platform designed for enterprises of all sizes. Our Data Governance platform helps enterprises ensure data quality, security, and compliance — all in one simple, modern workspace.",
    keywords:
        "data governance tool, best data governance software, enterprise data governance solutions, open source data governance tools, data governance platform, cloud data governance tools",
};

export default function SignUpPage() {
    return <SignUpClient />;
}
