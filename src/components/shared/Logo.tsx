import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    variant?: "default" | "light";
    className?: string;
}

export default function Logo({ variant = "default", className }: LogoProps) {
    return (
        <Link href="/" className="inline-block">
            <Image
                src="/images/logo.svg"
                alt="Data Loom Logo"
                width={200}
                height={200}
                className={cn(
                    "w-[130px]",
                    variant === "light" && "brightness-0 invert",
                    className
                )}
            />
        </Link>
    );
}
