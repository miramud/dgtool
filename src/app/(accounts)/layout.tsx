import { ReactNode } from "react";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <div className='flex-shrink-0'>
        <DashboardSidebar />
      </div>
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        <DashboardHeader />
        <main className='flex-1 p-6 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}
