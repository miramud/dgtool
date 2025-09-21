import { Input } from "@/components/ui/input";
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

interface IProps extends React.ComponentProps<"input"> {
    label?: string;
    description?: string;
    wrapperClassName?: string;
    icon?: React.ReactNode;
    suffix?: string;
}

export default function FormInput({
    description,
    label,
    name,
    type,
    wrapperClassName,
    required,
    icon,
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
                        <FormDescription className="text-[12px] text-grayi">
                            {description}
                        </FormDescription>
                    )}

                    <FormControl>
                        <Input type={type} {...rest} {...field} icon={icon} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
