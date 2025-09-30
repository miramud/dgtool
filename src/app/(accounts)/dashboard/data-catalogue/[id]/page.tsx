import DataCatalogueView from "@/modules/dataCatalogue/views/DataCatalogueView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Catalogue View - Data Governance Tool",
  description:
    "View detailed information about a specific dataset including metadata, lineage, and access permissions.",
};

interface DataCatalogueViewPageProps {
  params: {
    id: string;
  };
}

export default function DataCatalogueViewPage({ params }: DataCatalogueViewPageProps) {
  return <DataCatalogueView datasetId={params.id} />;
}