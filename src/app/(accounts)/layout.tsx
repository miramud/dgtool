import { ReactNode } from "react";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <DashboardSidebar />
      <div className='flex-1 flex flex-col'>
        <DashboardHeader />
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
}
