/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, Filter } from "lucide-react";
import AdvancedTable from "../../../components/shared/AdvancedTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import CreateStaffModal from "./CreateStaffModal";
import UserProfileModal from "./UserProfileModal";
import { UserRole, BackendStaff } from "../types/user";

import { useGetStaffs, useDeleteStaff } from "../controllers/staffController";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

// Custom hook for debounced search (mimicking the performance dialog pattern)
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface EnhancedUserManagementProps {
  className?: string;
}

export default function EnhancedUserManagement({
  className,
}: EnhancedUserManagementProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<BackendStaff | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<BackendStaff[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [users, setUsers] = useState<BackendStaff[]>([]);

  // API hooks
  const { getStaffs, data: staffsData, isLoading } = useGetStaffs();
  const { deleteStaff } = useDeleteStaff(selectedUser?.id || "");

  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Role options for filtering (mimicking performance dialog pattern)
  const roleOptions = ["All Roles", ...Object.values(UserRole)];

  // Load staff data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await getStaffs();
      } catch (error) {
        console.error("Failed to load staff:", error);
      }
    };

    loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update users when API data changes
  useEffect(() => {
    // @ts-ignore
    if (staffsData?.results) {
      // @ts-ignore

      setUsers(staffsData.results);
    }
  }, [staffsData]);

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    let filteredStaff = [...users];

    // Apply search filter
    if (debouncedSearchValue) {
      filteredStaff = filteredStaff.filter(
        (staff) =>
          `${staff.first_name} ${staff.last_name}`
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          staff.email
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          staff.id.toLowerCase().includes(debouncedSearchValue.toLowerCase())
      );
    }

    // Apply role filter
    if (selectedRole && selectedRole !== "All Roles") {
      filteredStaff = filteredStaff.filter((staff) =>
        staff.roles.some((role) => role.name === selectedRole)
      );
    }

    return filteredStaff;
  }, [debouncedSearchValue, selectedRole, users]);

  // Table columns configuration
  const columns = [
    { key: "userId", header: "User ID", width: "12%" },
    { key: "fullName", header: "Full Name", width: "20%" },
    { key: "email", header: "Email", width: "25%" },
    { key: "phone", header: "Phone", width: "15%" },
    { key: "roles", header: "Roles", width: "18%" },
    { key: "status", header: "Status", width: "10%" },
  ];

  // Format table cell data
  const getFormattedValue = (staff: BackendStaff, columnKey: string) => {
    switch (columnKey) {
      case "userId":
        return (
          <span className='font-medium text-gray-900 truncate max-w-[100px]'>
            {staff.id}
          </span>
        );
      case "fullName":
        return (
          <span className='text-gray-900'>{`${staff?.user?.first_name} ${staff?.user?.last_name}`}</span>
        );
      case "email":
        return <span className='text-gray-900'>{staff?.user?.email}</span>;
      case "phone":
        return (
          <span className='text-gray-900'>
            {staff?.user?.mobile_number || "N/A"}
          </span>
        );
      case "roles":
        return (
          <div className='flex flex-wrap gap-1'>
            {staff.roles.slice(0, 2).map((role, index) => (
              <StatusBadge key={index} status={role.name} variant='role' />
            ))}
            {staff.roles.length > 2 && (
              <StatusBadge
                status={`+${staff.roles.length - 2} more`}
                variant='default'
                className='bg-gray-100 text-gray-600'
              />
            )}
          </div>
        );
      case "status":
        return (
          <div className='flex items-center gap-2'>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                staff.is_active && !staff.is_suspended
                  ? "bg-green-400"
                  : staff.is_suspended
                  ? "bg-red-400"
                  : "bg-yellow-400"
              )}
            ></div>
            <StatusBadge
              status={
                staff.is_active && !staff.is_suspended
                  ? "Active"
                  : staff.is_suspended
                  ? "Suspended"
                  : "Inactive"
              }
              variant='status'
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Table action options
  const tableOptions = [
    {
      label: "View Profile",
      action: (staff: BackendStaff) => {
        setSelectedUser(staff);
        setProfileModalOpen(true);
      },
    },
    {
      label: "Edit Staff",
      action: (staff: BackendStaff) => {
        setSelectedUser(staff);
        setEditModalOpen(true);
      },
    },
    {
      label: "Delete Staff",
      action: (staff: BackendStaff) => {
        setSelectedUser(staff);
        setDeleteModalOpen(true);
      },
    },
  ];

  // Handle bulk actions
  const handleBulkDelete = () => {
    console.log("Bulk delete:", selectedUsers);
    // Implement bulk delete logic
  };

  // Handle individual delete
  const handleDelete = async () => {
    if (!selectedUser?.id) return;

    try {
      await deleteStaff();
      await getStaffs(); // Refresh data
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  // Pagination info (mimicking performance dialog pattern)
  const startItem = (currentPage - 1) * 15 + 1;
  const endItem = Math.min(currentPage * 15, filteredUsers.length);
  const totalPages = Math.ceil(filteredUsers.length / 15);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>User Management</h1>
          <p className='text-gray-600 mt-2'>
            Manage and control access for internal users. Only authorized users
            can access your company dashboard.
          </p>
        </div>
        <Button
          className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className='w-4 h-4 mr-2' />
          Create New User
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className='flex items-center space-x-4'>
        {/* Search Field */}
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            placeholder='User name, email, role'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm'
          />
        </div>

        {/* Filter Button */}
        <div className='relative'>
          <select
            value={selectedRole}
            onChange={(e) =>
              setSelectedRole(
                e.target.value === "All Roles" ? "" : e.target.value
              )
            }
            className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent cursor-pointer'
          >
            <option value=''>Filter</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <Filter className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>
              {selectedUsers.length} selected
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={handleBulkDelete}
              className='text-red-600 hover:text-red-700'
            >
              <Trash2 className='w-4 h-4 mr-1' />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Table */}
      <AdvancedTable
        data={filteredUsers}
        columns={columns}
        isLoading={isLoading}
        showCheckBox={true}
        options={tableOptions}
        getFormattedValue={getFormattedValue}
        onRowSelect={setSelectedUsers}
      />

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-700'>
          {startItem} - {endItem} of {filteredUsers.length} users
        </p>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className='text-sm'>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      <CreateStaffModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => getStaffs()}
      />

      <CreateStaffModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        staff={selectedUser}
        onSuccess={() => getStaffs()}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        staff={selectedUser}
        onEdit={(staff) => {
          setSelectedUser(staff);
          setProfileModalOpen(false);
          setEditModalOpen(true);
        }}
        onSuspend={(staff) => {
          // Implement suspend functionality
          console.log("Suspend user:", staff);
        }}
        onDelete={(staff) => {
          setSelectedUser(staff);
          setProfileModalOpen(false);
          setDeleteModalOpen(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {selectedUser
                  ? `${selectedUser.first_name} ${selectedUser.last_name}`
                  : ""}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
