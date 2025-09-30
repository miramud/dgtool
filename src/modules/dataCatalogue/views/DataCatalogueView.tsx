"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";

// Tab content components
import OverviewTab from "../components/OverviewTab";
import MetadataTab from "../components/MetadataTab";
import DataQualityTab from "../components/DataQualityTab";
import LineageTab from "../components/LineageTab";
import AccessPermissionsTab from "../components/AccessPermissionsTab";
import VersionHistoryTab from "../components/VersionHistoryTab";

interface DataCatalogueViewProps {
  className?: string;
  datasetId?: string;
}

interface DatasetInfo {
  name: string;
  id: string;
  tags: string[];
  securityClassification: string;
}

const mockDatasetInfo: DatasetInfo = {
  name: "Well Production Data – Niger Delta Block A",
  id: "DS-PRD-00032",
  tags: ["Production", "Reservoir", "Seismic"],
  securityClassification: "Confidential"
};

export default function DataCatalogueView({
  className,
}: DataCatalogueViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={cn("p-6 space-y-6 bg-white", className)}>
      {/* Report Data Issues Button */}
      <div className="flex justify-end">
        <Button 
          variant="default" 
          className="bg-[#4A4A7A] hover:bg-[#3A3A6A]"
        >
          Report Data Issues
        </Button>
      </div>

      {/* Header Section with Dataset Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Dataset Name Card */}
        <Card className="bg-gray-50 border-l-4 border-l-[#4A4A7A]">
          <CardContent className="py-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">Dataset Name</h3>
              <p className="text-sm text-gray-900">{mockDatasetInfo.name}</p>
            </div>
          </CardContent>
        </Card>

        {/* Dataset ID Card */}
        <Card className="bg-gray-50 border-l-4 border-l-[#4A4A7A]">
          <CardContent className="py-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">Dataset ID</h3>
              <p className="text-sm text-gray-900">{mockDatasetInfo.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card className="bg-gray-50 border-l-4 border-l-[#4A4A7A]">
          <CardContent className="py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {mockDatasetInfo.tags.map((tag, index) => (
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
              <p className="text-sm text-gray-900">{mockDatasetInfo.securityClassification}</p>
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
          <TabsTrigger value="lineage">Lineage</TabsTrigger>
          <TabsTrigger value="access-permissions">Access & Permissions</TabsTrigger>
          <TabsTrigger value="version-history">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="metadata">
          <MetadataTab />
        </TabsContent>

        <TabsContent value="data-quality">
          <DataQualityTab />
        </TabsContent>

        <TabsContent value="lineage">
          <LineageTab />
        </TabsContent>

        <TabsContent value="access-permissions">
          <AccessPermissionsTab />
        </TabsContent>

        <TabsContent value="version-history">
          <VersionHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}