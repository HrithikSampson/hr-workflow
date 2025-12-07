"use client";
import { useCallback } from "react";
import styles from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { workflowSave } from "@/state/workspace/workspaceSlice";
import { showToast } from "@/state/toast/toastSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const state = useSelector(
    (state: RootState) => state.workflow.currentWorkspace,
  );

  const save = useCallback(() => {
    const set = new Set();
    state.edges.map((egs) => {
      set.add(egs.target);
    });
    if (set.size == state.nodes.length - 1 && state.nodes.length > 1) {
      dispatch(workflowSave());
      dispatch(showToast({ message: "Workflow saved successfully!", type: "success" }));
    } else {
      dispatch(showToast({
        message: "Cannot save flow. Ensure all nodes are connected.",
        type: "error"
      }));
    }
  }, [state, dispatch]);

  return (
    <div className={styles.header}>
      <button className={styles.savebutton} onClick={save}>
        Save Changes
      </button>
    </div>
  );
};

export default Navbar;
