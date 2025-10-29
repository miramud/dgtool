import DataSetAssignmentView from "@/modules/dataStewardShip/views/DataSetAssignmentView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data SetAssignment View - Data Governance Tool",
  description:
    "View detailed information about a specific dataset including metadata, lineage, and access permissions.",
};

interface DataSetAssignmentViewPageProps {
  params: {
    id: string;
  };
}

export default function DataSetAssignmentViewPage({
  params,
}: DataSetAssignmentViewPageProps) {
  return <DataSetAssignmentView datasetId={params.id} />;
}
