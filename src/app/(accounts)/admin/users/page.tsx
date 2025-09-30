import EnhancedUserManagement from "@/modules/userManagement/components/EnhancedUserManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Users - Data Governance Tool",
  description:
    "Add and manage your internal users. Only authorized users can access your company dashboard on Rigshare.",
};

export default function UsersPage() {
  return <EnhancedUserManagement />;
}
