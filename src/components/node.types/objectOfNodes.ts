import { NodeType } from "./nodeTypes";
import StartNode from "./concreteNodes/StartNode";
import EndNode from "./concreteNodes/EndNode";
import TaskNode from "./concreteNodes/TaskNode";
import ApprovalNode from "./concreteNodes/ApprovalNode";
import AutomatedStepNode from "./concreteNodes/AutomatedStepNode";
import StartNodeTemplate from "./draggableTemplates/StartNodeTemplate";
import EndNodeTemplate from "./draggableTemplates/EndNodeTemplate";
import TaskNodeTemplate from "./draggableTemplates/TaskNodeTemplate";
import ApprovalNodeTemplate from "./draggableTemplates/ApprovalNodeTemplate";
import AutomatedStepNodeTemplate from "./draggableTemplates/AutomatedStepNodeTemplate";

export type ListOfNodesType = Record<NodeType, [React.ComponentType<any>, React.ComponentType]>;

const objectOfNodes: ListOfNodesType = {
  [NodeType.START_NODE]: [StartNode, StartNodeTemplate],
  [NodeType.END_NODE]: [EndNode, EndNodeTemplate],
  [NodeType.TASK_NODE]: [TaskNode, TaskNodeTemplate],
  [NodeType.APPROVAL_NODE]: [ApprovalNode, ApprovalNodeTemplate],
  [NodeType.AUTOMATED_STEP_NODE]: [AutomatedStepNode, AutomatedStepNodeTemplate],
};

export default objectOfNodes;
