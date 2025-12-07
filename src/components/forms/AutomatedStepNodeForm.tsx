import React, { useState, useEffect } from "react";
import FormPortal from "./FormPortal";
import styles from "./NodeForm.module.css";
import { AutomatedStepNodeData } from "@/types/nodeData";

interface AutomatedStepNodeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<AutomatedStepNodeData>) => void;
  initialData?: Partial<AutomatedStepNodeData>;
}

const MOCK_ACTIONS = [
  {
    id: "send_email",
    name: "Send Email",
    parameters: ["recipient", "subject", "body"],
  },
  {
    id: "generate_pdf",
    name: "Generate PDF Document",
    parameters: ["template", "fileName"],
  },
  {
    id: "create_ticket",
    name: "Create Support Ticket",
    parameters: ["priority", "category", "description"],
  },
  {
    id: "update_database",
    name: "Update Database Record",
    parameters: ["table", "recordId", "fields"],
  },
  {
    id: "send_notification",
    name: "Send Notification",
    parameters: ["channel", "message", "recipients"],
  },
];

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

  const selectedAction = MOCK_ACTIONS.find((a) => a.id === action);

  useEffect(() => {
    if (selectedAction) {
      const newParams: Record<string, any> = {};
      selectedAction.parameters.forEach((param) => {
        newParams[param] = actionParameters[param] || "";
      });
      setActionParameters(newParams);
    }
  }, [action]);

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
        >
          <option value="">Select an action</option>
          {MOCK_ACTIONS.map((act) => (
            <option key={act.id} value={act.id}>
              {act.name}
            </option>
          ))}
        </select>
        <p className={styles.hint}>
          Choose the automated action to perform at this step
        </p>
      </div>

      {selectedAction && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Action Parameters</label>
          {selectedAction.parameters.map((param) => (
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
