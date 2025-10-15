"use client";
import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, ChevronDown, Check } from "lucide-react";
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
import {
  MetadataTemplate,
  MetadataField,
  convertFieldToApi,
} from "../types/metadataTemplate";
import { useGetDatasetTypes } from "../controllers/datasetTypeController";
import {
  useCreateMetadataTemplate,
  useGetMetadataTemplate,
  useUpdateMetadataTemplate,
} from "../controllers/metadataTemplateController";
// import { useUpdateMetadataTemplate } from "@/hooks/useMetadataTemplates";

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

const fieldAttributeOptions = [
  { value: "searchable", label: "Searchable" },
  { value: "filterable", label: "Filterable" },
  { value: "sortable", label: "Sortable" },
  { value: "exportable", label: "Exportable" },
  { value: "indexable", label: "Indexable" },
];

function CreateMetadataTemplateModal({
  open,
  onOpenChange,
  template,
  onSuccess,
}: CreateMetadataTemplateModalProps) {
  console.log({ template });

  const { data: datasetTypesResponse, isLoading: isLoadingDatasetTypes } =
    useGetDatasetTypes({
      is_archived: false,
    });

  const { createTemplate, isLoading: isCreating } = useCreateMetadataTemplate();
  const { updateTemplate, isLoading: isUpdating } = useUpdateMetadataTemplate(
    template?.id || ""
  );

  // Fetch template data for editing when template.id is provided
  const {
    data: fetchedTemplateData,
    isLoading: isFetchingTemplate,
    error: fetchError,
  } = useGetMetadataTemplate(template?.id || "");

  console.log({
    fetchedTemplateData,
    isFetchingTemplate,
    fetchError,
    templateId: template?.id,
  });

  const [templateName, setTemplateName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [datasetType, setDatasetType] = useState(
    template?.dataset_type?.name || ""
  );
  const [fields, setFields] = useState<Omit<MetadataField, "id">[]>(
    template?.fields?.map((f) => ({ ...f, id: undefined })) || []
  );
  const [showAddField, setShowAddField] = useState(false);

  // Field form state
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] =
    useState<MetadataField["field_type"]>("text");
  const [isRequired, setIsRequired] = useState(false);
  const [isSensitive, setIsSensitive] = useState(false);
  const [fieldFieldAttributes, setFieldFieldAttributes] = useState<string[]>(
    []
  );
  const [showFieldAttributeDropdown, setShowFieldAttributeDropdown] =
    useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  const isEdit = !!template;

  // Auto-populate fields when template data is available
  useEffect(() => {
    const templateData = fetchedTemplateData || template;

    if (templateData) {
      setTemplateName(templateData.name || "");
      setDescription(templateData.description || "");
      // Handle different possible dataset type field names
      const datasetTypeName =
        templateData.dataset_type?.name || templateData.category || "";
      setDatasetType(datasetTypeName);
      setFields(
        templateData.fields?.map((f) => ({ ...f, id: undefined })) || []
      );
    } else if (!template) {
      // Reset form when no template (create mode)
      setTemplateName("");
      setDescription("");
      setDatasetType("");
      setFields([]);
    }
  }, [template, fetchedTemplateData]);

  const resetForm = () => {
    setTemplateName("");
    setDescription("");
    setDatasetType("");
    setFields([]);
    setShowAddField(false);
    resetFieldForm();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showFieldAttributeDropdown) {
        setShowFieldAttributeDropdown(false);
      }
    };

    if (showFieldAttributeDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFieldAttributeDropdown]);

  const resetFieldForm = () => {
    setFieldName("");
    setFieldType("text");
    setIsRequired(false);
    setIsSensitive(false);
    setFieldFieldAttributes([]);
    setShowFieldAttributeDropdown(false);
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

    const newField: Omit<MetadataField, "id"> = {
      field_name: fieldName,
      field_type: fieldType,
      is_required: isRequired,
      is_sensitive: isSensitive,
      attributes: fieldFieldAttributes,
      ...(fieldType === "dropdown" && { options: dropdownOptions }),
    };

    setFields([...fields, newField]);
    setShowAddField(false);
    resetFieldForm();
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!templateName.trim() || !datasetType) return;

    console.log({ datasetType });

    // Find the selected dataset type to get its ID
    const selectedDatasetType = datasetTypesResponse?.data?.results?.find(
      (type) => type.name === datasetType
    );

    if (!selectedDatasetType) {
      console.error("Selected dataset type not found");
      return;
    }

    try {
      const apiPayload = {
        name: templateName,
        description: description || "",
        is_active: true,
        dataset_type: selectedDatasetType.id,
        fields: fields.map(convertFieldToApi),
      };
      // console.log({ apiPayload });

      if (template) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = updateTemplate(apiPayload);

        if (result) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onSuccess?.(result.data || result);
          onOpenChange(false);
          resetForm();
        }
      } else {
        const result = await createTemplate(apiPayload);

        if (result) {
          onSuccess?.(result.data || result);
          onOpenChange(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Template" : "Template Info"}
            {isFetchingTemplate && " (Loading...)"}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Template Info Section */}
          <div>
            <h3 className='text-lg font-medium mb-4'>Template Info</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='templateName'>Template Name</Label>
                <Input
                  id='templateName'
                  placeholder='Enter Template Name'
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
            </div>
            <div className='space-y-2 mt-4'>
              <Label htmlFor='datasetType'>Dataset type</Label>
              <Select
                value={datasetType}
                onValueChange={setDatasetType}
                disabled={isLoadingDatasetTypes}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingDatasetTypes
                        ? "Loading..."
                        : "Select dataset type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {datasetTypesResponse?.data?.results?.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2 mt-4'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='Enter a description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Fields Section */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium'>Fields</h3>
              <Button
                variant='outline'
                onClick={() => setShowAddField(true)}
                className='text-[#4A4A7A]'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Fields
              </Button>
            </div>

            {/* Existing Fields Table */}
            {fields.length > 0 && (
              <div className='border rounded-lg overflow-hidden mb-4'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                        Field Name
                      </th>
                      <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                        Type
                      </th>
                      <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                        Required?
                      </th>
                      <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                        Sensitive?
                      </th>
                      <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                        Attributes
                      </th>
                      <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                        More
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={index} className='border-t'>
                        <td className='px-4 py-3 text-sm text-gray-900'>
                          {field.field_name}
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900 capitalize'>
                          {field.field_type}
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900'>
                          {field.is_required ? "Yes" : "Optional"}
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900'>
                          {field.is_sensitive ? "Yes" : "No"}
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900'>
                          {field.attributes && field.attributes.length > 0 ? (
                            <div className='flex flex-wrap gap-1'>
                              {field.attributes.map((attr, attrIndex) => {
                                const attrLabel =
                                  fieldAttributeOptions.find(
                                    (opt) => opt.value === attr
                                  )?.label || attr;
                                return (
                                  <span
                                    key={attrIndex}
                                    className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'
                                  >
                                    {attrLabel}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className='text-gray-400 text-xs'>None</span>
                          )}
                        </td>
                        <td className='px-4 py-3 text-sm'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleRemoveField(index)}
                            className='text-red-600 hover:text-red-700'
                          >
                            <X className='w-4 h-4' />
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
              <div className='border rounded-lg p-4 bg-gray-50 space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='fieldName'>Field Name</Label>
                  <Input
                    id='fieldName'
                    placeholder='Enter Template Name'
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='fieldType'>Field Type</Label>
                  <Select
                    value={fieldType}
                    onValueChange={(value) =>
                      setFieldType(value as MetadataField["field_type"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select dataset type' />
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

                {/* Field Attribute Multi-Select */}
                <div className='space-y-2'>
                  <Label htmlFor='fieldAttributes'>Field Attribute</Label>
                  <div className='relative'>
                    <div
                      className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:bg-accent'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowFieldAttributeDropdown(
                          !showFieldAttributeDropdown
                        );
                      }}
                    >
                      <div className='flex flex-wrap gap-1 flex-1'>
                        {fieldFieldAttributes.length === 0 ? (
                          <span className='text-muted-foreground'>
                            Select field attributes
                          </span>
                        ) : (
                          <span className='text-sm'>
                            {fieldFieldAttributes.length} attribute
                            {fieldFieldAttributes.length !== 1 ? "s" : ""}{" "}
                            selected...
                          </span>
                        )}
                      </div>
                      <ChevronDown className='h-4 w-4 opacity-50' />
                    </div>

                    {showFieldAttributeDropdown && (
                      <div className='absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                        {fieldAttributeOptions.map((attribute) => (
                          <div
                            key={attribute.value}
                            className='flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer'
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setFieldFieldAttributes((prev) =>
                                prev.includes(attribute.value)
                                  ? prev.filter((a) => a !== attribute.value)
                                  : [...prev, attribute.value]
                              );
                            }}
                          >
                            <div className='w-4 h-4 flex items-center justify-center'>
                              {fieldFieldAttributes.includes(
                                attribute.value
                              ) && <Check className='w-4 h-4 text-blue-600' />}
                            </div>
                            {attribute.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected attributes display */}
                  {fieldFieldAttributes.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {fieldFieldAttributes.map((attrValue) => {
                        const attr = fieldAttributeOptions.find(
                          (opt) => opt.value === attrValue
                        );
                        return (
                          <div
                            key={attrValue}
                            className='flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-200 rounded px-2 py-1 text-sm'
                          >
                            {attr?.label}
                            <X
                              className='w-3 h-3 cursor-pointer hover:text-red-600'
                              onClick={() =>
                                setFieldFieldAttributes((prev) =>
                                  prev.filter((a) => a !== attrValue)
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Dropdown Options */}
                {fieldType === "dropdown" && (
                  <div className='space-y-2'>
                    <Label>Dropdown Options</Label>
                    <div className='flex gap-2'>
                      <Input
                        placeholder='Add option'
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddOption()
                        }
                      />
                      <Button type='button' onClick={handleAddOption}>
                        Add
                      </Button>
                    </div>
                    {dropdownOptions.length > 0 && (
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {dropdownOptions.map((option, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-1 bg-white border rounded px-2 py-1 text-sm'
                          >
                            {option}
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleRemoveOption(index)}
                              className='h-4 w-4 p-0'
                            >
                              <X className='w-3 h-3' />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='required'
                      checked={isRequired}
                      onCheckedChange={setIsRequired}
                    />
                    <Label htmlFor='required'>Required</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='sensitive'
                      checked={isSensitive}
                      onCheckedChange={setIsSensitive}
                    />
                    <Label htmlFor='sensitive'>Sensitive</Label>
                  </div>
                </div>

                <div className='flex gap-2 pt-2'>
                  <Button
                    onClick={handleSaveField}
                    disabled={!fieldName.trim()}
                    className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
                  >
                    Save Field
                  </Button>
                  <Button
                    variant='outline'
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
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !templateName.trim() || !datasetType || isCreating || isUpdating
            }
            className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
          >
            {isCreating || isUpdating ? "Creating..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Custom comparison function for memo
const areEqual = (
  prevProps: CreateMetadataTemplateModalProps,
  nextProps: CreateMetadataTemplateModalProps
) => {
  // Only re-render if the modal is opening/closing or template changes
  return (
    prevProps.open === nextProps.open &&
    prevProps.template?.id === nextProps.template?.id &&
    prevProps.template === nextProps.template
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CreateMetadataTemplateModal, areEqual);
