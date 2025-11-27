import DataCatalogue from "@/modules/dataCatalogue/views/DataCatalogue";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Catalogue - StewardCore",
    description:
        "Explore and manage your organization's data assets. Discover, understand, and govern your data catalog.",
};

export default function DataCataloguePage() {
    return <DataCatalogue />;
}
