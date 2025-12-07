export interface BaseNodeData {
  id: string;
  content?: string;
}

export interface StartNodeData extends BaseNodeData {
  title: string;
  metadata: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData extends BaseNodeData {
  title: string;
  action: string;
  actionParameters: Record<string, any>;
}

export interface EndNodeData extends BaseNodeData {
  endMessage: string;
  showSummary: boolean;
}

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;
