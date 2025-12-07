import { z } from "zod";
import { NodeType } from "@/components/node.types";

// Base schema for all nodes
const baseNodeSchema = z.object({
  id: z.string().min(1, "ID is required"),
  content: z.string().optional(),
});

// Start Node Schema
export const startNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.START_NODE),
  title: z.string().min(1, "Title is required"),
  metadata: z.record(z.string(), z.string()).default({}),
});

// Task Node Schema
export const taskNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.TASK_NODE),
  title: z.string().min(1, "Title is required").refine(
    (val) => val.trim().length > 0,
    "Title cannot be empty or whitespace only"
  ),
  description: z.string().min(1, "Description is required"),
  assignee: z.string().min(1, "Assignee is required"),
  dueDate: z.string().min(1, "Due date is required"),
  customFields: z.record(z.string(), z.string()).default({}),
});

// Approval Node Schema
export const approvalNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.APPROVAL_NODE),
  title: z.string().min(1, "Title is required"),
  approverRole: z.string().min(1, "Approver role is required"),
  autoApproveThreshold: z.number().min(0, "Threshold must be non-negative"),
});

// Automated Step Node Schema
export const automatedStepNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.AUTOMATED_STEP_NODE),
  title: z.string().min(1, "Title is required"),
  action: z.string().min(1, "Action is required"),
  actionParameters: z.record(z.string(), z.any()).default({}),
});

// End Node Schema
export const endNodeSchema = baseNodeSchema.extend({
  type: z.literal(NodeType.END_NODE),
  endMessage: z.string().min(1, "End message is required"),
  showSummary: z.boolean().default(false),
});

// Union of all node schemas
export const nodeDataSchema = z.discriminatedUnion("type", [
  startNodeSchema,
  taskNodeSchema,
  approvalNodeSchema,
  automatedStepNodeSchema,
  endNodeSchema,
]);

// Type exports
export type StartNodeSchema = z.infer<typeof startNodeSchema>;
export type TaskNodeSchema = z.infer<typeof taskNodeSchema>;
export type ApprovalNodeSchema = z.infer<typeof approvalNodeSchema>;
export type AutomatedStepNodeSchema = z.infer<typeof automatedStepNodeSchema>;
export type EndNodeSchema = z.infer<typeof endNodeSchema>;
export type NodeDataSchema = z.infer<typeof nodeDataSchema>;

// Helper to get schema by node type
export function getSchemaForNodeType(nodeType: string) {
  switch (nodeType) {
    case "startNode":
      return startNodeSchema;
    case "taskNode":
      return taskNodeSchema;
    case "approvalNode":
      return approvalNodeSchema;
    case "automatedStepNode":
      return automatedStepNodeSchema;
    case "endNode":
      return endNodeSchema;
    default:
      return null;
  }
}
