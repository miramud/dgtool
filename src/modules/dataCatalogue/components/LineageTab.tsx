"use client";

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes, BaseNodeData } from './lineage/LineageNodes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Info, Filter, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LineageTabProps {
  dataset: {
    id: string;
    name: string;
    description: string;
    reference: string;
    business_domain: string;
    sensitivity: string;
    tags: string[];
    raw_file?: string;
    processed_file?: string;
    created_datetime: string;
    created_by: {
      first_name: string;
      last_name: string;
      email: string;
    };
    metadata_template?: {
      name: string;
      dataset_type: {
        name: string;
      };
    };
  };
  isLoading?: boolean;
}

// Filter options
type NodeTypeFilter = 'all' | 'source' | 'dataset' | 'etl';

interface LineageFilters {
  nodeType: NodeTypeFilter;
  owner: string;
}

// Loading skeleton component
function LineageSkeleton() {
  return (
    <div className="h-[400px] w-full bg-gray-50 rounded-lg border border-gray-200 p-4">
      {/* Filter bar skeleton */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-9 w-32 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-9 w-32 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Flow skeleton */}
      <div className="relative h-[300px] flex items-center justify-center">
        {/* Skeleton nodes */}
        <div className="flex items-center gap-8">
          <div className="w-[140px] h-[60px] bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-16 h-0.5 bg-gray-200 animate-pulse" />
          <div className="w-[140px] h-[60px] bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-16 h-0.5 bg-gray-200 animate-pulse" />
          <div className="w-[140px] h-[60px] bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-16 h-0.5 bg-gray-200 animate-pulse" />
          <div className="w-[140px] h-[60px] bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Controls skeleton */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Panel skeleton */}
        <div className="absolute top-2 right-2 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <div className="w-20 h-7 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Generate dynamic nodes based on dataset data
const generateLineageNodes = (dataset: LineageTabProps['dataset']): Node<BaseNodeData>[] => {
  const createdBy = `${dataset.created_by.first_name} ${dataset.created_by.last_name}`;
  const createdDate = formatDate(dataset.created_datetime, { format: 'short', includeTime: true });
  
  const nodes: Node<BaseNodeData>[] = [
    // Source (Raw File Upload)
    {
      id: 'source',
      type: 'sourceNode',
      position: { x: 100, y: 50 },
      data: {
        label: 'File Upload',
        details: {
          description: `Original file uploaded by ${createdBy}`,
          owner: createdBy,
          timestamp: createdDate,
          source: createdBy
        }
      }
    },
    // Raw Dataset
    {
      id: 'raw-dataset',
      type: 'datasetNode',
      position: { x: 350, y: 50 },
      data: {
        label: `${dataset.name} (Raw)`,
        fileType: 'raw',
        downloadUrl: dataset.raw_file,
        details: {
          description: dataset.description,
          owner: createdBy,
          timestamp: createdDate,
          reference: dataset.reference,
          sensitivity: dataset.sensitivity,
          businessDomain: dataset.business_domain,
          tags: dataset.tags
        }
      }
    },
    // ETL Process
    {
      id: 'etl',
      type: 'etlNode',
      position: { x: 600, y: 50 },
      data: {
        label: 'Data Processing',
        details: {
          source: createdBy,
          datasetName: dataset.metadata_template?.name || dataset.name,
          timestamp: createdDate,
          owner: createdBy,
          logic: 'Validates, cleanses, and transforms raw data according to business rules and data quality standards'
        }
      }
    }
  ];

  // Add processed dataset if available
  if (dataset.processed_file) {
    nodes.push({
      id: 'processed-dataset',
      type: 'datasetNode',
      position: { x: 850, y: 50 },
      data: {
        label: `${dataset.name} (Clean)`,
        fileType: 'processed',
        downloadUrl: dataset.processed_file,
        details: {
          description: `Processed and cleaned version of ${dataset.name}`,
          owner: 'System',
          timestamp: createdDate,
          reference: dataset.reference,
          sensitivity: dataset.sensitivity,
          businessDomain: dataset.business_domain,
          tags: dataset.tags
        }
      }
    });
  }

  // Target applications removed for now

  return nodes;
};

// Generate dynamic edges based on dataset data
const generateLineageEdges = (dataset: LineageTabProps['dataset']): Edge[] => {
  const edges: Edge[] = [
    {
      id: 'e1-2',
      source: 'source',
      target: 'raw-dataset',
      label: 'Upload',
      type: 'smoothstep',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      labelStyle: { fontSize: 12, fontWeight: 500 },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 }
    },
    {
      id: 'e2-3',
      source: 'raw-dataset',
      target: 'etl',
      label: 'Raw Data',
      type: 'smoothstep',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      labelStyle: { fontSize: 12, fontWeight: 500 },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 }
    }
  ];

  // Add processed dataset edge if available
  if (dataset.processed_file) {
    edges.push({
      id: 'e3-4',
      source: 'etl',
      target: 'processed-dataset',
      label: 'Clean Data',
      type: 'smoothstep',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      labelStyle: { fontSize: 12, fontWeight: 500 },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 }
    });

    // Target edges removed for now
  }
  // Target edges removed for scenarios without processed files

  return edges;
};

