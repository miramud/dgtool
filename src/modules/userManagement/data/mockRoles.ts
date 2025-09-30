import { Role } from "../types/roles";
import { UserRole, UserStatus } from "../types/user";

export const mockRoles: Role[] = [
  {
    id: "1",
    roleId: "U-1024",
    roleName: "Steward,Data Owner, Business User",
    permissions: [UserRole.DATA_OWNER, UserRole.BUSINESS_ANALYST],
    status: UserStatus.ACTIVE,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    roleId: "U-1025",
    roleName: "Owner",
    permissions: [UserRole.DATA_STEWARD],
    status: UserStatus.ACTIVE,
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "3",
    roleId: "U-1026",
    roleName: "Compliance Officer",
    permissions: [UserRole.COMPLIANCE_OFFICER],
    status: UserStatus.ACTIVE,
    createdAt: "2024-01-17T14:20:00Z",
    updatedAt: "2024-01-17T14:20:00Z",
  },
];
