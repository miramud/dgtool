"use client";

import { useState } from "react";
import AdvancedTable from "@/components/shared/AdvancedTable";
import {
  useGetDatasetCleanupSession,
  Inconsistency,
} from "../controllers/dataCatalogueController";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";

interface DataQualityTabProps {
  dataset: any;
}

export default function DataQualityTab({ dataset }: DataQualityTabProps) {
  const { data: cleanupSession, isLoading } = useGetDatasetCleanupSession(
    dataset?.id
  );

  const inconsistenciesData = cleanupSession?.inconsistencies || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowDuplicates, setSelectedRowDuplicates] = useState<any[]>([]);
  const [selectedRowInfo, setSelectedRowInfo] = useState<any>(null);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [duplicateToDelete, setDuplicateToDelete] = useState<any>(null);

  const mockDuplicateData = [
    // John Doe group - duplicates with similar names/emails
    {
      id: 1,
      customer_tier: "Premium",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0123",
      date_of_birth: "1985-03-15",
      registration_date: "2023-01-15",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
    {
      id: 2,
      customer_tier: "Gold",
      name: "John D. Doe",
      email: "j.doe@example.com",
      phone: "+1-555-0124",
      date_of_birth: "1985-03-15",
      registration_date: "2023-01-20",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
    {
      id: 3,
      customer_tier: "Silver",
      name: "Jonathan Doe",
      email: "john.doe2@example.com",
      phone: "+1-555-0123",
      date_of_birth: "1985-03-15",
      registration_date: "2023-02-01",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },

    // Jane Smith group - duplicates with variations
    {
      id: 4,
      customer_tier: "Premium",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1-555-0456",
      date_of_birth: "1990-07-22",
      registration_date: "2023-02-10",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
    {
      id: 5,
      customer_tier: "Gold",
      name: "Jane E. Smith",
      email: "jane.e.smith@example.com",
      phone: "+1-555-0456",
      date_of_birth: "1990-07-22",
      registration_date: "2023-02-15",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
    {
      id: 6,
      customer_tier: "Silver",
      name: "J. Smith",
      email: "jane.smith@gmail.com",
      phone: "+1-555-0457",
      date_of_birth: "1990-07-22",
      registration_date: "2023-03-01",
      is_active: "No",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },

    // Robert Johnson group
    {
      id: 7,
      customer_tier: "Gold",
      name: "Robert Johnson",
      email: "bob.johnson@example.com",
      phone: "+1-555-0789",
      date_of_birth: "1988-11-03",
      registration_date: "2023-03-05",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
    {
      id: 8,
      customer_tier: "Premium",
      name: "Bob Johnson",
      email: "robert.johnson@example.com",
      phone: "+1-555-0789",
      date_of_birth: "1988-11-03",
      registration_date: "2023-03-10",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
    {
      id: 9,
      customer_tier: "Silver",
      name: "R. Johnson",
      email: "r.johnson@example.com",
      phone: "+1-555-0790",
      date_of_birth: "1988-11-03",
      registration_date: "2023-03-15",
      is_active: "No",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },

    // Michael Brown group
    {
      id: 10,
      customer_tier: "Premium",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1-555-1234",
      date_of_birth: "1992-05-18",
      registration_date: "2023-04-01",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
    {
      id: 11,
      customer_tier: "Gold",
      name: "Mike Brown",
      email: "mike.brown@example.com",
      phone: "+1-555-1234",
      date_of_birth: "1992-05-18",
      registration_date: "2023-04-05",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },

    // Sarah Wilson group
    {
      id: 12,
      customer_tier: "Gold",
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+1-555-5678",
      date_of_birth: "1987-12-09",
      registration_date: "2023-05-01",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
    {
      id: 13,
      customer_tier: "Silver",
      name: "Sarah M. Wilson",
      email: "s.wilson@example.com",
      phone: "+1-555-5679",
      date_of_birth: "1987-12-09",
      registration_date: "2023-05-10",
      is_active: "Yes",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
    {
      id: 14,
      customer_tier: "Premium",
      name: "S. Wilson",
      email: "sarah.wilson@gmail.com",
      phone: "+1-555-5678",
      date_of_birth: "1987-12-09",
      registration_date: "2023-05-15",
      is_active: "No",
      action_taken: "MANUAL_REVIEW_REQUIRED",
    },
  ];

  // Table columns configuration for inconsistencies
  const columns = [
    { key: "row_number", header: "Row" },
    { key: "field_name", header: "Field Name" },
    { key: "inconsistency_type", header: "Issue Type" },
    { key: "severity", header: "Severity" },
    { key: "original_value", header: "Original Value" },
    { key: "error_message", header: "Error Message" },
    { key: "action_taken", header: "Action Taken" },
  ];

  // Table columns configuration for duplicates
  const mock_columns = [
    { key: "customer_tier", header: "Customer tier" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "duplicateCount", header: "Duplicates Found" },
    { key: "date_of_birth", header: "Date of Birth" },
    { key: "registration_date", header: "Registration Date" },
    { key: "action_taken", header: "Status" },
  ];

  // Format table cell data for inconsistencies
  const getFormattedValue = (item: Inconsistency, columnKey: string) => {
    switch (columnKey) {
      case "row_number":
        return (
          <span className='font-medium text-gray-900'>{item.row_number}</span>
        );
      case "field_name":
        return (
          <span className='font-medium text-gray-900'>{item.field_name}</span>
        );
      case "inconsistency_type":
        return (
          <span className='px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800'>
            {item.inconsistency_type.replace(/_/g, " ")}
          </span>
        );
      case "severity":
        const severityColors = {
          HIGH: "bg-red-100 text-red-800",
          MEDIUM: "bg-yellow-100 text-yellow-800",
          LOW: "bg-green-100 text-green-800",
        };
        return (
          <span
            className={`px-2 py-1 text-xs rounded-md ${
              severityColors[item.severity as keyof typeof severityColors] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {item.severity}
          </span>
        );
      case "original_value":
        return (
          <span
            className='text-gray-700 font-mono text-sm max-w-xs truncate block'
            title={item.original_value}
          >
            {item.original_value || "N/A"}
          </span>
        );
      case "error_message":
        return (
          <span
            className='text-gray-600 text-sm max-w-md truncate block'
            title={item.error_message}
          >
            {item.error_message}
          </span>
        );
      case "action_taken":
        const actionColors = {
          MANUAL_REVIEW_REQUIRED: "bg-orange-100 text-orange-800",
          TYPE_CONVERTED: "bg-blue-100 text-blue-800",
          CORRECTED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 text-xs rounded-md ${
              actionColors[item.action_taken as keyof typeof actionColors] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {item.action_taken.replace(/_/g, " ")}
          </span>
        );
      default:
        return null;
    }
  };

  const formatStatusDisplay = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "FAILED":
        return "Failed";
      default:
        return status;
    }
  };

  const findDuplicates = (clickedItem: any) => {
    const duplicates = mockDuplicateData.filter((duplicate) => {
      const clickedName = clickedItem.name?.toLowerCase() || "";
      const clickedEmail = clickedItem.email?.toLowerCase() || "";
      const clickedPhone = clickedItem.phone?.toLowerCase() || "";
      const clickedDOB = clickedItem.date_of_birth || "";

      const duplicateName = duplicate.name?.toLowerCase() || "";
      const duplicateEmail = duplicate.email?.toLowerCase() || "";
      const duplicatePhone = duplicate.phone?.toLowerCase() || "";
      const duplicateDOB = duplicate.date_of_birth || "";

      // Check for similar names (including nicknames and variations)
      const nameMatch =
        duplicateName.includes(clickedName.split(" ")[0]) || // First name match
        clickedName.includes(duplicateName.split(" ")[0]) || // First name match reverse
        duplicateName.includes(clickedName.split(" ").pop()) || // Last name match
        clickedName.includes(duplicateName.split(" ").pop()); // Last name match reverse

      // Check for email similarities (same domain or similar usernames)
      const emailMatch =
        duplicateEmail === clickedEmail ||
        duplicateEmail.split("@")[0] === clickedEmail.split("@")[0] || // Same username
        (duplicateEmail.includes(clickedName.split(" ")[0].toLowerCase()) &&
          duplicateEmail.includes(clickedName.split(" ").pop().toLowerCase())); // Email contains first and last name

      // Check for phone number match
      const phoneMatch = duplicatePhone === clickedPhone;

      // Check for date of birth match
      const dobMatch = duplicateDOB === clickedDOB;

      // Return true if any strong duplicate indicators are found
      return (
        emailMatch ||
        phoneMatch ||
        dobMatch ||
        (nameMatch &&
          (duplicatePhone.slice(-4) === clickedPhone.slice(-4) ||
            duplicateDOB === clickedDOB))
      );
    });

    return duplicates;
  };

  const handleRowClick = (item: any) => {
    const duplicatesForRow = findDuplicates(item);

    if (duplicatesForRow.length === 0) {
      // If no duplicates found in our mock data, generate some realistic ones
      const generateDuplicates = (baseItem: any) => {
        const firstName = baseItem.name?.split(" ")[0] || "Unknown";
        const lastName = baseItem.name?.split(" ").pop() || "User";

        return [
          {
            ...baseItem,
            id: `generated-1`,
            customer_tier: "Premium",
            name: `${firstName} ${lastName}`,
            action_taken: "MANUAL_REVIEW_REQUIRED",
          },
          {
            ...baseItem,
            id: `generated-2`,
            customer_tier: "Gold",
            name: `${firstName.charAt(0)}. ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
            action_taken: "MANUAL_REVIEW_REQUIRED",
          },
          {
            ...baseItem,
            id: `generated-3`,
            customer_tier: "Silver",
            name: `${firstName} ${lastName.charAt(0)}.`,
            phone: baseItem.phone?.replace(/\d$/, "9") || "+1-555-0000",
            action_taken: "MANUAL_REVIEW_REQUIRED",
          },
        ];
      };
      setSelectedRowDuplicates(generateDuplicates(item));
    } else {
      setSelectedRowDuplicates(duplicatesForRow);
    }

    setSelectedRowInfo(item);
    setIsModalOpen(true);
  };

  const handleTrashDuplicate = (duplicateId: number | string) => {
    const duplicate = selectedRowDuplicates.find(item => item.id === duplicateId);
    setDuplicateToDelete(duplicate);
    setDeleteConfirmModalOpen(true);
  };

  const confirmDeleteDuplicate = () => {
    if (duplicateToDelete) {
      setSelectedRowDuplicates((prev) =>
        prev.filter((item) => item.id !== duplicateToDelete.id)
      );
      setDeleteConfirmModalOpen(false);
      setDuplicateToDelete(null);
    }
  };

  const cancelDeleteDuplicate = () => {
    setDeleteConfirmModalOpen(false);
    setDuplicateToDelete(null);
  };

  const handleRetainDuplicate = (duplicateId: number | string) => {
    setSelectedRowDuplicates((prev) =>
      prev.map((item) =>
        item.id === duplicateId ? { ...item, action_taken: "RETAINED" } : item
      )
    );
  };

  // Create a representative list showing one record per duplicate group for the table
  const getRepresentativeRecords = () => {
    const groups = [
      {
        groupId: "john_doe",
        representative: mockDuplicateData[0],
        duplicateCount: 3,
      },
      {
        groupId: "jane_smith",
        representative: mockDuplicateData[3],
        duplicateCount: 3,
      },
      {
        groupId: "robert_johnson",
        representative: mockDuplicateData[6],
        duplicateCount: 3,
      },
      {
        groupId: "michael_brown",
        representative: mockDuplicateData[9],
        duplicateCount: 2,
      },
      {
        groupId: "sarah_wilson",
        representative: mockDuplicateData[11],
        duplicateCount: 3,
      },
    ];

    return groups.map((group) => ({
      ...group.representative,
      duplicateCount: group.duplicateCount,
    }));
  };

  if (isLoading) {
    return (
      <div className='p-4 space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='bg-white p-6 border border-gray-200 rounded-lg animate-pulse'
            >
              <div className='h-4 bg-gray-200 rounded mb-2'></div>
              <div className='h-8 bg-gray-200 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 space-y-8'>
      {/* Quality Metrics Section */}
      <div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Success Rate */}
          <div className='bg-white p-6 border border-gray-200 rounded-lg'>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Success Rate:
            </h4>
            <div className='text-4xl font-bold text-gray-900'>
              {cleanupSession?.success_rate
                ? `${Math.round(cleanupSession.success_rate)}%`
                : "N/A"}
            </div>
          </div>

          {/* Total Inconsistencies */}
          <div className='bg-white p-6 border border-gray-200 rounded-lg'>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Total Inconsistencies:
            </h4>
            <div className='text-4xl font-bold text-gray-900'>
              {cleanupSession?.total_inconsistencies || 0}
            </div>
            <div className='text-sm text-gray-600 mt-1'>issues detected</div>
          </div>

          {/* Processing Status and Summary */}
          <div className='bg-white p-6 border border-gray-200 rounded-lg'>
            <div className='space-y-4'>
              {/* Processing Status */}
              <div>
                <h4 className='text-sm font-bold text-gray-900 mb-1'>
                  Status:
                </h4>
                <div className='text-gray-600 text-sm'>
                  {cleanupSession?.status
                    ? formatStatusDisplay(cleanupSession.status)
                    : "Unknown"}
                </div>
              </div>

              {/* Rows Processed */}
              <div>
                <h4 className='text-sm font-bold text-gray-900 mb-1'>
                  Rows Processed:
                </h4>
                <div className='text-gray-600 text-sm'>
                  {cleanupSession?.total_rows_processed?.toLocaleString() || 0}{" "}
                  total
                </div>
              </div>

              {/* Rows Cleaned vs Rejected */}
              <div>
                <h4 className='text-sm font-bold text-gray-900 mb-1'>
                  Cleaned/Rejected:
                </h4>
                <div className='text-gray-600 text-sm'>
                  {cleanupSession?.total_rows_cleaned?.toLocaleString() || 0}{" "}
                  cleaned,{" "}
                  {cleanupSession?.total_rows_rejected?.toLocaleString() || 0}{" "}
                  rejected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality Issues Table Section */}
      <div>
        <div className='mb-4'>
          <h3 className='text-lg font-medium text-gray-900'>
            Data Quality Issues
          </h3>
          <p className='text-sm text-gray-600'>
            {inconsistenciesData.length > 0
              ? `Found ${inconsistenciesData.length} inconsistencies that require attention`
              : "No data quality issues found"}
          </p>
        </div>
        <AdvancedTable
          data={inconsistenciesData}
          columns={columns}
          isLoading={isLoading}
          showCheckBox={false}
          getFormattedValue={getFormattedValue}
        />
      </div>

      {/* Duplicate Issues Table Section */}
      <div>
        <div className='mb-4'>
          <h3 className='text-lg font-medium text-gray-900'>
            Duplicate Issues
          </h3>
          <p className='text-sm text-gray-600'>
            {getRepresentativeRecords().length > 0
              ? `Found ${
                  getRepresentativeRecords().length
                } groups with duplicate records that require attention. Click on any row to see all duplicates.`
              : "No duplicate issues found"}
          </p>
        </div>
        <AdvancedTable
          data={getRepresentativeRecords()}
          columns={mock_columns}
          isLoading={isLoading}
          showCheckBox={false}
          onRowClick={handleRowClick}
          getFormattedValue={(item: any, columnKey: string) => {
            if (columnKey === "action_taken") {
              const actionColors = {
                MANUAL_REVIEW_REQUIRED: "bg-orange-100 text-orange-800",
                RETAINED: "bg-green-100 text-green-800",
                TRASHED: "bg-red-100 text-red-800",
              };
              return (
                <span
                  className={`px-2 py-1 text-xs rounded-md ${
                    actionColors[
                      item.action_taken as keyof typeof actionColors
                    ] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.action_taken.replace(/_/g, " ")}
                </span>
              );
            }
            if (columnKey === "duplicateCount") {
              return (
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  {item.duplicateCount} duplicates
                </span>
              );
            }
            return (
              <span className='text-gray-900'>{item[columnKey] || "N/A"}</span>
            );
          }}
          className='cursor-pointer'
        />
      </div>

      {/* Duplicate Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Duplicate Entries</DialogTitle>
            <DialogDescription>
              {selectedRowInfo && (
                <>
                  {selectedRowDuplicates.length > 0 ? (
                    <>
                      Found {selectedRowDuplicates.length} duplicate entries
                      for:{" "}
                      <strong>
                        {selectedRowInfo.name ||
                          selectedRowInfo.email ||
                          "this record"}
                      </strong>
                    </>
                  ) : (
                    <>
                      All duplicates have been processed for:{" "}
                      <strong>
                        {selectedRowInfo.name ||
                          selectedRowInfo.email ||
                          "this record"}
                      </strong>
                    </>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {selectedRowDuplicates.length === 0 ? (
              <div className='text-center py-8'>
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
                  <Check className='h-6 w-6 text-green-600' />
                </div>
                <h3 className='mt-2 text-sm font-medium text-gray-900'>
                  All duplicates processed
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  All duplicate entries have been either retained or removed
                  from the system.
                </p>
              </div>
            ) : (
              selectedRowDuplicates.map((duplicate) => (
                <div
                  key={duplicate.id}
                  className='border rounded-lg p-4 bg-gray-50'
                >
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Name:
                      </span>
                      <p className='text-sm text-gray-900'>{duplicate.name}</p>
                    </div>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Email:
                      </span>
                      <p className='text-sm text-gray-900'>{duplicate.email}</p>
                    </div>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Phone:
                      </span>
                      <p className='text-sm text-gray-900'>{duplicate.phone}</p>
                    </div>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Customer Tier:
                      </span>
                      <p className='text-sm text-gray-900'>
                        {duplicate.customer_tier}
                      </p>
                    </div>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Date of Birth:
                      </span>
                      <p className='text-sm text-gray-900'>
                        {duplicate.date_of_birth}
                      </p>
                    </div>
                    <div>
                      <span className='text-sm font-medium text-gray-500'>
                        Registration Date:
                      </span>
                      <p className='text-sm text-gray-900'>
                        {duplicate.registration_date}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium text-gray-500'>
                        Status:
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-md ${
                          duplicate.action_taken === "RETAINED"
                            ? "bg-green-100 text-green-800"
                            : duplicate.action_taken === "TRASHED"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {duplicate.action_taken.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleRetainDuplicate(duplicate.id)}
                        disabled={duplicate.action_taken === "RETAINED"}
                        className='flex items-center gap-1'
                      >
                        <Check className='w-4 h-4' />
                        Keep
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleTrashDuplicate(duplicate.id)}
                        disabled={duplicate.action_taken === "TRASHED"}
                        className='flex items-center gap-1 text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='w-4 h-4' />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmModalOpen} onOpenChange={setDeleteConfirmModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Duplicate Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this duplicate record for{" "}
              <strong>{duplicateToDelete?.name || "this entry"}</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={cancelDeleteDuplicate}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteDuplicate}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
