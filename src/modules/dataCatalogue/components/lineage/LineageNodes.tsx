"use client";

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText, Database } from 'lucide-react';

// Base interface for node data
export interface BaseNodeData {
  label: string;
  description?: string;
  owner?: string;
  timestamp?: string;
  downloadUrl?: string;
  fileType?: 'raw' | 'processed';
  details?: {
    source?: string;
    datasetName?: string;
    logic?: string;
    description?: string;
    owner?: string;
    timestamp?: string;
    reference?: string;
    sensitivity?: string;
    businessDomain?: string;
    tags?: string[];
  };
}

// Source Node Component
export function SourceNode({ data }: NodeProps<BaseNodeData>) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-gray-100 border border-gray-300 min-w-[180px]">
      <div className="flex flex-col">
        <div className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
          <FileText className="w-3 h-3" />
          Source
        </div>
        <div className="text-sm font-semibold text-gray-900 text-center">{data.label}</div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gray-500 border-2 border-white"
      />
    </div>
  );
}

// ETL Pipeline Node Component
export function ETLNode({ data }: NodeProps<BaseNodeData>) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-blue-100 border border-blue-300 min-w-[160px]">
      <div className="flex flex-col">
        <div className="text-xs font-medium text-blue-600 mb-1">ETL Pipeline</div>
        <div className="text-sm font-semibold text-blue-900 text-center">{data.label}</div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />
    </div>
  );
}

// Dataset Node Component  
export function DatasetNode({ data }: NodeProps<BaseNodeData>) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-green-100 border border-green-300 min-w-[160px]">
      <div className="flex flex-col">
        <div className="text-xs font-medium text-green-600 mb-1 flex items-center gap-1">
          <Database className="w-3 h-3" />
          {data.fileType === 'raw' ? 'Raw Dataset' : 'Processed Dataset'}
        </div>
        <div className="text-sm font-semibold text-green-900 text-center">{data.label}</div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-green-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 border-2 border-white"
      />
    </div>
  );
}

// Target Node Component
export function TargetNode({ data }: NodeProps<BaseNodeData>) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-purple-100 border border-purple-300 min-w-[160px]">
      <div className="flex flex-col">
        <div className="text-xs font-medium text-purple-600 mb-1">Target</div>
        <div className="text-sm font-semibold text-purple-900 text-center">{data.label}</div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-500 border-2 border-white"
      />
    </div>
  );
}

// Export node types for React Flow
export const nodeTypes = {
  sourceNode: SourceNode,
  etlNode: ETLNode,
  datasetNode: DatasetNode,
  targetNode: TargetNode,
};