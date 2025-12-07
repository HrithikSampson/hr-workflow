import { NodeType } from "@/components/node.types";

export interface BaseNodeData {
  id: string;
  content?: string;
}

export type StartNodeData = BaseNodeData & {
  readonly type: NodeType.START_NODE;
  title: string;
  metadata: Record<string, string>;
};

export interface TaskNodeData extends BaseNodeData {
  readonly type: NodeType.TASK_NODE;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  readonly type: NodeType.APPROVAL_NODE;
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData extends BaseNodeData {
  readonly type: NodeType.AUTOMATED_STEP_NODE;
  title: string;
  action: string;
  actionParameters: Record<string, any>;
}

export interface EndNodeData extends BaseNodeData {
  readonly type: NodeType.END_NODE;
  endMessage: string;
  showSummary: boolean;
}

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

export class NodeDataValidator {
  static isStartNodeData(data: any): data is StartNodeData {
    return (
      data &&
      typeof data.id === "string" &&
      data.type === NodeType.START_NODE &&
      typeof data.title === "string" &&
      typeof data.metadata === "object"
    );
  }

  static isTaskNodeData(data: any): data is TaskNodeData {
    return (
      data &&
      typeof data.id === "string" &&
      data.type === NodeType.TASK_NODE &&
      typeof data.title === "string" &&
      data.title.trim() !== ""
    );
  }

  static isApprovalNodeData(data: any): data is ApprovalNodeData {
    return (
      data &&
      typeof data.id === "string" &&
      data.type === NodeType.APPROVAL_NODE &&
      typeof data.title === "string" &&
      typeof data.approverRole === "string" &&
      typeof data.autoApproveThreshold === "number"
    );
  }

  static isAutomatedStepNodeData(data: any): data is AutomatedStepNodeData {
    return (
      data &&
      typeof data.id === "string" &&
      data.type === NodeType.AUTOMATED_STEP_NODE &&
      typeof data.title === "string" &&
      typeof data.action === "string" &&
      typeof data.actionParameters === "object"
    );
  }

  static isEndNodeData(data: any): data is EndNodeData {
    return (
      data &&
      typeof data.id === "string" &&
      data.type === NodeType.END_NODE &&
      typeof data.endMessage === "string" &&
      typeof data.showSummary === "boolean"
    );
  }

  static validateRequiredFields(data: Partial<NodeData>): boolean {
    if (!data.type) return false;

    switch (data.type) {
      case NodeType.START_NODE:
        return !!(data as Partial<StartNodeData>).title;
      case NodeType.TASK_NODE:
        return !!((data as Partial<TaskNodeData>).title?.trim());
      case NodeType.APPROVAL_NODE:
        return !!(data as Partial<ApprovalNodeData>).title;
      case NodeType.AUTOMATED_STEP_NODE:
        return !!(data as Partial<AutomatedStepNodeData>).title;
      case NodeType.END_NODE:
        return !!(data as Partial<EndNodeData>).endMessage;
      default:
        return false;
    }
  }

  static getNodeDataType(nodeType: string): NodeType | null {
    switch (nodeType) {
      case "startNode":
        return NodeType.START_NODE;
      case "taskNode":
        return NodeType.TASK_NODE;
      case "approvalNode":
        return NodeType.APPROVAL_NODE;
      case "automatedStepNode":
        return NodeType.AUTOMATED_STEP_NODE;
      case "endNode":
        return NodeType.END_NODE;
      default:
        return null;
    }
  }
}
