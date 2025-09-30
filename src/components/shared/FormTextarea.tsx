import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";

interface IProps extends React.ComponentProps<"textarea"> {
    label?: string;
    description?: string;
    wrapperClassName?: string;
}

export default function FormTextarea({
    description,
    label,
    name,
    wrapperClassName,
    required,
    className,
    ...rest
}: IProps) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name ?? ""}
            render={({ field }) => (
                <FormItem className={cn("gap-1 w-full", wrapperClassName)}>
                    {label && (
                        <FormLabel>
                            {label}
                            {required && (
                                <span className="text-destructive">*</span>
                            )}
                        </FormLabel>
                    )}

                    {description && (
                        <FormDescription className="text-[12px] text-gray-600">
                            {description}
                        </FormDescription>
                    )}

                    <FormControl>
                        <textarea 
                            className={cn(
                                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                className
                            )}
                            {...rest} 
                            {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}