function LineageFlow({ dataset }: LineageTabProps) {
  // Memoize dynamic nodes and edges to prevent infinite re-renders
  const dynamicNodes = useMemo(() => generateLineageNodes(dataset), [dataset]);
  const dynamicEdges = useMemo(() => generateLineageEdges(dataset), [dataset]);

  const [selectedNode, setSelectedNode] = useState<Node<BaseNodeData> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<LineageFilters>({
    nodeType: 'all',
    owner: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { fitView } = useReactFlow();

  // Get unique owners from nodes
  const owners = useMemo(() => {
    const ownerSet = new Set<string>();
    dynamicNodes.forEach(node => {
      if (node.data.details?.owner) {
        ownerSet.add(node.data.details.owner);
      }
    });
    return Array.from(ownerSet);
  }, [dynamicNodes]);

  // Filter nodes based on selected filters
  const filteredNodes = useMemo(() => {
    return dynamicNodes.filter(node => {
      // Filter by node type
      if (filters.nodeType !== 'all') {
        const nodeTypeMap: Record<string, NodeTypeFilter> = {
          'sourceNode': 'source',
          'datasetNode': 'dataset',
          'etlNode': 'etl',
        };
        if (nodeTypeMap[node.type || ''] !== filters.nodeType) {
          return false;
        }
      }

      // Filter by owner
      if (filters.owner !== 'all' && node.data.details?.owner !== filters.owner) {
        return false;
      }

      return true;
    });
  }, [dynamicNodes, filters]);

  // Filter edges to only show connections between visible nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    return dynamicEdges.filter(edge =>
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [dynamicEdges, filteredNodes]);

  // Use the filtered nodes and edges directly with ReactFlow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(filteredNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(filteredEdges);

  // Update nodes and edges when filters change
  useEffect(() => {
    setNodes(filteredNodes);
    setEdges(filteredEdges);
    // Fit view after filter change
    const timeoutId = setTimeout(() => fitView({ duration: 300, padding: 0.2 }), 50);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const hasActiveFilters = filters.nodeType !== 'all' || filters.owner !== 'all';

  const clearFilters = () => {
    setFilters({ nodeType: 'all', owner: 'all' });
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<BaseNodeData>) => {
      setSelectedNode(node);
      setModalOpen(true);
    },
    [],
  );

  const handleReset = useCallback(() => {
    fitView({ duration: 500, padding: 0.2 });
  }, [fitView]);

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 ${hasActiveFilters ? 'border-[#4A4A7A] text-[#4A4A7A]' : ''}`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 bg-[#4A4A7A] text-white text-xs rounded-full">
              {(filters.nodeType !== 'all' ? 1 : 0) + (filters.owner !== 'all' ? 1 : 0)}
            </span>
          )}
        </Button>

        {showFilters && (
          <>
            <Select
              value={filters.nodeType}
              onValueChange={(value: NodeTypeFilter) => setFilters(f => ({ ...f, nodeType: value }))}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Node Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="source">Source</SelectItem>
                <SelectItem value="dataset">Dataset</SelectItem>
                <SelectItem value="etl">ETL Pipeline</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.owner}
              onValueChange={(value) => setFilters(f => ({ ...f, owner: value }))}
            >
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {owners.map(owner => (
                  <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </>
        )}

        {hasActiveFilters && !showFilters && (
          <span className="text-sm text-gray-500">
            Showing {filteredNodes.length} of {dynamicNodes.length} nodes
          </span>
        )}
      </div>

      {/* React Flow */}
      <div className="h-[350px] w-full border border-gray-200 rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2
          }}
          attributionPosition="top-right"
          proOptions={{
            hideAttribution: true,
          }}
        >
          {/* Background with grid pattern */}
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#e5e7eb"
          />

          {/* Controls panel */}
          <Controls
            position="top-left"
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />

          {/* Custom panel with reset button and instructions */}
          <Panel position="top-right" className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Reset View
              </Button>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Hover for summary
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Node Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedNode?.data.label}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNode?.data.details && (
            <div className="space-y-4 mt-4">
              {selectedNode.data.details.description && (
                <div className="space-y-1">
                  <span className="font-medium text-gray-600">Description:</span>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {selectedNode.data.details.description}
                  </p>
                </div>
              )}
              
              {selectedNode.data.details.reference && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Reference:</span>
                  <span className="text-gray-900 font-mono text-xs">{selectedNode.data.details.reference}</span>
                </div>
              )}
              
              {selectedNode.data.details.owner && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Owner:</span>
                  <span className="text-gray-900">{selectedNode.data.details.owner}</span>
                </div>
              )}
              
              {selectedNode.data.details.timestamp && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Created:</span>
                  <span className="text-gray-900">{selectedNode.data.details.timestamp}</span>
                </div>
              )}
              
              {selectedNode.data.details.businessDomain && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Business Domain:</span>
                  <span className="text-gray-900 capitalize">{selectedNode.data.details.businessDomain}</span>
                </div>
              )}
              
              {selectedNode.data.details.sensitivity && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Sensitivity:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedNode.data.details.sensitivity === 'INTERNAL' ? 'bg-yellow-100 text-yellow-800' :
                    selectedNode.data.details.sensitivity === 'EXTERNAL' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedNode.data.details.sensitivity}
                  </span>
                </div>
              )}
              
              {selectedNode.data.details.tags && selectedNode.data.details.tags.length > 0 && (
                <div className="space-y-1">
                  <span className="font-medium text-gray-600">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.data.details.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Show different details for ETL node */}
              {selectedNode.type === 'etlNode' ? (
                <>
                  {selectedNode.data.details.source && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Source:</span>
                      <span className="text-gray-900">{selectedNode.data.details.source}</span>
                    </div>
                  )}
                  
                  {selectedNode.data.details.datasetName && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Dataset name:</span>
                      <span className="text-gray-900">{selectedNode.data.details.datasetName}</span>
                    </div>
                  )}
                  
                  {selectedNode.data.details.timestamp && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Timestamp:</span>
                      <span className="text-gray-900">{selectedNode.data.details.timestamp}</span>
                    </div>
                  )}
                  
                  {selectedNode.data.details.owner && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Owner:</span>
                      <span className="text-gray-900">{selectedNode.data.details.owner}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {selectedNode.data.details.source && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Source:</span>
                      <span className="text-gray-900">{selectedNode.data.details.source}</span>
                    </div>
                  )}
                  
                  {selectedNode.data.details.datasetName && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Template:</span>
                      <span className="text-gray-900">{selectedNode.data.details.datasetName}</span>
                    </div>
                  )}
                  
                  {selectedNode.data.details.logic && (
                    <div className="space-y-1">
                      <span className="font-medium text-gray-600">Processing Logic:</span>
                      <p className="text-gray-900 text-sm leading-relaxed bg-gray-50 p-3 rounded-md">
                        {selectedNode.data.details.logic}
                      </p>
                    </div>
                  )}
                </>
              )}
              
              {/* Download button if this node has a download URL */}
              {selectedNode.data.downloadUrl && (
                <div className="pt-2 border-t">
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedNode.data.downloadUrl!;
                      link.download = '';
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full bg-[#4A4A7A] hover:bg-[#3A3A6A] text-white"
                  >
                    Download {selectedNode.data.fileType === 'raw' ? 'Raw' : 'Processed'} File
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LineageTab({ dataset, isLoading }: LineageTabProps) {
  if (isLoading) {
    return <LineageSkeleton />;
  }

  return (
    <div className="p-4">
      <ReactFlowProvider>
        <LineageFlow dataset={dataset} />
      </ReactFlowProvider>
    </div>
  );
}