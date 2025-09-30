"use client";
import { cn } from "@/lib/utils";

interface AvatarWithNameProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function AvatarWithName({
  title,
  subtitle,
  avatarUrl,
  size = "md",
  className,
}: AvatarWithNameProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className={cn(
        "rounded-full bg-[#4A4A7A] text-white flex items-center justify-center font-medium",
        sizeClasses[size]
      )}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={title}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitials(title)
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn(
          "font-medium text-gray-900 truncate",
          textSizeClasses[size]
        )}>
          {title}
        </p>
        {subtitle && (
          <p className={cn(
            "text-gray-500 truncate",
            size === "sm" ? "text-xs" : "text-sm"
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}