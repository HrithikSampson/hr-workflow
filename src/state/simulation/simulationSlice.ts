import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { mockAPI, SimulationResult } from "@/lib/mockApi";
import { NodeType, EdgeStateType } from "@/state/workspace/workspaceSlice";

interface SimulationState {
  result: SimulationResult | null;
  isRunning: boolean;
  error: string | null;
}

const initialState: SimulationState = {
  result: null,
  isRunning: false,
  error: null,
};

export const runSimulation = createAsyncThunk(
  'simulation/run',
  async ({ nodes, edges }: { nodes: NodeType[]; edges: EdgeStateType[] }) => {
    const result = await mockAPI.simulate.execute({
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        animated: edge.animated,
      })),
    });
    return result;
  }
);

const simulationSlice = createSlice({
  name: "simulation",
  initialState,
  reducers: {
    clearSimulation: (state) => {
      state.result = null;
      state.error = null;
      state.isRunning = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runSimulation.pending, (state) => {
        state.isRunning = true;
        state.error = null;
      })
      .addCase(runSimulation.fulfilled, (state, action: PayloadAction<SimulationResult>) => {
        state.isRunning = false;
        state.result = action.payload;
      })
      .addCase(runSimulation.rejected, (state, action) => {
        state.isRunning = false;
        state.error = action.error.message || "Simulation failed";
      });
  },
});

export const { clearSimulation } = simulationSlice.actions;
export default simulationSlice.reducer;
