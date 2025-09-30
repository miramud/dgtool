"use client";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownAndSearchProps {
  options: (string | DropdownOption)[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  selectedOption: string;
  dropdownPlaceholder: string;
  className?: string;
}

export default function DropdownAndSearch({
  options,
  onChange,
  value,
  placeholder = "Type here",
  onSelect,
  selectedOption,
  dropdownPlaceholder,
  className,
}: DropdownAndSearchProps) {
  return (
    <div className={cn("flex flex-row", className)}>
      {/* Dropdown */}
      <div className="relative">
        <select
          onChange={(e) => onSelect(e.target.value)}
          value={selectedOption}
          className="h-10 min-w-[140px] max-w-max w-full flex items-center border border-gray-300 border-r-0 bg-white px-3 rounded-l-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent appearance-none pr-8"
        >
          <option value="" disabled>
            {dropdownPlaceholder}
          </option>
          {options.map((option, i) => {
            const value = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            return (
              <option key={i} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-4 border border-gray-300 border-l-0 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent"
        />
      </div>
    </div>
  );
}