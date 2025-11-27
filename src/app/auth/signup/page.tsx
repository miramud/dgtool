import SignUpClient from "@/modules/auth/components/SignUpClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up - Data Goveranance Tool",
    description:
        " Ensure data quality, compliance, and trust with a platform designed for enterprises of all sizes. Our StewardCore platform helps enterprises ensure data quality, security, and compliance — all in one simple, modern workspace.",
    keywords:
        "StewardCore, best StewardCore software, enterprise StewardCore solutions, open source StewardCores, StewardCore platform, cloud StewardCores",
};

export default function SignUpPage() {
    return <SignUpClient />;
}
