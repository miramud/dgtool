import { Select } from "@/components/ui/select";
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
}

export default function FormSelect({
  description,
  label,
  name,
  wrapperClassName,
  required,
  options,
  placeholder = "Select an option",
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
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}

          {description && (
            <FormDescription className='text-[12px] text-gray-600'>
              {description}
            </FormDescription>
          )}

          <FormControl>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Select {...rest} {...field}>
              <option value=''>{placeholder}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
