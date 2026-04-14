import DataCatalogPageClient from "@/modules/landing/components/DataCatalogPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Enterprise Data Catalog for Oil & Gas | Steward Core",
    description:
        "Enterprise data catalog for oil and gas. Improve data cataloging and discovery, metadata governance, and upstream data visibility.",
    keywords:
        "enterprise data catalog, data cataloging and discovery, upstream data catalog, oil and gas data catalog, data discovery platform",
};

export default function DataCatalog() {
    return <DataCatalogPageClient />;
}
