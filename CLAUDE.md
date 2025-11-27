# CLAUDE.md - Project Guidelines

This document defines the coding standards, patterns, and conventions for the DGTool Frontend project. **Follow these guidelines strictly to maintain consistency.**

---

## Core Principles

1. **Use existing components** - Always check `/src/components/ui/` and `/src/components/shared/` before creating new components
2. **Use existing libraries** - Never write from scratch what a library already provides
3. **Follow established patterns** - Match existing code structure and conventions exactly
4. **No unnecessary additions** - Only add what is explicitly requested

---

## Project Structure

```
src/
├── app/                          # Next.js App Router (pages)
│   ├── (accounts)/              # Authenticated routes
│   ├── (landing)/               # Public routes
│   ├── auth/                    # Auth routes
│   └── api/                     # API routes (NextAuth)
├── components/
│   ├── ui/                      # Base UI components (Radix-based)
│   ├── shared/                  # Reusable components
│   ├── auth/                    # Auth components
│   └── providers/               # Context providers
├── modules/                     # Feature modules
│   └── {moduleName}/
│       ├── components/          # Module-specific components
│       ├── controllers/         # TanStack Query hooks
│       ├── types/              # Module types
│       ├── lib/                # Validators, utilities
│       └── views/              # Page layouts (optional)
├── hooks/                       # Global custom hooks
├── services/                    # API service layer
├── types/                       # Global TypeScript types
├── constants/                   # Route and API constants
├── lib/                         # Core utilities (api-client, utils)
└── utils/                       # Helper functions
```

---

## UI Components

### Required Libraries
- **Radix UI** - For all primitives (Dialog, Select, Dropdown, Checkbox, Switch, Label, Slot)
- **Tailwind CSS** - For all styling
- **Lucide React** - For all icons
- **class-variance-authority (CVA)** - For component variants
- **Sonner** - For toast notifications

### Existing UI Components (`/src/components/ui/`)
Always use these before creating new ones:
- `button.tsx` - Buttons with variants (default, destructive, outline, secondary, ghost, link)
- `input.tsx` - Text inputs
- `form.tsx` - Form components (Form, FormField, FormItem, FormLabel, FormControl, FormMessage)
- `dialog.tsx` - Modal dialogs
- `select.tsx` - Dropdowns
- `checkbox.tsx` - Checkboxes
- `switch.tsx` - Toggle switches
- `label.tsx` - Form labels
- `textarea.tsx` - Text areas
- `badge.tsx` - Status badges
- `card.tsx` - Card containers
- `dropdown-menu.tsx` - Dropdown menus
- `separator.tsx` - Visual separators
- `table.tsx` - Table components
- `tabs.tsx` - Tab navigation
- `tooltip.tsx` - Tooltips
- `input-otp.tsx` - OTP input

### Existing Shared Components (`/src/components/shared/`)
- `FormInput.tsx` - Form input wrapper with react-hook-form integration
- `FormSelect.tsx` - Form select wrapper with loading states
- `FormMultiSelect.tsx` - Multi-select wrapper
- `FormTextarea.tsx` - Form textarea wrapper
- `AdvancedTable.tsx` - Table with sorting, selection, actions
- `DashboardHeader.tsx` - Page header with breadcrumbs
- `DashboardSidebar.tsx` - Navigation sidebar
- `CreateUserModal.tsx` - Modal dialog pattern
- `RichTextEditor.tsx` - TipTap WYSIWYG editor

### Component Styling Pattern
```typescript
// Always use cn() for combining classes
import { cn } from "@/lib/utils"

// Use CVA for variants
const buttonVariants = cva("inline-flex items-center...", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

---

## API & Services

### API Client
Always use the existing API client at `/src/lib/api-client.ts`:
```typescript
import { apiClient } from "@/lib/api-client";

// Usage
const response = await apiClient.get<IResponse<DataType>>("/endpoint");
const response = await apiClient.post<IResponse<DataType>>("/endpoint", data);
const response = await apiClient.put<IResponse<DataType>>("/endpoint", data);
const response = await apiClient.patch<IResponse<DataType>>("/endpoint", data);
const response = await apiClient.delete<IResponse<void>>("/endpoint");
```

### Service Layer Pattern
Create services in `/src/services/` following this pattern:
```typescript
// src/services/example.ts
import { apiClient } from "@/lib/api-client";
import { IResponse } from "@/types/http";
import { EXAMPLE_API_ROUTES } from "@/constants/example-api-routes";

