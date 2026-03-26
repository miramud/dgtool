import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface Option {
  value: string;
  label: string;
}

interface IProps extends React.ComponentProps<"select"> {
  label?: string;
  description?: string;
  wrapperClassName?: string;
  options: Option[];
  placeholder?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function FormSelect({
  description,
  label,
  name,
  wrapperClassName,
  required,
  options,
  placeholder = "Select an option",
  isLoading = false,
  emptyMessage = "No options available",
  disabled,
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
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}

          {description && (
            <FormDescription className='text-[12px] text-gray-600'>
              {description}
            </FormDescription>
          )}

          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
                {isLoading && (
                  <div className="ml-2">
                    <svg
                      className="animate-spin h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </div>
                ) : options.length > 0 ? (
                  options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {emptyMessage}
                  </div>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
