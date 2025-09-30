"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BackendStaff } from "../types/user";
import StatusBadge from "../../../components/shared/StatusBadge";
import { cn } from "@/lib/utils";

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: BackendStaff | null;
  onEdit?: (staff: BackendStaff) => void;
  onSuspend?: (staff: BackendStaff) => void;
  onDelete?: (staff: BackendStaff) => void;
}

export default function UserProfileModal({
  open,
  onOpenChange,
  staff,
  onEdit,
  onSuspend,
  onDelete,
}: UserProfileModalProps) {
  if (!staff) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (staff.is_active && !staff.is_suspended) return "text-green-600";
    if (staff.is_suspended) return "text-red-600";
    return "text-yellow-600";
  };

  const getStatusText = () => {
    if (staff.is_active && !staff.is_suspended) return "Active";
    if (staff.is_suspended) return "Suspended";
    return "Inactive";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            User Profile - {staff?.user?.first_name} {staff?.user?.last_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* User Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <p className="text-gray-900">{staff?.user?.first_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <p className="text-gray-900">{staff?.user?.last_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{staff?.user?.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <p className="text-gray-900">{staff?.user?.mobile_number || "N/A"}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <p className={cn("font-medium", getStatusColor())}>
                {getStatusText()}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Creation
              </label>
              <p className="text-gray-900">
                {staff?.user?.date_joined ? formatDate(staff.user.date_joined) : "N/A"}
              </p>
            </div>
          </div>
          
          {/* Roles Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Roles
            </label>
            <ul className="space-y-2">
              {staff.roles.map((role, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  <span className="text-gray-900">{role.name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white"
              onClick={() => onEdit?.(staff)}
            >
              Edit User
            </Button>
            
            <Button
              variant="outline"
              className="flex-1 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
              onClick={() => onSuspend?.(staff)}
            >
              Suspend User
            </Button>
            
            <Button
              variant="outline"
              className="flex-1 border-red-400 text-red-600 hover:bg-red-50"
              onClick={() => onDelete?.(staff)}
            >
              Delete User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}