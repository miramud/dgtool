import { Metadata } from "next";
import { DashboardView } from "@/modules/dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard - Data Governance Tool",
  description:
    "View key governance metrics including data quality, metadata completeness, and issue trends.",
};

export default function AdminDashboardPage() {
  return <DashboardView userRole="admin" userName="Ahmed" />;
}
