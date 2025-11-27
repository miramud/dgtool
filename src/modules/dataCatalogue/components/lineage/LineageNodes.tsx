"use client";

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText, Database, User, Calendar, Shield } from 'lucide-react';

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

// Tooltip content component for consistent styling
function NodeTooltip({ data, show }: { data: BaseNodeData; show: boolean }) {
  const details = data.details;
  if (!details || !show) return null;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 shadow-lg pointer-events-none"
      style={{ minWidth: '200px' }}
    >
      <div className="space-y-2 max-w-xs">
        {details.description && (
          <p className="text-xs text-gray-200 line-clamp-2">{details.description}</p>
        )}
        {details.owner && (
          <div className="flex items-center gap-1.5 text-xs">
            <User className="w-3 h-3 text-gray-400" />
            <span className="text-gray-300">Owner:</span>
            <span className="text-white">{details.owner}</span>
          </div>
        )}
        {details.timestamp && (
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-300">Updated:</span>
            <span className="text-white">{details.timestamp}</span>
          </div>
        )}
        {details.businessDomain && (
          <div className="flex items-center gap-1.5 text-xs">
            <Database className="w-3 h-3 text-gray-400" />
            <span className="text-gray-300">Domain:</span>
            <span className="text-white capitalize">{details.businessDomain}</span>
          </div>
        )}
        {details.sensitivity && (
          <div className="flex items-center gap-1.5 text-xs">
            <Shield className="w-3 h-3 text-gray-400" />
            <span className="text-gray-300">Sensitivity:</span>
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              details.sensitivity === 'INTERNAL' ? 'bg-yellow-500/20 text-yellow-300' :
              details.sensitivity === 'EXTERNAL' ? 'bg-green-500/20 text-green-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {details.sensitivity}
            </span>
          </div>
        )}
        <p className="text-xs text-gray-400 pt-1 border-t border-gray-600">Click for more details</p>
      </div>
      {/* Arrow */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 rotate-45" />
    </div>
  );
}

// Source Node Component
export function SourceNode({ data }: NodeProps<BaseNodeData>) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative px-4 py-3 shadow-lg rounded-lg bg-gray-100 border border-gray-300 min-w-[180px] cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
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

      <NodeTooltip data={data} show={showTooltip} />
    </div>
  );
}

// ETL Pipeline Node Component
export function ETLNode({ data }: NodeProps<BaseNodeData>) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative px-4 py-3 shadow-lg rounded-lg bg-blue-100 border border-blue-300 min-w-[160px] cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
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

      <NodeTooltip data={data} show={showTooltip} />
    </div>
  );
}

// Dataset Node Component
export function DatasetNode({ data }: NodeProps<BaseNodeData>) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative px-4 py-3 shadow-lg rounded-lg bg-green-100 border border-green-300 min-w-[160px] cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
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

      <NodeTooltip data={data} show={showTooltip} />
    </div>
  );
}

// Target Node Component
export function TargetNode({ data }: NodeProps<BaseNodeData>) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative px-4 py-3 shadow-lg rounded-lg bg-purple-100 border border-purple-300 min-w-[160px] cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex flex-col">
        <div className="text-xs font-medium text-purple-600 mb-1">Target</div>
        <div className="text-sm font-semibold text-purple-900 text-center">{data.label}</div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-500 border-2 border-white"
      />

      <NodeTooltip data={data} show={showTooltip} />
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
