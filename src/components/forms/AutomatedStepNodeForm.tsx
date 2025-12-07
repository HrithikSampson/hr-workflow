import React, { useState, useEffect } from "react";
import FormPortal from "./FormPortal";
import styles from "./NodeForm.module.css";
import { AutomatedStepNodeData } from "@/types/nodeData";
import { mockAPI, AutomationAction } from "@/lib/mockApi";

interface AutomatedStepNodeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<AutomatedStepNodeData>) => void;
  initialData?: Partial<AutomatedStepNodeData>;
}

const AutomatedStepNodeForm: React.FC<AutomatedStepNodeFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [action, setAction] = useState(initialData.action || "");
  const [actionParameters, setActionParameters] = useState<Record<string, any>>(
    initialData.actionParameters || {}
  );
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch automation actions from API on mount
  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        const fetchedActions = await mockAPI.automations.getAll();
        setActions(fetchedActions);
      } catch (error) {
        console.error("Failed to fetch automation actions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  const selectedAction = actions.find((a) => a.id === action);

  useEffect(() => {
    if (selectedAction) {
      const newParams: Record<string, any> = {};
      selectedAction.params.forEach((param: string) => {
        newParams[param] = actionParameters[param] || "";
      });
      setActionParameters(newParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, selectedAction]);

  const handleParameterChange = (param: string, value: any) => {
    setActionParameters({ ...actionParameters, [param]: value });
  };

  const handleSave = () => {
    onSave({ title, action, actionParameters });
    onClose();
  };

  return (
    <FormPortal isOpen={isOpen} onClose={onClose} title="Edit Automated Step Node">
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter step title"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Action <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={action}
          onChange={(e) => setAction(e.target.value)}
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading actions..." : "Select an action"}
          </option>
          {actions.map((act) => (
            <option key={act.id} value={act.id}>
              {act.label}
            </option>
          ))}
        </select>
        {selectedAction?.description && (
          <p className={styles.hint}>{selectedAction.description}</p>
        )}
      </div>

      {selectedAction && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Action Parameters</label>
          {selectedAction.params.map((param: string) => (
            <div key={param} style={{ marginBottom: "12px" }}>
              <label className={styles.label} style={{ fontSize: "13px" }}>
                {param.charAt(0).toUpperCase() + param.slice(1).replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                className={styles.input}
                value={actionParameters[param] || ""}
                onChange={(e) => handleParameterChange(param, e.target.value)}
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button type="button" className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
      </div>
    </FormPortal>
  );
};

export default AutomatedStepNodeForm;
