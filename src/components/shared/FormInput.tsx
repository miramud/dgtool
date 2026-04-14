import * as React from "react";
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
    suggestions?: string[];
    suggestionMode?: "single" | "comma";
}

interface FormInputFieldProps extends IProps {
    field: {
        name: string;
        value: unknown;
        onChange: (...event: any[]) => void;
        onBlur: () => void;
    };
}

function FormInputField({
    field,
    description,
    label,
    type,
    wrapperClassName,
    required,
    icon,
    suggestions,
    suggestionMode = "single",
    ...rest
}: FormInputFieldProps) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const inputValue = typeof field.value === "string" ? field.value : "";
    const activeQuery =
        suggestionMode === "comma"
            ? inputValue.split(",").at(-1)?.trim().toLowerCase() ?? ""
            : inputValue.toLowerCase();
    const filteredSuggestions = React.useMemo(() => {
        if (!suggestions || suggestions.length === 0) {
            return [];
        }

        if (!activeQuery) {
            return suggestions.slice(0, 8);
        }

        return suggestions
            .filter((suggestion) =>
                suggestion.toLowerCase().includes(activeQuery)
            )
            .slice(0, 8);
    }, [activeQuery, suggestions]);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        field.onChange(event.target.value);
        rest.onChange?.(event);
        if (suggestions && suggestions.length > 0) {
            setOpen(true);
        }
    };

    const handleSuggestionSelect = (suggestion: string) => {
        if (suggestionMode === "comma") {
            const existingParts = inputValue
                .split(",")
                .slice(0, -1)
                .map((part) => part.trim())
                .filter(Boolean);

            field.onChange([...existingParts, suggestion].join(", "));
        } else {
            field.onChange(suggestion);
        }

        setOpen(false);
    };

    React.useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (!containerRef.current) {
                return;
            }

            if (!containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, []);

    return (
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
                <div ref={containerRef} className="relative w-full">
                    <Input
                        type={type}
                        {...rest}
                        {...field}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={(event) => {
                            rest.onFocus?.(event);
                            if (suggestions && suggestions.length > 0) {
                                setOpen(true);
                            }
                        }}
                        icon={icon}
                    />

                    {open && filteredSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                            <div className="max-h-56 overflow-y-auto">
                                {filteredSuggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            handleSuggestionSelect(suggestion);
                                        }}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}

export default function FormInput({
    description,
    label,
    name,
    type,
    wrapperClassName,
    required,
    icon,
    suggestions,
    suggestionMode = "single",
    ...rest
}: IProps) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name ?? ""}
            render={({ field }) => (
                <FormInputField
                    field={field}
                    description={description}
                    label={label}
                    name={name}
                    type={type}
                    wrapperClassName={wrapperClassName}
                    required={required}
                    icon={icon}
                    suggestions={suggestions}
                    suggestionMode={suggestionMode}
                    {...rest}
                />
            )}
        />
    );
}
