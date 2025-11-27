import WorkflowTemplates from "@/modules/workflows/views/WorkflowTemplates";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Approval Workflow Templates - StewardCore",
    description:
        "Manage approval workflows for StewardCore tasks. Assign, approve, and track governance-related tasks.",
};

export default function WorkflowsPage() {
    return <WorkflowTemplates />;
}
