"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import { useGetDataCatalogueById } from "../controllers/dataCatalogueController";

// Tab content components
import OverviewTab from "../components/OverviewTab";
import MetadataTab from "../components/MetadataTab";
import DataQualityTab from "../components/DataQualityTab";
import DatasetTableTab from "../components/DatasetTableTab";
import LineageTab from "../components/LineageTab";
import AccessPermissionsTab from "../components/AccessPermissionsTab";
import VersionHistoryTab from "../components/VersionHistoryTab";
import IssueLogPanel from "../components/IssueLogPanel";
import IssueBadge from "../components/IssueBadge";
import ReportIssueModal from "../components/ReportIssueModal";

interface DataCatalogueViewProps {
  className?: string;
  datasetId: string;
}

export default function DataCatalogueView({
  className,
  datasetId,
}: DataCatalogueViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [reportIssueModalOpen, setReportIssueModalOpen] = useState(false);

  // Fetch dataset data
  const { data: dataset, isLoading, error } = useGetDataCatalogueById(datasetId);

  if (isLoading) {
    return (
      <div className={cn("p-6 space-y-6 bg-white", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-6 space-y-6 bg-white", className)}>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading dataset: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className={cn("p-6 space-y-6 bg-white", className)}>
        <div className="text-center py-8">
          <p className="text-gray-600">Dataset not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 space-y-6 bg-white", className)}>
      {/* Report Data Issues Button */}
      <div className="flex justify-end items-center gap-3">
        <IssueBadge datasetId={datasetId} />
        <Button
          variant="default"
          className="bg-[#4A4A7A] hover:bg-[#3A3A6A]"
          onClick={() => setReportIssueModalOpen(true)}
        >
          Report Issue
        </Button>
      </div>

      {/* Header Section with Dataset Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Dataset Name Card */}
        <Card className="bg-gray-50 border-l-4 border-l-[#4A4A7A]">
          <CardContent className="py-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">Dataset Name</h3>
              <p className="text-sm text-gray-900">{dataset.name}</p>
            </div>
          </CardContent>
        </Card>

        {/* Dataset ID Card */}
        <Card className="bg-gray-50 border-l-4 border-l-[#4A4A7A]">
          <CardContent className="py-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">Dataset ID</h3>
              <p className="text-sm text-gray-900">{dataset.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card className="bg-gray-50 border-l-4 border-l-[#4A4A7A]">
          <CardContent className="py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {(Array.isArray(dataset.tags) ? dataset.tags : 
                  typeof dataset.tags === 'string' ? dataset.tags.split(',').map((tag: string) => tag.trim()) : []
                ).map((tag: string, index: number) => (
                  <StatusBadge 
                    key={index} 
                    status={tag} 
                    variant="default" 
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1" 
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Classifications Card */}
        <Card className="bg-gray-50 border-l-4 border-l-[#4A4A7A]">
          <CardContent className="py-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">Security Classifications</h3>
              <p className="text-sm text-gray-900">{dataset.sensitivity}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="data-quality">Data Quality & Profiling</TabsTrigger>
          <TabsTrigger value="dataset-table">Dataset Table</TabsTrigger>
          <TabsTrigger value="lineage">Lineage</TabsTrigger>
          <TabsTrigger value="access-permissions">Access & Permissions</TabsTrigger>
          <TabsTrigger value="version-history">Version History</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab dataset={dataset} />
        </TabsContent>

        <TabsContent value="metadata">
          <MetadataTab dataset={dataset} />
        </TabsContent>

        <TabsContent value="data-quality">
          <DataQualityTab dataset={dataset} />
        </TabsContent>

        <TabsContent value="dataset-table">
          <DatasetTableTab datasetId={datasetId} dataset={dataset} />
        </TabsContent>

        <TabsContent value="lineage">
          <LineageTab dataset={dataset} />
        </TabsContent>

        <TabsContent value="access-permissions">
          <AccessPermissionsTab dataset={dataset} />
        </TabsContent>

        <TabsContent value="version-history">
          <VersionHistoryTab dataset={dataset} />
        </TabsContent>

        <TabsContent value="issues">
          <IssueLogPanel datasetId={datasetId} />
        </TabsContent>
      </Tabs>

      {/* Report Issue Modal */}
      <ReportIssueModal
        open={reportIssueModalOpen}
        onOpenChange={setReportIssueModalOpen}
        datasetId={datasetId}
        datasetName={dataset.name}
      />

    </div>
  );
}
