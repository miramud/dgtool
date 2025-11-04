import { z } from "zod";

export interface DataGovernor {
    id: string;
    dataset_id: string;
    data_owners: string[];
    stewards: string[];
    description: string;
    created_datetime: string;
    updated_datetime: string;
    created_by?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    updated_by?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

export interface DataGovernanceResponse {
    dataGovernors: DataGovernor[];
    total: number;
    page: number;
    limit: number;
}

export interface DataOwnerSteward {
    is_eligible: boolean;
    user: string;
}

export const createDataGovernorSchema = z.object({
    dataset_id: z.string().min(1, "Dataset is required"),
    data_owners: z.array(z.object({
        is_eligible: z.boolean(),
        user: z.string()
    })).min(1, "At least one data owner is required"),
    stewards: z.array(z.object({
        is_eligible: z.boolean(),
        user: z.string()
    })).min(1, "At least one steward is required"),
    description: z.string().min(1, "Description is required"),
});

export const updateDataGovernorSchema = z.object({
    dataset_id: z.string().optional(),
    data_owners: z.array(z.object({
        is_eligible: z.boolean(),
        user: z.string()
    })).optional(),
    stewards: z.array(z.object({
        is_eligible: z.boolean(),
        user: z.string()
    })).optional(),
    description: z.string().optional(),
});

export type CreateDataGovernorFormData = z.infer<typeof createDataGovernorSchema>;
export type UpdateDataGovernorFormData = z.infer<typeof updateDataGovernorSchema>;

export interface DataSteward {
    id: string;
    full_name: string;
    email: string;
    governance_role: string;
    status: boolean;
}

export interface UpdateStewardsFormData {
    stewards: DataSteward[];
}