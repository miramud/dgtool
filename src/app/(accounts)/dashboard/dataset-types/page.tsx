import DatasetTypeManagement from "@/modules/metadataLibrary/views/DatasetTypeManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dataset Types - StewardCore",
    description:
        "Manage and organize different types of datasets in your data catalog. Define dataset categories to standardize data classification.",
};

export default function DatasetTypesPage() {
    return <DatasetTypeManagement />;
}
