import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "./workspace/workspaceSlice";
import toastReducer from "./toast/toastSlice";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    toast: toastReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