export const exampleService = {
  async getItems(filters?: Filters): Promise<IResponse<ItemListResponse>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    const url = `${EXAMPLE_API_ROUTES.BASE}${params.toString() ? `?${params}` : ''}`;
    const response = await apiClient.get<IResponse<ItemListResponse>>(url);
    return response.data;
  },

  async createItem(data: CreateRequest): Promise<IResponse<Item>> {
    const response = await apiClient.post<IResponse<Item>>(EXAMPLE_API_ROUTES.BASE, data);
    return response.data;
  },

  async updateItem(id: string, data: UpdateRequest): Promise<IResponse<Item>> {
    const response = await apiClient.patch<IResponse<Item>>(`${EXAMPLE_API_ROUTES.BASE}/${id}`, data);
    return response.data;
  },

  async deleteItem(id: string): Promise<IResponse<void>> {
    const response = await apiClient.delete<IResponse<void>>(`${EXAMPLE_API_ROUTES.BASE}/${id}`);
    return response.data;
  },
};
```

### API Route Constants
Define routes in `/src/constants/`:
```typescript
// src/constants/example-api-routes.ts
export enum EXAMPLE_API_ROUTES {
  BASE = "/examples",
}

export const EXAMPLE_ROUTES = {
  LIST: EXAMPLE_API_ROUTES.BASE,
  CREATE: EXAMPLE_API_ROUTES.BASE,
  GET_BY_ID: (id: string) => `${EXAMPLE_API_ROUTES.BASE}/${id}`,
  UPDATE: (id: string) => `${EXAMPLE_API_ROUTES.BASE}/${id}`,
  DELETE: (id: string) => `${EXAMPLE_API_ROUTES.BASE}/${id}`,
};
```

### Response Type
Always use the standard response wrapper:
```typescript
// src/types/http.ts
export interface IResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
```

---

## State Management

### TanStack Query (React Query)
Use for ALL server state management:
```typescript
// src/hooks/useExample.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { exampleService } from "@/services/example";

const QUERY_KEYS = {
  items: "items",
};

export const useItems = (filters?: Filters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.items, filters],
    queryFn: () => exampleService.getItems(filters),
    select: (data) => data.data,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRequest) => exampleService.createItem(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.items] });
      toast.success(response.message || "Item created successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create item";
      toast.error(message);
    },
  });
};
```

### Module-Level Controllers (Alternative Pattern)
For module-specific hooks using `useApiManager`:
```typescript
// src/modules/{module}/controllers/exampleController.ts
import { useApiManager } from "@/constants/controllers/mainController";

export const useCreateExample = () => {
  const { callApi, data, isLoading, isSuccess, isError, error } = useApiManager<
    ResponseType, AxiosError, RequestType
  >({
    endpoint: EXAMPLE_API_ROUTES.CREATE,
    method: "POST",
    isAuth: true,
    showSuccessToast: true,
    queryKey: ["examples"],
  });

  const createExample = async (formData: RequestType) => {
    return await callApi(formData);
  };

  return { createExample, data, isLoading, isSuccess, isError, error };
};
```

---

## Forms

### Required Libraries
- **react-hook-form** - Form state management
- **zod** - Schema validation
- **@hookform/resolvers** - Zod integration

### Form Pattern
```typescript
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/FormInput";
import FormSelect from "@/components/shared/FormSelect";

// 1. Define schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  status: z.string().min(1, "Status is required"),
});

type FormValues = z.infer<typeof formSchema>;

// 2. Create component
export default function ExampleForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Handle submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput label="Name" name="name" placeholder="Enter name" />
        <FormInput label="Email" name="email" type="email" placeholder="Enter email" />
        <FormSelect
          label="Status"
          name="status"
          placeholder="Select status"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Validation Schema Location
- Global validators: `/src/lib/validators.ts`
- Module validators: `/src/modules/{module}/lib/validators.ts`

---

## TypeScript

### Type Definitions

**Interface naming:**
- Standard: PascalCase (e.g., `User`, `MetadataTemplate`)
- Legacy with prefix: `I` prefix (e.g., `IResponse`, `IUser`) - use when extending existing patterns

**Type naming:**
- Form types: `T` prefix (e.g., `TSignInFormValues`) or suffix `FormData` (e.g., `UserFormData`)

