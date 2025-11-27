import EnhancedRoleManagement from "@/modules/userManagement/components/EnhancedRoleManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Users - StewardCore",
    description:
        "Add and manage your internal users. Only authorized users can access your company dashboard on Rigshare.",
};

export default function UsersPage() {
    return <EnhancedRoleManagement />;
}
