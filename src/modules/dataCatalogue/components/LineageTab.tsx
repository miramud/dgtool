"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LineageItem {
  id: string;
  type: string;
  name: string;
  bgColor: string;
  textColor: string;
  details: {
    source?: string;
    datasetName?: string;
    timestamp?: string;
    owner?: string;
    logic?: string;
    description?: string;
  };
}

export default function LineageTab() {
  const [selectedItem, setSelectedItem] = useState<LineageItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const lineageItems: LineageItem[] = [
    {
      id: "source",
      type: "Source",
      name: "SCADA Historian",
      bgColor: "bg-gray-100 hover:bg-gray-200",
      textColor: "text-gray-700",
      details: {
        description: "Historical data collection system for production monitoring",
        owner: "Operations Team",
        timestamp: "2025-08-20 14:30 UTC"
      }
    },
    {
      id: "etl",
      type: "ETL Pipeline",
      name: "Daily load",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700",
      details: {
        source: "Data Engineering team",
        datasetName: "Pass (validation vs reference tables)",
        timestamp: "2025-08-20 14:30 UTC",
        owner: "Data Engineering team",
        logic: "Aggregates daily production values, validates against reference tables, loads to Data Lake"
      }
    },
    {
      id: "dataset",
      type: "Dataset", 
      name: "Well Production Block A",
      bgColor: "bg-green-50 hover:bg-green-100",
      textColor: "text-green-700",
      details: {
        description: "Daily oil production data from Niger Delta Block A",
        owner: "Production Team",
        timestamp: "2025-08-20 14:30 UTC"
      }
    },
    {
      id: "target",
      type: "Target",
      name: "Production Dashboard + Regulator API", 
      bgColor: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700",
      details: {
        description: "Consumer systems for production monitoring and regulatory reporting",
        owner: "Business Intelligence Team",
        timestamp: "2025-08-20 14:30 UTC"
      }
    }
  ];

  const handleItemClick = (item: LineageItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="py-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {lineageItems.map((item, index) => (
            <div key={item.id} className="flex items-center">
              {/* Lineage Item */}
              <div className="text-center">
                <div 
                  className={`w-32 h-20 ${item.bgColor} rounded-lg flex items-center justify-center mb-2 cursor-pointer transition-colors duration-200`}
                  onClick={() => handleItemClick(item)}
                >
                  <span className={`text-sm font-medium ${item.textColor}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {item.name}
                </p>
              </div>

              {/* Arrow (don't show after last item) */}
              {index < lineageItems.length - 1 && (
                <div className="flex items-center px-4">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedItem?.type}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4 mt-4">
              {selectedItem.details.source && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Source:</span>
                  <span className="text-gray-900">{selectedItem.details.source}</span>
                </div>
              )}
              
              {selectedItem.details.datasetName && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Dataset name:</span>
                  <span className="text-gray-900">{selectedItem.details.datasetName}</span>
                </div>
              )}
              
              {selectedItem.details.timestamp && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Timestamp:</span>
                  <span className="text-gray-900">{selectedItem.details.timestamp}</span>
                </div>
              )}
              
              {selectedItem.details.owner && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Owner:</span>
                  <span className="text-gray-900">{selectedItem.details.owner}</span>
                </div>
              )}
              
              {selectedItem.details.logic && (
                <div className="space-y-1">
                  <span className="font-medium text-gray-600">Logic:</span>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {selectedItem.details.logic}
                  </p>
                </div>
              )}
              
              {selectedItem.details.description && (
                <div className="space-y-1">
                  <span className="font-medium text-gray-600">Description:</span>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {selectedItem.details.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}