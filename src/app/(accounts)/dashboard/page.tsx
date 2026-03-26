import { Metadata } from "next";
import { DashboardView } from "@/modules/dashboard";

export const metadata: Metadata = {
    title: "Dashboard - StewardCore",
    description:
        "View key governance metrics including data quality, metadata completeness, and issue trends.",
};

export default function DashboardPage() {
    return <DashboardView />;
}
