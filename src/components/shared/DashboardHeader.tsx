"use client";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useUserProfile } from "@/modules/userManagement/controllers/userController";
import NotificationDropdown from "./NotificationDropdown";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { data: profile, isLoading } = useUserProfile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }];

    if (segments.length > 1) {
      const currentPage = segments[segments.length - 1];
      const pageLabel =
        currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
      breadcrumbs.push({
        label: pageLabel === "Users" ? "My Users" : pageLabel,
        href: pathname,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <nav className='flex items-center space-x-2 text-sm text-gray-600'>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className='flex items-center'>
              {index > 0 && <ChevronRight className='h-4 w-4 mx-2' />}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "text-gray-900 font-medium"
                    : ""
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>

        <div className='flex items-center space-x-4'>
          <NotificationDropdown />

          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden'>
              {!isMounted || isLoading ? (
                <span className='text-sm font-medium text-gray-700'>...</span>
              ) : profile?.profile_picture ? (
                <Image
                  src={profile.profile_picture}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  width={32}
                  height={32}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-sm font-medium text-gray-700'>
                  {profile && profile.first_name && profile.last_name
                    ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(
                        0
                      )}`
                    : "U"}
                </span>
              )}
            </div>
            <div className='text-sm'>
              <p className='font-medium text-gray-900'>
                {!isMounted || isLoading
                  ? "Loading..."
                  : profile && profile.first_name && profile.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : "User"}
              </p>
              <p className='text-gray-500'>
                {!isMounted || isLoading
                  ? "Loading..."
                  : profile?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
