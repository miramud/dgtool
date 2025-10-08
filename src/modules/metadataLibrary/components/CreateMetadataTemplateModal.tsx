"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MetadataTemplate, MetadataField, CreateMetadataTemplateRequest } from "../types/metadataTemplate";

interface CreateMetadataTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: MetadataTemplate;
  onSuccess?: (template: MetadataTemplate) => void;
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
  { value: "boolean", label: "Boolean" },
];

const datasetTypes = [
  "Seismic Data",
  "Well Logs", 
  "Production Data",
  "HSE Records",
  "Geological Data",
  "Reservoir Data"
];

export default function CreateMetadataTemplateModal({
  open,
  onOpenChange,
  template,
  onSuccess,
}: CreateMetadataTemplateModalProps) {
  const [templateName, setTemplateName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [datasetType, setDatasetType] = useState(template?.datasetType || "");
  const [fields, setFields] = useState<Omit<MetadataField, 'id'>[]>(
    template?.fields.map(f => ({ ...f, id: undefined })) || []
  );
  const [showAddField, setShowAddField] = useState(false);
  
  // Field form state
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<MetadataField['type']>("text");
  const [isRequired, setIsRequired] = useState(false);
  const [isSensitive, setIsSensitive] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  const isEdit = !!template;

  const resetForm = () => {
    setTemplateName("");
    setDescription("");
    setDatasetType("");
    setFields([]);
    setShowAddField(false);
    resetFieldForm();
  };

  const resetFieldForm = () => {
    setFieldName("");
    setFieldType("text");
    setIsRequired(false);
    setIsSensitive(false);
    setDropdownOptions([]);
    setNewOption("");
  };

  const handleAddOption = () => {
    if (newOption.trim() && !dropdownOptions.includes(newOption.trim())) {
      setDropdownOptions([...dropdownOptions, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setDropdownOptions(dropdownOptions.filter((_, i) => i !== index));
  };

  const handleSaveField = () => {
    if (!fieldName.trim()) return;

    const newField: Omit<MetadataField, 'id'> = {
      name: fieldName,
      type: fieldType,
      required: isRequired,
      sensitive: isSensitive,
      ...(fieldType === 'dropdown' && { options: dropdownOptions }),
    };

    setFields([...fields, newField]);
    setShowAddField(false);
    resetFieldForm();
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!templateName.trim() || !datasetType) return;

    const templateData: CreateMetadataTemplateRequest = {
      name: templateName,
      description,
      datasetType,
      fields,
    };

    // Create new template with generated ID and metadata
    const newTemplate: MetadataTemplate = {
      id: template?.id || Date.now().toString(),
      ...templateData,
      fieldsNumber: fields.length,
      createdBy: "Current User",
      lastModified: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'active',
      fields: fields.map((field, index) => ({
        ...field,
        id: (index + 1).toString()
      }))
    };

    onSuccess?.(newTemplate);
    onOpenChange(false);
    resetForm();
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Template" : "Template Info"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Template Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  placeholder="Enter Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datasetType">Dataset type</Label>
                <Select value={datasetType} onValueChange={setDatasetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dataset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasetTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Fields Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Fields</h3>
              <Button
                variant="outline"
                onClick={() => setShowAddField(true)}
                className="text-[#4A4A7A]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Fields
              </Button>
            </div>

            {/* Existing Fields Table */}
            {fields.length > 0 && (
              <div className="border rounded-lg overflow-hidden mb-4">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Field Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Required?
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Sensitive?
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        More
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {field.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                          {field.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {field.required ? "Yes" : "Optional"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {field.sensitive ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveField(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add Field Form */}
            {showAddField && (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fieldName">Field Name</Label>
                  <Input
                    id="fieldName"
                    placeholder="Enter Template Name"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fieldType">Field Type</Label>
                  <Select value={fieldType} onValueChange={(value) => setFieldType(value as MetadataField['type'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dataset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dropdown Options */}
                {fieldType === 'dropdown' && (
                  <div className="space-y-2">
                    <Label>Dropdown Options</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add option"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                      />
                      <Button type="button" onClick={handleAddOption}>
                        Add
                      </Button>
                    </div>
                    {dropdownOptions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {dropdownOptions.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-white border rounded px-2 py-1 text-sm"
                          >
                            {option}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveOption(index)}
                              className="h-4 w-4 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="required"
                      checked={isRequired}
                      onCheckedChange={setIsRequired}
                    />
                    <Label htmlFor="required">Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sensitive"
                      checked={isSensitive}
                      onCheckedChange={setIsSensitive}
                    />
                    <Label htmlFor="sensitive">Sensitive</Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSaveField}
                    disabled={!fieldName.trim()}
                    className="bg-[#4A4A7A] hover:bg-[#3A3A6A]"
                  >
                    Save Field
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddField(false);
                      resetFieldForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!templateName.trim() || !datasetType}
            className="bg-[#4A4A7A] hover:bg-[#3A3A6A]"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}