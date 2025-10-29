"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

interface TableOption {
  label: string | ((item: any) => React.ReactNode);
  permissions?: string[];
  action: (item: any) => void;
}

interface AdvancedTableProps {
  data: any[];
  columns: TableColumn[];
  isLoading?: boolean;
  showCheckBox?: boolean;
  options?: TableOption[];
  getFormattedValue: (item: any, columnKey: string) => React.ReactNode;
  onRowSelect?: (selectedItems: any[]) => void;
  onRowClick?: (item: any) => void;
  className?: string;
}

export default function AdvancedTable({
  data = [],
  columns,
  isLoading = false,
  showCheckBox = true,
  options = [],
  getFormattedValue,
  onRowSelect,
  onRowClick,
  className,
}: AdvancedTableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
      onRowSelect?.([]);
    } else {
      const allIndices = data.map((_, index) => index);
      setSelectedRows(allIndices);
      onRowSelect?.(data);
    }
  };

  const toggleRow = (index: number) => {
    const newSelectedRows = selectedRows.includes(index)
      ? selectedRows.filter((i) => i !== index)
      : [...selectedRows, index];

    setSelectedRows(newSelectedRows);
    onRowSelect?.(newSelectedRows.map((i) => data[i]));
  };

  if (isLoading) {
    return (
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='flex items-center justify-center py-16'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A4A7A]'></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
        className
      )}
    >
      <div className='overflow-x-auto min-w-0'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ width: column.width }}
                >
                  <div className='flex items-center gap-3'>
                    {index === 0 && showCheckBox && (
                      <Checkbox
                        checked={
                          selectedRows.length === data.length && data.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    )}
                    {column.header}
                  </div>
                </th>
              ))}
              {options.length > 0 && (
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className='hover:bg-gray-50'
                  onClick={() => onRowClick?.(item)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                    >
                      <div className='flex items-center gap-3'>
                        {colIndex === 0 && showCheckBox && (
                          <Checkbox
                            checked={selectedRows.includes(rowIndex)}
                            onClick={(e) => e.stopPropagation()}
                            onCheckedChange={() => {
                              toggleRow(rowIndex);
                            }}
                          />
                        )}
                        {getFormattedValue(item, column.key)}
                      </div>
                    </td>
                  ))}
                  {options.length > 0 && (
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          {options.map((option, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => option.action(item)}
                            >
                              {typeof option.label === "function"
                                ? option.label(item)
                                : option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (options.length > 0 ? 1 : 0)}
                  className='px-6 py-16 text-center text-gray-500'
                >
                  <div className='flex flex-col items-center'>
                    <div className='text-gray-400 mb-2'>
                      <svg
                        className='w-12 h-12'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1}
                          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                    </div>
                    <p className='text-lg font-medium'>No data found</p>
                    <p className='mt-1'>Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
