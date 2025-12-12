import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "./workspace/workspaceSlice";
import toastReducer from "./toast/toastSlice";
import simulationReducer from "./simulation/simulationSlice";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    toast: toastReducer,
    simulation: simulationReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
