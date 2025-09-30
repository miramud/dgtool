"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search } from "lucide-react";
import AdvancedTable from "../../../components/shared/AdvancedTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import CreateRoleModal from "./CreateRoleModal";
import { User } from "../types/user";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { mockRoles } from "../data/mockRoles";
import { Role } from "../types/roles";
import { useGetRoles, useDeleteRole } from "../controllers/rolesController";

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

export default function EnhancedRoleManagement({
  className,
}: EnhancedUserManagementProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(
    null
  );
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  // API hooks
  const {
    getRoles,
    data: rolesData,
    isLoading: isLoadingRoles,
  } = useGetRoles();

  const { deleteRole } = useDeleteRole(selectedUser?.id || "");

  // Load roles and permissions on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await getRoles();
      } catch (error) {
        console.error("Failed to load roles and permissions:", error);
      }
    };

    loadData();
  }, []);

  // Update roles when API data changes
  useEffect(() => {
    if (rolesData?.results) {
      setRoles(rolesData.results);
    }
  }, [rolesData]);

  // Filter roles based on search and role
  const filteredUsers = useMemo(() => {
    let filteredRoles = [...roles];

    // Apply search filter
    if (debouncedSearchValue) {
      filteredRoles = filteredRoles.filter(
        (role) =>
          role.name
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          role.status
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          role.roleId
            .toLowerCase()
            .includes(debouncedSearchValue.toLowerCase()) ||
          role.permissions.some((permission) =>
            permission
              .toLowerCase()
              .includes(debouncedSearchValue.toLowerCase())
          )
      );
    }

    // Apply role filter
    if (selectedRole && selectedRole !== "All Roles") {
      filteredRoles = filteredRoles.filter((role) =>
        role.name.includes(selectedRole)
      );
    }

    return filteredRoles;
  }, [debouncedSearchValue, selectedRole, roles]);

  // Table columns configuration
  const columns = [
    { key: "name", header: "Role Name", width: "35%" },
    { key: "description", header: "Description", width: "35%" },
    { key: "permissions", header: "Permissions", width: "35%" },
    { key: "status", header: "Status", width: "20%" },
  ];

  // Format table cell data
  const getFormattedValue = (role: Role, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <span className='text-gray-900'>{role.name}</span>;

      case "description":
        return (
          <span className='text-gray-900'>
            {role.description || "No description"}
          </span>
        );
      case "permissions":
        return (
          <span className='text-gray-900'>{role.permissions_count || 0}</span>
        );

      case "status":
        return (
          <div className='flex items-center gap-2'>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                role.status === "active"
                  ? "bg-green-400"
                  : role.status === "inactive"
                  ? "bg-red-400"
                  : "bg-yellow-400"
              )}
            ></div>
            <StatusBadge status={role.status} variant='status' />
          </div>
        );
      default:
        return null;
    }
  };

  // Table action options
  const tableOptions = [
    {
      label: "Edit Role",
      action: (role: Role) => {
        setSelectedRoleForEdit(role);
        setEditModalOpen(true);
      },
    },
    {
      label: "Delete Role",
      action: (role: Role) => {
        setSelectedUser(role as any); // Temporary type conversion for compatibility
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
      await deleteRole();
      // Refresh the roles list after successful deletion
      await getRoles();
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete role:", error);
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
          <h1 className='text-2xl font-bold text-gray-900'>Role Management</h1>
          <p className='text-gray-600 mt-2'>
            Add and manage your internal roles. Only authorized roles can access
            your company dashboard on Rigshare.
          </p>
        </div>
        <Button
          className='bg-[#4A4A7A] hover:bg-[#3A3A6A]'
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className='w-4 h-4 mr-2' />
          Add New Role
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className='flex items-center space-x-4'>
        {/* Search Field */}
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Role name, permissions, role ID'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A4A7A] focus:border-transparent text-sm'
          />
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
        isLoading={isLoadingRoles}
        showCheckBox={true}
        options={tableOptions}
        getFormattedValue={getFormattedValue}
        onRowSelect={setSelectedUsers}
      />

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-700'>
          {startItem} - {endItem} of {filteredUsers.length} roles
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
      <CreateRoleModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <CreateRoleModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        role={selectedRoleForEdit}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedUser?.fullName}</strong>? This action cannot be
              undone.
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
