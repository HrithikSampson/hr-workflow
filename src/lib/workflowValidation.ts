import { NodeDataValidator } from "@/types/nodeData";
import { NodeType as NodeTypeEnum } from "@/components/node.types/nodeTypes";
import { getSchemaForNodeType } from "./nodeSchemas";

interface ValidationNode {
  id: string;
  type: string;
  data: any;
}

interface ValidationEdge {
  id: string;
  source: string;
  target: string;
}

export interface ValidationError {
  type: "error" | "warning";
  message: string;
  nodeId?: string;
  field?: string;
}

export class WorkflowValidator {
  static validateWorkflow(
    nodes: ValidationNode[],
    edges: ValidationEdge[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (nodes.length === 0) {
      errors.push({
        type: "error",
        message: "Workflow must contain at least one node",
      });
      return errors;
    }

    errors.push(...this.validateStartNode(nodes));
    errors.push(...this.validateEndNode(nodes));
    errors.push(...this.validateConnections(nodes, edges));
    errors.push(...this.validateRequiredFields(nodes));

    return errors;
  }

  private static validateStartNode(nodes: ValidationNode[]): ValidationError[] {
    const errors: ValidationError[] = [];
    const startNodes = nodes.filter((node) => node.type === "startNode");

    if (startNodes.length === 0) {
      errors.push({
        type: "error",
        message: "Workflow must have at least one Start Node",
      });
    } else if (startNodes.length > 1) {
      errors.push({
        type: "error",
        message: "Workflow can only have one Start Node",
      });
    }

    return errors;
  }

  private static validateEndNode(nodes: ValidationNode[]): ValidationError[] {
    const errors: ValidationError[] = [];
    const endNodes = nodes.filter((node) => node.type === "endNode");

    if (endNodes.length === 0) {
      errors.push({
        type: "error",
        message: "Workflow must have at least one End Node",
      });
    }

    return errors;
  }

  private static validateConnections(
    nodes: ValidationNode[],
    edges: ValidationEdge[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (nodes.length > 1 && edges.length === 0) {
      errors.push({
        type: "error",
        message: "Nodes must be connected with edges",
      });
      return errors;
    }

    const connectedNodes = new Set<string>();
    edges.forEach((edge) => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    const startNodes = nodes.filter((node) => node.type === "startNode");
    const disconnectedNodes = nodes.filter(
      (node) => !connectedNodes.has(node.id) && node.type !== "startNode"
    );

    if (disconnectedNodes.length > 0) {
      disconnectedNodes.forEach((node) => {
        errors.push({
          type: "error",
          message: `Node is not connected to the workflow`,
          nodeId: node.id,
        });
      });
    }

    const nodesWithoutOutgoing = nodes.filter((node) => {
      const hasOutgoing = edges.some((edge) => edge.source === node.id);
      return !hasOutgoing && node.type !== "endNode";
    });

    if (nodesWithoutOutgoing.length > 0) {
      nodesWithoutOutgoing.forEach((node) => {
        errors.push({
          type: "error",
          message: `Node must have an outgoing connection (except End Nodes)`,
          nodeId: node.id,
        });
      });
    }

    const nodesWithoutIncoming = nodes.filter((node) => {
      const hasIncoming = edges.some((edge) => edge.target === node.id);
      return !hasIncoming && node.type !== "startNode";
    });

    if (nodesWithoutIncoming.length > 0) {
      nodesWithoutIncoming.forEach((node) => {
        errors.push({
          type: "error",
          message: `Node must have an incoming connection (except Start Nodes)`,
          nodeId: node.id,
        });
      });
    }

    return errors;
  }

  private static validateRequiredFields(
    nodes: ValidationNode[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    nodes.forEach((node) => {
      const schema = getSchemaForNodeType(node.type);

      if (!schema) {
        errors.push({
          type: "error",
          message: `Unknown node type: ${node.type}`,
          nodeId: node.id,
        });
        return;
      }

      const result = schema.safeParse(node.data);

      if (!result.success) {
        // Process each validation error from Zod
        result.error.issues.forEach((issue) => {
          const fieldPath = issue.path.join(".");
          const fieldName = fieldPath || "Unknown field";

          errors.push({
            type: "error",
            message: issue.message,
            nodeId: node.id,
            field: fieldName,
          });
        });
      }
    });

    return errors;
  }

  static formatValidationErrors(errors: ValidationError[]): string {
    if (errors.length === 0) return "";

    const errorMessages = errors.map((error, index) => {
      if (error.nodeId && error.field) {
        return `${index + 1}. ${error.field}: ${error.message} (Node ID: ${error.nodeId})`;
      } else if (error.nodeId) {
        return `${index + 1}. ${error.message} (Node ID: ${error.nodeId})`;
      }
      return `${index + 1}. ${error.message}`;
    });

    return errorMessages.join("\n");
  }
}
