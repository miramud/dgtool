import { User, UserRole, UserStatus } from "../types/user";

export const mockUsers: User[] = [
    {
        id: "1",
        userId: "U-1024",
        fullName: "John Doe", 
        email: "johndoe@rightclick.com",
        phone: "+23480000000",
        roles: [UserRole.DATA_OWNER, UserRole.BUSINESS_ANALYST],
        status: UserStatus.ACTIVE,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
    },
    {
        id: "2", 
        userId: "U-1025",
        fullName: "Mary Smith",
        email: "marysmith@rightclick.com", 
        phone: "+23481000000",
        roles: [UserRole.DATA_STEWARD],
        status: UserStatus.ACTIVE,
        createdAt: "2024-01-16T09:15:00Z", 
        updatedAt: "2024-01-16T09:15:00Z",
    },
    {
        id: "3",
        userId: "U-1026", 
        fullName: "Ahmed Bello",
        email: "ahmedbello@rightclick.com",
        phone: "+23470000000", 
        roles: [UserRole.COMPLIANCE_OFFICER],
        status: UserStatus.ACTIVE,
        createdAt: "2024-01-17T14:20:00Z",
        updatedAt: "2024-01-17T14:20:00Z",
    },
];