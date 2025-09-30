"use client";
import { Bell, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
    const pathname = usePathname();
    
    const getBreadcrumbs = () => {
        const segments = pathname.split('/').filter(Boolean);
        
        const breadcrumbs = [
            { label: "Dashboard", href: "/dashboard" }
        ];
        
        if (segments.length > 1) {
            const currentPage = segments[segments.length - 1];
            const pageLabel = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
            breadcrumbs.push({ 
                label: pageLabel === "Users" ? "My Users" : pageLabel, 
                href: pathname 
            });
        }
        
        return breadcrumbs;
    };
    
    const breadcrumbs = getBreadcrumbs();
    
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.href} className="flex items-center">
                            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
                            <span className={index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : ""}>
                                {crumb.label}
                            </span>
                        </div>
                    ))}
                </nav>
                
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                    </Button>
                    
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">AS</span>
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">Ahmed Saleh</p>
                            <p className="text-gray-500">ahmedsaleh@email.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}