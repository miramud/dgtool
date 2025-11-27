"use client";

import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowById } from "@/modules/workflows/controllers/workflowController";

interface ViewAsFlowCardProps {
  workflowId: string;
  onBack: () => void;
}

// Helper to get ordinal suffix
const getOrdinal = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

// Helper to get level name
const getLevelName = (index: number): string => {
  const levels = ["First", "Second", "Third", "Fourth", "Fifth"];
  return levels[index] || `${getOrdinal(index + 1)}`;
};

export default function ViewAsFlowCard({
  workflowId,
  onBack,
}: ViewAsFlowCardProps) {
  const { data: workflow, isLoading } = useWorkflowById(workflowId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A4A7A]" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Workflow not found</p>
        <Button onClick={onBack} className="mt-4">
          Back to Workflows
        </Button>
      </div>
    );
  }

  // Create flow cards based on workflow approvers
  const flowCards = workflow.workflow_approvers
    .sort((a, b) => a.approval_order - b.approval_order)
    .map((approver, index) => ({
      title: `${workflow.name} approval`,
      approverLevel: `${getLevelName(index)} Level Approval`,
      approverName: `${approver.approver.first_name} ${approver.approver.last_name}`,
      role: approver.role.name,
      isLast: index === workflow.workflow_approvers.length - 1,
    }));

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workflows
        </Button>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{workflow.name}</h1>
        <p className="text-gray-600 text-sm mt-1">
          {workflow.description || "Workflow approval process"}
        </p>
      </div>

      {/* Flow Cards */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-start gap-4 overflow-x-auto pb-4">
          {flowCards.map((card, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Card */}
              <div className="min-w-[260px] bg-[#B8B8D1] rounded-lg overflow-hidden shadow-sm">
                {/* Card Header */}
                <div className="bg-[#9090B8] px-4 py-3">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {card.title}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Approval Level
                    </label>
                    <div className="bg-white px-3 py-2 rounded-md border border-gray-200 text-gray-700 text-sm">
                      {card.approverLevel}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Approver
                    </label>
                    <div className="bg-white px-3 py-2 rounded-md border border-gray-200 text-gray-700 text-sm">
                      {card.approverName}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Role
                    </label>
                    <div className="inline-block bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 text-sm">
                      {card.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow between cards */}
              {!card.isLast && (
                <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
