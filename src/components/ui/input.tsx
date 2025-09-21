import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./button";

interface IProps extends React.ComponentProps<"input"> {
    icon?: React.ReactNode;
    suffix?: React.ReactNode;
}

function Input({ className, type, icon, suffix, ...props }: IProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputType, setInputType] = React.useState(type);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setInputType(showPassword ? "password" : "text");
    };

    return (
        <div className={cn("relative w-full", icon && "flex items-center")}>
            {icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 block">
                    {icon}
                </span>
            )}

            <input
                type={inputType}
                data-slot="input"
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-6 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-12 placeholder:text-gray text-foreground bg-transparent border-[#D6D6D6]",
                    className,
                    icon && "pl-10",
                    type === "password" && "pr-10"
                )}
                {...props}
            />

            {type === "password" && (
                <Button
                    type="button"
                    variant="ghost"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm p-0"
                    aria-label={
                        showPassword ? "Hide password" : "Show password"
                    }
                >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </Button>
            )}

            {suffix && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B3B3B3] text-base">
                    {suffix}
                </div>
            )}
        </div>
    );
}

export { Input };
