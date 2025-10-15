"use client";
import { useState, useEffect } from "react";
import {
  // LayoutDashboard,
  Database,
  BarChart3,
  Users,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Grid3X3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";

interface SubItem {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: any;
  hasDropdown?: boolean;
  subItems?: SubItem[];
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Grid3X3,
  },
  {
    title: "Data Catalogue",
    href: "/dashboard/data-catalogue",
    icon: Database,
    hasDropdown: true,
    subItems: [
      { title: "Data Catalogue", href: "/dashboard/data-catalogue" },
      { title: "Metadata Library", href: "/dashboard/metadata-library" },
      { title: "Dataset Types", href: "/dashboard/dataset-types" },
    ],
  },
  {
    title: "Data Quality",
    href: "/dashboard/data-quality",
    icon: BarChart3,
  },
  {
    title: "Data Stewardship & Ownership",
    href: "/dashboard/data-stewardship",
    icon: Users,
  },
  {
    title: "Data Security & Privacy",
    href: "/dashboard/data-security",
    icon: Shield,
    hasDropdown: true,
    subItems: [
      { title: "Role Management", href: "/admin/roles" },
      { title: "User Management", href: "/admin/users" },
      { title: "Audit Logs", href: "/dashboard/audit-logs" },
    ],
  },
  {
    title: "Workflow & Automation",
    href: "/dashboard/workflow",
    icon: Settings,
    hasDropdown: true,
    subItems: [],
  },
];

const settingsNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

// const bottomNavItems = [
//   {
//     title: "Help & Support",
//     href: "/dashboard/help",
//     icon: HelpCircle,
//     hasDropdown: true,
//     subItems: [],
//   },
// ];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { logout, isLoggingOut } = useLogout();

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  // Auto-expand parent menu if user is on a sub-page
  useEffect(() => {
    const currentItem = mainNavItems.find((item) =>
      item.subItems?.some((sub) => pathname === sub.href)
    );
    if (currentItem && !expandedItems.includes(currentItem.title)) {
      setExpandedItems((prev) => [...prev, currentItem.title]);
    }
  }, [pathname, expandedItems]);

  return (
    <div
      className={cn(
        "text-white flex flex-col transition-all duration-300 rounded-br-[12px] rounded-tr-[12px] h-screen overflow-scroll",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{ backgroundColor: "#544587" }}
    >
      {/* Header */}
      <div className='p-6 relative flex items-center'>
        {!isCollapsed && (
          <div className='flex items-center'>
            <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3'>
              <span style={{ color: "#544587" }} className='font-bold text-lg'>
                DL
              </span>
            </div>
            <span className='text-xl font-medium'>Data Loom</span>
          </div>
        )}
        {isCollapsed && (
          <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center'>
            <span style={{ color: "#544587" }} className='font-bold text-lg'>
              DL
            </span>
          </div>
        )}
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white text-gray-600 hover:bg-gray-100 w-7 h-7 rounded-[8px] border'
        >
          {isCollapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </Button>
      </div>

      {/* Divider */}
      <hr className='border-gray-400 mx-6 mb-6' />

      <nav className='flex-1 px-4 space-y-1'>
        {/* MAIN Section */}
        {!isCollapsed && (
          <p className='text-sm font-medium text-gray-200 tracking-wider px-3 py-2 mb-2'>
            MAIN
          </p>
        )}

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            item.subItems?.some((sub) => pathname === sub.href);
          const isExpanded = expandedItems.includes(item.title);

          return (
            <div key={item.title}>
              {item.hasDropdown ? (
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-3 text-sm rounded-lg transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-gray-200 hover:bg-white/10 hover:text-white",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <div className='flex items-center'>
                    <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.title}
                  </div>
                  {!isCollapsed && item.hasDropdown && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded ? "rotate-180" : ""
                      )}
                    />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm rounded-lg transition-colors group relative",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-gray-200 hover:bg-white/10 hover:text-white",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.title}
                  {isCollapsed && (
                    <div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50'>
                      {item.title}
                    </div>
                  )}
                </Link>
              )}

              {/* Sub-items */}
              {!isCollapsed &&
                item.hasDropdown &&
                isExpanded &&
                item.subItems && (
                  <div className='ml-8 mt-2 space-y-1'>
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                          pathname === subItem.href
                            ? "bg-white/30 text-white"
                            : "text-gray-200 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <div className='w-2 h-2 bg-gray-400 rounded-full mr-3'></div>
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          );
        })}

        {/* Divider */}
        <hr className='border-gray-400 my-6' />

        {/* SETTINGS Section */}
        {!isCollapsed && (
          <p className='text-sm font-medium text-gray-200 tracking-wider px-3 py-2 mb-2'>
            SETTINGS
          </p>
        )}

        {settingsNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isExpanded = expandedItems.includes(item.title);

          return (
            <div key={item.title}>
              {item.hasDropdown ? (
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-3 text-sm rounded-lg transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-gray-200 hover:bg-white/10 hover:text-white",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <div className='flex items-center'>
                    <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.title}
                  </div>
                  {!isCollapsed && item.hasDropdown && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded ? "rotate-180" : ""
                      )}
                    />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm rounded-lg transition-colors group relative",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-gray-200 hover:bg-white/10 hover:text-white",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.title}
                  {isCollapsed && (
                    <div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50'>
                      {item.title}
                    </div>
                  )}
                </Link>
              )}

              {/* Settings Sub-items */}
              {!isCollapsed &&
                item.hasDropdown &&
                isExpanded &&
                item.subItems && (
                  <div className='ml-8 mt-2 space-y-1'>
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                          pathname === subItem.href
                            ? "bg-white/30 text-white"
                            : "text-gray-200 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <div className='w-2 h-2 bg-gray-400 rounded-full mr-3'></div>
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className='p-4 space-y-1'>
        <button
          onClick={() => toggleExpanded("Help & Support")}
          className={cn(
            "flex items-center justify-between w-full px-3 py-3 text-sm rounded-lg transition-colors text-gray-200 hover:bg-white/10 hover:text-white",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Help & Support" : undefined}
        >
          <div className='flex items-center'>
            <HelpCircle className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && "Help & Support"}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                expandedItems.includes("Help & Support") ? "rotate-180" : ""
              )}
            />
          )}
        </button>

        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className={cn(
            "flex items-center px-3 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors w-full group relative",
            isCollapsed && "justify-center",
            isLoggingOut && "opacity-50 cursor-not-allowed"
          )}
          title={isCollapsed ? "Log Out" : undefined}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && (isLoggingOut ? "Logging Out..." : "Log Out")}
          {isCollapsed && (
            <div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50'>
              {isLoggingOut ? "Logging Out..." : "Log Out"}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
