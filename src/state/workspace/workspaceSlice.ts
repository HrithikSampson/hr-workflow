import Workspace from "@/components/Workspace";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EdgeStateType {
  animated: boolean;
  type: string;
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
}

interface NodeType {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    content: string;
    text: string;
  };
  files?: File[];
}

interface WorkSpaceType {
  nodes: NodeType[];
  edges: EdgeStateType[];
}
interface WorkflowCollection {
  workflow: WorkSpaceType[];
  currentWorkspace: WorkSpaceType;
  selectedNodeId: string | null;
}
const initialState: WorkflowCollection = {
  workflow: [],
  currentWorkspace: { nodes: [], edges: [] },
  selectedNodeId: null,
};
const initialWorkflow: WorkSpaceType = {
  nodes: [],
  edges: [],
};

const workflowSlice = createSlice({
  name: "workflows",
  initialState,
  reducers: {
    workflowSave: (state) => {
      state.workflow.push(state.currentWorkspace);
      state.currentWorkspace = initialWorkflow;
      state.selectedNodeId = null;
    },
    updateCurrentWorkspace: (
      state,
      action: PayloadAction<{ nodeId?: string; content?: string; data?: any }>,
    ) => {
      const nodeId = action.payload.nodeId || state.selectedNodeId;
      const nodeWithselectedId = state.currentWorkspace.nodes.filter(
        (node) => node.id === nodeId,
      );
      if (nodeWithselectedId.length == 1) {
        if (action.payload.content !== undefined) {
          nodeWithselectedId[0].data.text = action.payload.content;
        }
        if (action.payload.data !== undefined) {
          nodeWithselectedId[0].data = {
            ...nodeWithselectedId[0].data,
            ...action.payload.data,
          };
        }
      } else {
        throw new Error("node which is updated has no ID or more than one ID");
      }
    },
    addNodes: (state, action: PayloadAction<NodeType>) => {
      state.currentWorkspace.nodes.push(action.payload);
    },
    addEdges: (state, action: PayloadAction<EdgeStateType>) => {
      state.currentWorkspace.edges.push(action.payload);
    },
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    changeNodesPosition: (state, action: PayloadAction<NodeType[]>) => {
      state.currentWorkspace.nodes = action.payload;
    },
  },
});
export const {
  workflowSave,
  updateCurrentWorkspace,
  addNodes,
  addEdges,
  selectNode,
  changeNodesPosition,
} = workflowSlice.actions;
export default workflowSlice.reducer;
export type { EdgeStateType, NodeType };
