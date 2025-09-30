"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LineageNode {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

interface LineageConnection {
  from: string;
  to: string;
  label?: string;
}

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

export default function LineageTab() {
  const [selectedItem, setSelectedItem] = useState<LineageNode | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const lineageNodes = useMemo<LineageNode[]>(() => [
    {
      id: "source",
      type: "Source",
      name: "SCADA Historian",
      x: 100,
      y: 200,
      width: 160,
      height: 80,
      bgColor: "#f3f4f6",
      textColor: "#374151",
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
      x: 350,
      y: 200,
      width: 160,
      height: 80,
      bgColor: "#dbeafe",
      textColor: "#1d4ed8",
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
      x: 600,
      y: 200,
      width: 160,
      height: 80,
      bgColor: "#dcfce7",
      textColor: "#15803d",
      details: {
        description: "Daily oil production data from Niger Delta Block A",
        owner: "Production Team",
        timestamp: "2025-08-20 14:30 UTC"
      }
    },
    {
      id: "target1",
      type: "Target",
      name: "Production Dashboard", 
      x: 850,
      y: 150,
      width: 160,
      height: 80,
      bgColor: "#fae8ff",
      textColor: "#9333ea",
      details: {
        description: "Real-time dashboard for production monitoring",
        owner: "Business Intelligence Team",
        timestamp: "2025-08-20 14:30 UTC"
      }
    },
    {
      id: "target2",
      type: "Target",
      name: "Regulator API", 
      x: 850,
      y: 250,
      width: 160,
      height: 80,
      bgColor: "#fae8ff",
      textColor: "#9333ea",
      details: {
        description: "API endpoint for regulatory reporting",
        owner: "Compliance Team",
        timestamp: "2025-08-20 14:30 UTC"
      }
    }
  ], []);

  const connections: LineageConnection[] = [
    { from: "source", to: "etl", label: "Raw Data" },
    { from: "etl", to: "dataset", label: "Processed Data" },
    { from: "dataset", to: "target1", label: "Dashboard Feed" },
    { from: "dataset", to: "target2", label: "Regulatory Report" }
  ];

  // Zoom and pan functions
  const handleZoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 3)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.3)
    }));
  }, []);

  const handleReset = useCallback(() => {
    setTransform({
      scale: 1,
      translateX: 0,
      translateY: 0
    });
  }, []);

  const handleFitToScreen = useCallback(() => {
    // Calculate bounds of all nodes
    const bounds = lineageNodes.reduce((acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x + node.width),
      maxY: Math.max(acc.maxY, node.y + node.height)
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;

    const padding = 50;
    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    const scaleX = (svgRect.width - padding * 2) / contentWidth;
    const scaleY = (svgRect.height - padding * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const svgCenterX = svgRect.width / 2;
    const svgCenterY = svgRect.height / 2;

    setTransform({
      scale,
      translateX: svgCenterX - centerX * scale,
      translateY: svgCenterY - centerY * scale
    });
  }, [lineageNodes]);

  // Mouse event handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;

    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;

    setTransform(prev => ({
      ...prev,
      translateX: prev.translateX + deltaX,
      translateY: prev.translateY + deltaY
    }));

    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleItemClick = (item: LineageNode) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Helper function to get connection path
  const getConnectionPath = (connection: LineageConnection) => {
    const fromNode = lineageNodes.find(n => n.id === connection.from);
    const toNode = lineageNodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return '';

    const fromX = fromNode.x + fromNode.width;
    const fromY = fromNode.y + fromNode.height / 2;
    const toX = toNode.x;
    const toY = toNode.y + toNode.height / 2;

    const midX = (fromX + toX) / 2;

    return `M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${(fromY + toY) / 2} Q ${midX} ${toY} ${toX} ${toY}`;
  };

  return (
    <div className="h-[800px] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b bg-gray-50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="flex items-center gap-2"
        >
          <ZoomIn className="w-4 h-4" />
          Zoom In
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="flex items-center gap-2"
        >
          <ZoomOut className="w-4 h-4" />
          Zoom Out
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFitToScreen}
          className="flex items-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          Fit to Screen
        </Button>
        <div className="ml-auto text-sm text-gray-600">
          Zoom: {Math.round(transform.scale * 100)}% | Click nodes for details | Drag to pan
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 relative overflow-hidden bg-white">
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6b7280"
              />
            </marker>
            
            {/* Drop shadow filter */}
            <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.1"/>
            </filter>
          </defs>

          <g transform={`translate(${transform.translateX}, ${transform.translateY}) scale(${transform.scale})`}>
            {/* Render connections */}
            {connections.map((connection, index) => (
              <g key={`connection-${index}`}>
                <path
                  d={getConnectionPath(connection)}
                  stroke="#6b7280"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-200"
                />
                {connection.label && (
                  <text
                    x={(lineageNodes.find(n => n.id === connection.from)!.x + lineageNodes.find(n => n.id === connection.from)!.width + lineageNodes.find(n => n.id === connection.to)!.x) / 2}
                    y={(lineageNodes.find(n => n.id === connection.from)!.y + lineageNodes.find(n => n.id === connection.to)!.y) / 2 - 10}
                    textAnchor="middle"
                    className="text-xs fill-gray-600 font-medium"
                    style={{ pointerEvents: 'none' }}
                  >
                    {connection.label}
                  </text>
                )}
              </g>
            ))}

            {/* Render nodes */}
            {lineageNodes.map((node) => (
              <g key={node.id} className="cursor-pointer" onClick={() => handleItemClick(node)}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  fill={node.bgColor}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  rx="8"
                  filter="url(#dropshadow)"
                  className="transition-all duration-200 hover:stroke-blue-400 hover:stroke-2"
                />
                
                <text
                  x={node.x + node.width / 2}
                  y={node.y + 25}
                  textAnchor="middle"
                  className="text-sm font-semibold pointer-events-none"
                  fill={node.textColor}
                >
                  {node.type}
                </text>
                
                <foreignObject
                  x={node.x + 8}
                  y={node.y + 35}
                  width={node.width - 16}
                  height={node.height - 45}
                  className="pointer-events-none"
                >
                  <div className="text-xs text-center font-medium text-gray-900 leading-tight px-2 overflow-hidden">
                    {node.name}
                  </div>
                </foreignObject>
              </g>
            ))}
          </g>
        </svg>
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