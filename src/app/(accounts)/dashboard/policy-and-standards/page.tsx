import PoliciesAndStandards from "@/modules/policies/views/PoliciesAndStandards";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies & Standards - Data Governance Tool",
  description:
    "Manage and govern your organization's data policies and standards. Create, publish, and maintain compliance requirements.",
};

export default function PoliciesAndStandardsPage() {
  return <PoliciesAndStandards />;
}