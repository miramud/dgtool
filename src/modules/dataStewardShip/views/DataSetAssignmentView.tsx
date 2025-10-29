"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import { useGetDataCatalogueById } from "../controllers/dataCatalogueController";

// Tab content components

interface DataCatalogueViewProps {
  className?: string;
  datasetId: string;
}

export default function DataSetAssignmentView({
  className,
  datasetId,
}: DataCatalogueViewProps) {
  const router = useRouter();

  // Fetch dataset data
  const {
    data: dataset,
    isLoading,
    error,
  } = useGetDataCatalogueById(datasetId);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className={cn("p-6 space-y-6 bg-white", className)}>
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='grid grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='h-20 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-6 space-y-6 bg-white", className)}>
        <div className='text-center py-8'>
          <p className='text-red-600'>Error loading dataset: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className={cn("p-6 space-y-6 bg-white", className)}>
        <div className='text-center py-8'>
          <p className='text-gray-600'>Dataset not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 space-y-6 bg-white", className)}>
      {/* Go Back Button */}
      <div className='flex items-center space-x-4 mb-6'>
        <Button
          variant='outline'
          onClick={handleGoBack}
          className='flex items-center space-x-2 text-gray-600 hover:text-gray-800'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Go Back</span>
        </Button>
      </div>

      {/* Header Section with Dataset Information Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        {/* Dataset Name Card */}
        <Card className='bg-gray-50 border-l-4 border-l-[#4A4A7A]'>
          <CardContent className='py-4'>
            <div className='space-y-1'>
              <h3 className='text-sm font-medium text-gray-600'>
                Dataset Name
              </h3>
              <p className='text-sm text-gray-900'>{dataset.name}</p>
            </div>
          </CardContent>
        </Card>

        {/* Dataset ID Card */}
        <Card className='bg-gray-50 border-l-4 border-l-[#4A4A7A]'>
          <CardContent className='py-4'>
            <div className='space-y-1'>
              <h3 className='text-sm font-medium text-gray-600'>Dataset ID</h3>
              <p className='text-sm text-gray-900'>{dataset.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card className='bg-gray-50 border-l-4 border-l-[#4A4A7A]'>
          <CardContent className='py-4'>
            <div className='space-y-2'>
              <h3 className='text-sm font-medium text-gray-600'>Tags</h3>
              <div className='flex flex-wrap gap-1'>
                {(Array.isArray(dataset.tags)
                  ? dataset.tags
                  : typeof dataset.tags === "string"
                  ? dataset.tags.split(",").map((tag: string) => tag.trim())
                  : []
                ).map((tag: string, index: number) => (
                  <StatusBadge
                    key={index}
                    status={tag}
                    variant='default'
                    className='bg-blue-100 text-blue-800 text-xs px-2 py-1'
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Classifications Card */}
        <Card className='bg-gray-50 border-l-4 border-l-[#4A4A7A]'>
          <CardContent className='py-4'>
            <div className='space-y-1'>
              <h3 className='text-sm font-medium text-gray-600'>
                Security Classifications
              </h3>
              <p className='text-sm text-gray-900'>{dataset.sensitivity}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Governor Roles */}
      <div className='space-y-6'>
        <h2 className='text-xl font-semibold text-gray-900'>Governor Roles</h2>

        {/* Data Owners Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-gray-800'>Data Owners</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* Mock data owners - replace with actual API data */}
            {[
              {
                id: "1",
                name: "John Smith",
                role: "Data Manager",
                email: "john.smith@company.com",
                department: "Finance",
                status: "Active",
              },
              {
                id: "2",
                name: "Sarah Johnson",
                role: "Analytics Lead",
                email: "sarah.johnson@company.com",
                department: "Operations",
                status: "Active",
              },
              {
                id: "3",
                name: "Michael Brown",
                role: "IT Director",
                email: "michael.brown@company.com",
                department: "IT",
                status: "Inactive",
              },
            ].map((owner) => (
              <Card
                key={owner.id}
                className='border border-gray-200 hover:shadow-md transition-shadow'
              >
                <CardContent className='p-4'>
                  <div className='space-y-3'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          {owner.name}
                        </h4>
                        <p className='text-sm text-gray-600'>{owner.role}</p>
                      </div>
                      <StatusBadge
                        status={owner.status}
                        variant='default'
                        className={
                          owner.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }
                      />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm text-gray-700'>{owner.email}</p>
                      <p className='text-xs text-gray-500'>
                        {owner.department} Department
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Stewards Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-gray-800'>Data Stewards</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* Mock data stewards - replace with actual API data */}
            {[
              {
                id: "1",
                name: "Alice Cooper",
                role: "Data Analyst",
                email: "alice.cooper@company.com",
                department: "Analytics",
                status: "Active",
              },
              {
                id: "2",
                name: "Bob Martinez",
                role: "Business Analyst",
                email: "bob.martinez@company.com",
                department: "Business Intelligence",
                status: "Active",
              },
              {
                id: "3",
                name: "Carol White",
                role: "Data Scientist",
                email: "carol.white@company.com",
                department: "Research",
                status: "Active",
              },
              {
                id: "4",
                name: "Daniel Lee",
                role: "System Administrator",
                email: "daniel.lee@company.com",
                department: "IT",
                status: "Inactive",
              },
              {
                id: "5",
                name: "Eva Rodriguez",
                role: "Quality Analyst",
                email: "eva.rodriguez@company.com",
                department: "Quality Assurance",
                status: "Active",
              },
            ].map((steward) => (
              <Card
                key={steward.id}
                className='border border-gray-200 hover:shadow-md transition-shadow'
              >
                <CardContent className='p-4'>
                  <div className='space-y-3'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          {steward.name}
                        </h4>
                        <p className='text-sm text-gray-600'>{steward.role}</p>
                      </div>
                      <StatusBadge
                        status={steward.status}
                        variant='default'
                        className={
                          steward.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }
                      />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm text-gray-700'>{steward.email}</p>
                      <p className='text-xs text-gray-500'>
                        {steward.department} Department
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
