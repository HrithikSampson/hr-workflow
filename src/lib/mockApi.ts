import { NodeData } from "@/types/nodeData";

export interface WorkflowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  type: string;
  animated: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'hr_workflows';

function loadWorkflowsFromStorage(): Map<string, Workflow> {
  if (typeof window === 'undefined') return new Map();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return new Map();

  try {
    const parsed = JSON.parse(stored);
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

function saveWorkflowsToStorage(workflows: Map<string, Workflow>) {
  if (typeof window === 'undefined') return;

  const obj = Object.fromEntries(workflows.entries());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

const workflows = loadWorkflowsFromStorage();

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
  description?: string;
}

export interface SimulationStep {
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp: string;
  details: string;
  output?: Record<string, any>;
}

export interface SimulationResult {
  workflowId: string;
  status: "success" | "error";
  steps: SimulationStep[];
  errors: string[];
  startTime: string;
  endTime: string;
  totalDuration: number;
}

const automationActions: AutomationAction[] = [
  {
    id: "send_email",
    label: "Send Email",
    params: ["to", "subject", "body"],
    description: "Send an email notification to specified recipients"
  },
  {
    id: "generate_doc",
    label: "Generate Document",
    params: ["template", "recipient", "format"],
    description: "Generate a document from a template"
  },
  {
    id: "create_ticket",
    label: "Create Support Ticket",
    params: ["title", "description", "priority"],
    description: "Create a support ticket in the system"
  },
  {
    id: "update_database",
    label: "Update Database",
    params: ["table", "field", "value"],
    description: "Update a database record"
  },
  {
    id: "send_notification",
    label: "Send Notification",
    params: ["recipient", "message", "channel"],
    description: "Send a notification via specified channel"
  },
  {
    id: "webhook_call",
    label: "Call Webhook",
    params: ["url", "method", "payload"],
    description: "Make an HTTP request to an external webhook"
  }
];

function getExecutionOrder(edges: WorkflowEdge[], startNodeId: string): string[] {
  const order: string[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    if (visited.has(currentId)) continue;
    visited.add(currentId);
    order.push(currentId);

    const outgoingEdges = edges.filter(e => e.source === currentId);
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }

  return order;
}

async function simulateNodeExecution(node: WorkflowNode): Promise<SimulationStep> {
  const timestamp = new Date().toISOString();
  const data = node.data as any;

  switch (node.type) {
    case "startNode":
      return {
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: data?.title || "Start",
        status: "completed",
        timestamp,
        details: "Workflow started",
        output: { metadata: data?.metadata }
      };

    case "taskNode":
      return {
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: data?.title || "Task",
        status: "completed",
        timestamp,
        details: `Task assigned to ${data?.assignee || 'unassigned'}`,
        output: {
          assignee: data?.assignee,
          dueDate: data?.dueDate
        }
      };

    case "approvalNode":
      const approved = Math.random() > 0.3;
      return {
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: data?.title || "Approval",
        status: "completed",
        timestamp,
        details: approved
          ? `Approved by ${data?.approverRole || 'unknown'}`
          : `Rejected by ${data?.approverRole || 'unknown'}`,
        output: { approved, approverRole: data?.approverRole }
      };

    case "automatedStepNode":
      const action = data?.action || "unknown_action";
      return {
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: data?.title || "Automated Step",
        status: "completed",
        timestamp,
        details: `Executed automation: ${action}`,
        output: {
          action,
          parameters: data?.actionParameters || {}
        }
      };

    case "endNode":
      return {
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: "End",
        status: "completed",
        timestamp,
        details: data?.endMessage || "Workflow completed",
        output: { showSummary: data?.showSummary }
      };

    default:
      return {
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: "Unknown",
        status: "failed",
        timestamp,
        details: `Unknown node type: ${node.type}`
      };
  }
}

export const mockAPI = {
  automations: {
    getAll: async (): Promise<AutomationAction[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...automationActions];
    },

    getById: async (id: string): Promise<AutomationAction | null> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return automationActions.find(action => action.id === id) || null;
    }
  },

  simulate: {
    execute: async (workflow: {
      nodes: WorkflowNode[];
      edges: WorkflowEdge[];
    }): Promise<SimulationResult> => {
      const startTime = new Date().toISOString();
      const steps: SimulationStep[] = [];
      const errors: string[] = [];

      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const startNode = workflow.nodes.find(n => n.type === "startNode");
        if (!startNode) {
          errors.push("No start node found in workflow");
          return {
            workflowId: `sim_${Date.now()}`,
            status: "error",
            steps,
            errors,
            startTime,
            endTime: new Date().toISOString(),
            totalDuration: 0
          };
        }

        const executionOrder = getExecutionOrder(workflow.edges, startNode.id);

        if (executionOrder.length === 0) {
          errors.push("Could not determine execution order - workflow may have cycles");
        }

        for (const nodeId of executionOrder) {
          const node = workflow.nodes.find(n => n.id === nodeId);
          if (!node) continue;

          const step = await simulateNodeExecution(node);
          steps.push(step);

          await new Promise(resolve => setTimeout(resolve, 300));
        }

        const endTime = new Date().toISOString();
        const totalDuration = new Date(endTime).getTime() - new Date(startTime).getTime();

        return {
          workflowId: `sim_${Date.now()}`,
          status: errors.length > 0 ? "error" : "success",
          steps,
          errors,
          startTime,
          endTime,
          totalDuration
        };
      } catch (error) {
        errors.push(`Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return {
          workflowId: `sim_${Date.now()}`,
          status: "error",
          steps,
          errors,
          startTime,
          endTime: new Date().toISOString(),
          totalDuration: 0
        };
      }
    }
  },

  export: {
    toJSON: async (workflowId: string): Promise<string> => {
      const workflow = workflows.get(workflowId);
      if (!workflow) {
        throw new Error("Workflow not found");
      }

      await new Promise(resolve => setTimeout(resolve, 200));
      return JSON.stringify(workflow, null, 2);
    },

    downloadJSON: (_workflowId: string, workflowName: string, jsonData: string): void => {
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${workflowName.replace(/\s+/g, "_")}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },

  import: {
    fromJSON: async (jsonData: string): Promise<Workflow> => {
      await new Promise(resolve => setTimeout(resolve, 200));

      const workflow = JSON.parse(jsonData) as Workflow;

      if (!workflow.id || !workflow.name || !Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
        throw new Error("Invalid workflow JSON format");
      }

      const newId = `workflow_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const importedWorkflow: Workflow = {
        ...workflow,
        id: newId,
        name: `${workflow.name} (Imported)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      workflows.set(newId, importedWorkflow);
      saveWorkflowsToStorage(workflows);
      return importedWorkflow;
    }
  },

  workflows: {
    getAll: async (): Promise<Workflow[]> => {
      const all = Array.from(workflows.values()).sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      return all;
    },

    getById: async (id: string): Promise<Workflow | null> => {
      return workflows.get(id) || null;
    },

    create: async (name: string): Promise<Workflow> => {
      const workflow: Workflow = {
        id: `workflow_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        name,
        nodes: [],
        edges: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      workflows.set(workflow.id, workflow);
      saveWorkflowsToStorage(workflows);
      return workflow;
    },

    update: async (
      id: string,
      updates: {
        name?: string;
        nodes?: WorkflowNode[];
        edges?: WorkflowEdge[];
      }
    ): Promise<Workflow | null> => {
      const workflow = workflows.get(id);
      if (!workflow) return null;

      const updated: Workflow = {
        ...workflow,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      workflows.set(id, updated);
      saveWorkflowsToStorage(workflows);
      return updated;
    },

    delete: async (id: string): Promise<boolean> => {
      const result = workflows.delete(id);
      saveWorkflowsToStorage(workflows);
      return result;
    },

    save: async (
      id: string,
      nodes: WorkflowNode[],
      edges: WorkflowEdge[]
    ): Promise<Workflow | null> => {
      const workflow = workflows.get(id);
      if (!workflow) return null;

      const updated: Workflow = {
        ...workflow,
        nodes,
        edges,
        updatedAt: new Date().toISOString(),
      };
      workflows.set(id, updated);
      saveWorkflowsToStorage(workflows);
      return updated;
    },
  },
};
