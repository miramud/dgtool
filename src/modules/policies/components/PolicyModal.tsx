"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import { PolicyFormData, PolicyCategory } from "../types/policy";
import RichTextEditor from "@/components/shared/RichTextEditor";

interface PolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PolicyFormData, isDraft: boolean) => void;
  policy?: any; // For editing existing policies
}

export default function PolicyModal({
  open,
  onOpenChange,
  onSubmit,
  policy,
}: PolicyModalProps) {
  const [formData, setFormData] = useState<PolicyFormData>({
    title: policy?.title || "",
    category: policy?.category || "",
    description: policy?.description || "",
    content: policy?.content || "",
    domains: policy?.domains || [],
    dataOwner: policy?.dataOwner || "",
    effectiveDate: policy?.effectiveDate || "",
    reviewDate: policy?.reviewDate || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for dropdowns
  const domainOptions = [
    "All",
    "Finance",
    "HR", 
    "Legal",
    "Compliance",
    "Engineering",
    "Analytics",
    "IT",
    "Security",
    "Marketing",
    "Operations",
  ];

  const ownerOptions = [
    "Ibrahim Musa",
    "Chinwe Okonkwo", 
    "Sarah Wilson",
    "Alex Chen",
    "David Rodriguez",
    "Mike Johnson",
    "Emily Davis",
    "Lisa Anderson",
    "John Doe",
    "Jane Smith",
  ];

  const handleInputChange = (field: keyof PolicyFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (isDraft: boolean) => {
    setIsSubmitting(true);
    try {
      onSubmit(formData, isDraft);
      onOpenChange(false);
      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        content: "",
        domains: [],
        dataOwner: "",
        effectiveDate: "",
        reviewDate: "",
      });
    } catch (error) {
      console.error("Error submitting policy:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDomainSelect = (domain: string) => {
    const currentDomains = formData.domains;
    if (currentDomains.includes(domain)) {
      handleInputChange("domains", currentDomains.filter(d => d !== domain));
    } else {
      handleInputChange("domains", [...currentDomains, domain]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            {policy ? "Edit Policy" : "Assign Data Steward"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* First Row - Policy Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Policy Title
              </label>
              <Input
                placeholder="Enter policy title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="h-12 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Policy Category
              </label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="h-12 border-gray-300">
                  <SelectValue placeholder="Enter policy category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PolicyCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row - Domains & Owner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Domains
              </label>
              <Select onValueChange={handleDomainSelect}>
                <SelectTrigger className="h-12 border-gray-300">
                  <SelectValue placeholder="Select Domains" />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.domains.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.domains.map((domain) => (
                    <span
                      key={domain}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {domain}
                      <button
                        type="button"
                        onClick={() => handleDomainSelect(domain)}
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Owner
              </label>
              <Select 
                value={formData.dataOwner} 
                onValueChange={(value) => handleInputChange("dataOwner", value)}
              >
                <SelectTrigger className="h-12 border-gray-300">
                  <SelectValue placeholder="Select Owner" />
                </SelectTrigger>
                <SelectContent>
                  {ownerOptions.map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      {owner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Third Row - Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Effective Date
              </label>
              <Input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => handleInputChange("effectiveDate", e.target.value)}
                className="h-12 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Review Date
              </label>
              <Input
                type="date"
                value={formData.reviewDate}
                onChange={(e) => handleInputChange("reviewDate", e.target.value)}
                className="h-12 border-gray-300"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Policy Content
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => handleInputChange("content", content)}
              placeholder="Enter policy content..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="flex-1 h-12 bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white"
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              variant="outline"
              className="flex-1 h-12 border-gray-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save as draft"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}