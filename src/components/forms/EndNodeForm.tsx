import React, { useState } from "react";
import FormPortal from "./FormPortal";
import styles from "./NodeForm.module.css";
import { EndNodeData } from "@/types/nodeData";

interface EndNodeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<EndNodeData>) => void;
  initialData?: Partial<EndNodeData>;
}

const EndNodeForm: React.FC<EndNodeFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
}) => {
  const [endMessage, setEndMessage] = useState(initialData.endMessage || "");
  const [showSummary, setShowSummary] = useState(initialData.showSummary || false);

  const handleSave = () => {
    onSave({ endMessage, showSummary });
    onClose();
  };

  return (
    <FormPortal isOpen={isOpen} onClose={onClose} title="Edit End Node">
      <div className={styles.formGroup}>
        <label className={styles.label}>
          End Message <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={endMessage}
          onChange={(e) => setEndMessage(e.target.value)}
          placeholder="Enter completion message"
        />
        <p className={styles.hint}>
          This message will be shown when the workflow completes
        </p>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={showSummary}
            onChange={(e) => setShowSummary(e.target.checked)}
          />
          <span>Show workflow summary</span>
        </label>
        <p className={styles.hint}>
          Display a summary of all completed steps when workflow ends
        </p>
      </div>

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

export default EndNodeForm;
