import { Metadata } from "next";
import { DashboardView } from "@/modules/dashboard";

export const metadata: Metadata = {
  title: "Dashboard - Data Governance Tool",
  description:
    "View key governance metrics including data quality, metadata completeness, and issue trends.",
};

export default function DashboardPage() {
  // In a real app, get user role from auth context/session
  // For demo, default to admin view
  return <DashboardView userRole="admin" userName="Ahmed" />;
}