**Enum naming:**
- PascalCase (e.g., `UserRole`, `DataCatalogueStatus`)

### Type Locations
- Global types: `/src/types/`
- Module types: `/src/modules/{module}/types/`
- Form types: Inferred from Zod schemas using `z.infer<typeof schema>`

### Example Type File
```typescript
// src/types/example.ts
export interface Example {
  id: string;
  name: string;
  description?: string;
  status: ExampleStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ExampleStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface ExampleFilters {
  search?: string;
  status?: ExampleStatus;
  page?: number;
  limit?: number;
}

export interface CreateExampleRequest {
  name: string;
  description?: string;
}

export interface UpdateExampleRequest {
  name?: string;
  description?: string;
  status?: ExampleStatus;
}
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `DashboardHeader.tsx` |
| Hooks | camelCase with `use` prefix | `useMetadataTemplates.ts` |
| Services | kebab-case | `metadata-template.ts` |
| Types | kebab-case or camelCase | `metadata-template.ts` |
| Constants | kebab-case | `api-routes.ts` |
| Utilities | camelCase | `formatName.js` |

---

## Import Organization

Order imports as follows:
```typescript
// 1. React/Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. Third-party libraries
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// 3. UI components
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

// 4. Shared components
import FormInput from "@/components/shared/FormInput";

// 5. Hooks
import { useCreateItem } from "@/hooks/useItems";

// 6. Services/Utils
import { exampleService } from "@/services/example";
import { cn } from "@/lib/utils";

// 7. Types
import type { Example } from "@/types/example";

// 8. Constants
import { AUTH_ROUTES } from "@/constants/routes";
```

---

## Component Patterns

### Client Components
Always add "use client" directive at the top for interactive components:
```typescript
"use client";

import { useState } from "react";
// ... rest of component
```

### Props Interface
Define props interface before component:
```typescript
interface ExampleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
}

export default function ExampleModal({ open, onOpenChange, item }: ExampleModalProps) {
  // ...
}
```

### Export Pattern
- **Components**: Default export
- **Hooks/Utils/Types**: Named exports

---

## Error Handling

### API Errors
Handle in mutation callbacks:
```typescript
onError: (error: any) => {
  const message = error?.response?.data?.message || "Operation failed";
  toast.error(message);
}
```

### Form Errors
Handled automatically by react-hook-form + Zod integration.

---

## Styling Guidelines

### Use Tailwind CSS
```typescript
// Good
<div className="flex items-center gap-4 p-4 bg-background rounded-lg">

// Bad - no inline styles
<div style={{ display: 'flex', alignItems: 'center' }}>
```

### Use cn() for conditional classes
```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "large" && "large-classes"
)}>
```

### Theme Colors
Use CSS variables defined in globals.css:
- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `bg-destructive`, `text-destructive-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-card`, `bg-popover`

---

## Do NOT

1. **Do NOT create new UI components** if one exists in `/src/components/ui/`
2. **Do NOT install new libraries** without checking if existing ones cover the need
3. **Do NOT use inline styles** - use Tailwind classes
4. **Do NOT create custom fetch/axios calls** - use `apiClient`
5. **Do NOT manage server state with useState** - use TanStack Query
6. **Do NOT create form handling from scratch** - use react-hook-form + Zod
7. **Do NOT use different icon libraries** - use Lucide React only
8. **Do NOT use different toast libraries** - use Sonner only
9. **Do NOT add emoji/decorative elements** unless explicitly requested
10. **Do NOT create README or documentation files** unless explicitly requested

---

## Quick Reference

### Adding a New Feature

1. Create types in `/src/modules/{module}/types/` or `/src/types/`
2. Create API routes in `/src/constants/{feature}-api-routes.ts`
3. Create service in `/src/services/{feature}.ts`
4. Create hooks in `/src/hooks/use{Feature}.ts`
5. Create validators in `/src/modules/{module}/lib/validators.ts`
6. Create components using existing UI components
7. Add page in `/src/app/`

### Adding a New Form

1. Define Zod schema
2. Create type with `z.infer<typeof schema>`
3. Use `useForm` with `zodResolver`
4. Use `FormInput`, `FormSelect`, etc. from shared components
5. Wrap in `<Form>` component

### Making API Calls

1. Use service layer for data fetching
2. Use TanStack Query hooks for caching
3. Use `toast.success()` / `toast.error()` for notifications
4. Use `IResponse<T>` wrapper for typing responses
