"use client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Option {
  value: string;
  label: string;
}

interface FormMultiSelectProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options: Option[];
  wrapperClassName?: string;
  required?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function FormMultiSelect({
  name,
  label,
  description,
  placeholder = "Select options...",
  options,
  wrapperClassName,
  required,
  isLoading = false,
  emptyMessage = "No options available",
}: FormMultiSelectProps) {
  const form = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedValues = Array.isArray(field.value) ? field.value : [];
        
        const handleSelect = (optionValue: string) => {
          const newValue = selectedValues.includes(optionValue)
            ? selectedValues.filter((value: string) => value !== optionValue)
            : [...selectedValues, optionValue];
          field.onChange(newValue);
        };

        const handleRemove = (optionValue: string) => {
          const newValue = selectedValues.filter((value: string) => value !== optionValue);
          field.onChange(newValue);
        };

        const selectedOptions = options.filter(option => 
          selectedValues.includes(option.value)
        );

        return (
          <FormItem className={cn("gap-1 w-full", wrapperClassName)}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}

            {description && (
              <FormDescription className="text-[12px] text-gray-600">
                {description}
              </FormDescription>
            )}

            <FormControl>
              <div className="space-y-2">
                {/* Dropdown trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="text-left">
                      {selectedValues.length > 0
                        ? `${selectedValues.length} selected`
                        : placeholder}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>

                  {/* Dropdown content */}
                  {isOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-2 shadow-md">
                      <div className="max-h-64 overflow-auto space-y-2">
                        {isLoading ? (
                          <div className="text-sm text-muted-foreground p-2">Loading...</div>
                        ) : options.length > 0 ? (
                          options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${name}-${option.value}`}
                                checked={selectedValues.includes(option.value)}
                                onCheckedChange={() => handleSelect(option.value)}
                              />
                              <label
                                htmlFor={`${name}-${option.value}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground p-2">{emptyMessage}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected items display */}
                {selectedOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{option.label}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove(option.value)}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}