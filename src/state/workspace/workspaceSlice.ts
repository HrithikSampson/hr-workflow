import Workspace from "@/components/Workspace";
import { NodeData } from "@/types/nodeData";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { mockAPI } from "@/lib/mockApi";

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
  data: NodeData;
  files?: File[];
}

interface WorkSpaceType {
  nodes: NodeType[];
  edges: EdgeStateType[];
}
interface WorkflowCollection {
  workflow: WorkSpaceType[];
  currentWorkspace: WorkSpaceType;
  currentWorkflowId: string | null;
  selectedNodeId: string | null;
}
const initialState: WorkflowCollection = {
  workflow: [],
  currentWorkspace: { nodes: [], edges: [] },
  currentWorkflowId: null,
  selectedNodeId: null,
};
const initialWorkflow: WorkSpaceType = {
  nodes: [],
  edges: [],
};

export const workflowSave = createAsyncThunk(
  'workflows/save',
  async (_, { getState }) => {
    const state = getState() as { workflow: WorkflowCollection };
    if (state.workflow.currentWorkflowId) {
      await mockAPI.workflows.save(
        state.workflow.currentWorkflowId,
        state.workflow.currentWorkspace.nodes,
        state.workflow.currentWorkspace.edges
      );
    }
  }
);

const workflowSlice = createSlice({
  name: "workflows",
  initialState,
  reducers: {
    setCurrentWorkflowId: (state, action: PayloadAction<string | null>) => {
      state.currentWorkflowId = action.payload;
    },
    loadWorkflow: (state, action: PayloadAction<WorkSpaceType>) => {
      state.currentWorkspace = action.payload;
    },
    resetWorkspace: (state) => {
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
          nodeWithselectedId[0].data.content = action.payload.content;
        }
        if (action.payload.data !== undefined) {
          nodeWithselectedId[0].data = {
            ...nodeWithselectedId[0].data,
            ...action.payload.data,
          } as NodeData;
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
    removeNodes: (state, action: PayloadAction<string[]>) => {
      state.currentWorkspace.nodes = state.currentWorkspace.nodes.filter(
        (node) => !action.payload.includes(node.id)
      );
      state.currentWorkspace.edges = state.currentWorkspace.edges.filter(
        (edge) => !action.payload.includes(edge.source) && !action.payload.includes(edge.target)
      );
    },
    removeEdges: (state, action: PayloadAction<string[]>) => {
      state.currentWorkspace.edges = state.currentWorkspace.edges.filter(
        (edge) => !action.payload.includes(edge.id)
      );
    },
  },
});
export const {
  setCurrentWorkflowId,
  loadWorkflow,
  resetWorkspace,
  updateCurrentWorkspace,
  addNodes,
  addEdges,
  selectNode,
  changeNodesPosition,
  removeNodes,
  removeEdges,
} = workflowSlice.actions;
export default workflowSlice.reducer;
export type { EdgeStateType, NodeType };
