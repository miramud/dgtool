"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { X } from "lucide-react";
import { Policy } from "../types/policy";

interface ViewPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy | null;
  onPublish?: () => void;
}

export default function ViewPolicyModal({
  open,
  onOpenChange,
  policy,
  onPublish,
}: ViewPolicyModalProps) {
  if (!policy) return null;

  const isPublished = policy.status === "Published";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
          <DialogTitle className='text-xl font-semibold'>
            View Policy
          </DialogTitle>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        <div className='space-y-6'>
          {/* Policy Details Grid */}
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-600'>
                Policy Title
              </span>
              <span className='text-sm text-gray-900'>{policy.title}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-600'>
                Category
              </span>
              <span className='text-sm text-gray-900'>{policy.category}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-600'>
                Status (Draft/Published)
              </span>
              <span
                className={`text-sm px-2 py-1 rounded-md ${
                  policy.status === "Published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {policy.status}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-600'>
                Data Owner
              </span>
              <span className='text-sm text-gray-900'>{policy.dataOwner}</span>
            </div>

            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-600'>Domain</span>
              <span className='text-sm text-gray-900'>
                {policy.domains.join(", ")}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-600'>Date</span>
              <span className='text-sm text-gray-900'>
                {policy.effectiveDate}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-gray-600'>Description</h3>
            <div className='border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm text-gray-700 max-h-64 overflow-y-auto'>
              {policy.content ? (
                <div
                  className='prose prose-sm max-w-none'
                  dangerouslySetInnerHTML={{ __html: policy.content }}
                />
              ) : (
                <div>
                  <p className='mb-4'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Quis lobortis nisl cursus bibendum sit nulla accumsan
                    sodales ornare. At urna viverra non suspendisse neque,
                    lorem. Pretium condimentum pellentesque gravida id etiam sit
                    sed arcu euismod. Rhoncus proin orci duis scelerisque
                    molestie cursus tincidunt aliquam.
                  </p>
                  <p className='mb-4'>
                    <a
                      href='#'
                      className='text-blue-600 hover:text-blue-800 underline'
                    >
                      Link text reuse anchor component
                    </a>
                  </p>
                  <ul className='list-disc pl-5 mb-4 space-y-1'>
                    <li>unordered list item</li>
                    <li>
                      unordered list item unordered list item unordered list
                      item unordered list item unordered list item unordered
                      list item unordered list item unordered list item
                    </li>
                    <li>unordered list item</li>
                  </ul>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Quis lobortis nisl cursus bibendum sit nulla accumsan
                    sodales ornare. At urna viverra non suspendisse neque,
                    lorem. Pretium condimentum pellentesque gravida id etiam sit
                    sed arcu euismod. Rhoncus proin orci duis scelerisque
                    molestie cursus tincidunt aliquam.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Publish Button - Only show if not published */}
          {!isPublished && onPublish && (
            <div className='pt-4'>
              <Button
                onClick={onPublish}
                className='w-full h-12 bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white'
              >
                Publish
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
