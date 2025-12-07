"use client";
import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/state/store";
import { workflowSave, loadWorkflow } from "@/state/workspace/workspaceSlice";
import { showToast } from "@/state/toast/toastSlice";
import { WorkflowValidator } from "@/lib/workflowValidation";
import { mockAPI } from "@/lib/mockApi";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const state = useSelector(
    (state: RootState) => state.workflow.currentWorkspace,
  );
  const currentWorkflowId = useSelector(
    (state: RootState) => state.workflow.currentWorkflowId,
  );

  const save = useCallback(async () => {
    const errors = WorkflowValidator.validateWorkflow(
      state.nodes,
      state.edges
    );

    if (errors.length > 0) {
      errors.forEach((error) => {
        dispatch(showToast({
          message: error.field
            ? `${error.field}: ${error.message}${error.nodeId ? ` (Node: ${error.nodeId})` : ''}`
            : error.message,
          type: "error"
        }));
      });
      return;
    }

    await dispatch(workflowSave());
    dispatch(showToast({ message: "Workflow saved successfully!", type: "success" }));
  }, [state, dispatch]);

  const handleBack = useCallback(() => {
    router.push("/workflows");
  }, [router]);

  const handleExport = useCallback(async () => {
    if (!currentWorkflowId) {
      dispatch(showToast({ message: "No workflow to export", type: "error" }));
      return;
    }

    try {
      const jsonData = await mockAPI.export.toJSON(currentWorkflowId);
      const workflow = await mockAPI.workflows.getById(currentWorkflowId);
      const name = workflow?.name || "workflow";
      mockAPI.export.downloadJSON(currentWorkflowId, name, jsonData);
      dispatch(showToast({ message: "Workflow exported successfully!", type: "success" }));
    } catch (error) {
      dispatch(showToast({
        message: error instanceof Error ? error.message : "Export failed",
        type: "error"
      }));
    }
  }, [currentWorkflowId, dispatch]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedWorkflow = await mockAPI.import.fromJSON(text);
      dispatch(loadWorkflow({ nodes: importedWorkflow.nodes, edges: importedWorkflow.edges }));
      dispatch(showToast({ message: `Imported: ${importedWorkflow.name}`, type: "success" }));
      router.push(`/workspace?id=${importedWorkflow.id}`);
    } catch (error) {
      dispatch(showToast({
        message: error instanceof Error ? error.message : "Import failed",
        type: "error"
      }));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [dispatch, router]);

  return (
    <div className={styles.header}>
      <button className={styles.backButton} onClick={handleBack}>
        ← Back
      </button>
      <div className={styles.rightButtons}>
        <button className={styles.exportButton} onClick={handleExport}>
          Export JSON
        </button>
        <button className={styles.importButton} onClick={handleImport}>
          Import JSON
        </button>
        <button className={styles.savebutton} onClick={save}>
          Save Changes
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Navbar;
