import DataStewardshipAndOwnership from "@/modules/dataStewardShip/views/DataStewardshipAndOwnership";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Stewardship & Ownership - StewardCore",
    description:
        "Explore and manage your organization's data assets. Discover, understand, and govern your data catalog.",
};

export default function DataCataloguePage() {
    return <DataStewardshipAndOwnership />;
}
