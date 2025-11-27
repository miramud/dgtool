import WorkflowTemplates from "@/modules/workflows/views/WorkflowTemplates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Approval Workflow Templates - Data Governance Tool",
  description:
    "Manage approval workflows for data governance tasks. Assign, approve, and track governance-related tasks.",
};

export default function WorkflowsPage() {
  return <WorkflowTemplates />;
}
