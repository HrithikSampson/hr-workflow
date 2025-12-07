import React, { useState } from "react";
import FormPortal from "./FormPortal";
import styles from "./NodeForm.module.css";
import { StartNodeData } from "@/types/nodeData";

interface StartNodeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<StartNodeData>) => void;
  initialData?: Partial<StartNodeData>;
}

const StartNodeForm: React.FC<StartNodeFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [metadata, setMetadata] = useState<Record<string, string>>(
    initialData.metadata || {}
  );

  const handleAddMetadata = () => {
    const key = `field_${Object.keys(metadata).length + 1}`;
    setMetadata({ ...metadata, [key]: "" });
  };

  const handleRemoveMetadata = (key: string) => {
    const newMetadata = { ...metadata };
    delete newMetadata[key];
    setMetadata(newMetadata);
  };

  const handleMetadataChange = (oldKey: string, newKey: string, value: string) => {
    const newMetadata = { ...metadata };
    if (oldKey !== newKey) {
      delete newMetadata[oldKey];
    }
    newMetadata[newKey] = value;
    setMetadata(newMetadata);
  };

  const handleSave = () => {
    onSave({ title, metadata });
    onClose();
  };

  return (
    <FormPortal isOpen={isOpen} onClose={onClose} title="Edit Start Node">
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter start node title"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Metadata (Optional)</label>
        <div className={styles.keyValuePairs}>
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className={styles.keyValueRow}>
              <input
                type="text"
                className={styles.input}
                value={key}
                onChange={(e) => handleMetadataChange(key, e.target.value, value)}
                placeholder="Key"
              />
              <input
                type="text"
                className={styles.input}
                value={value}
                onChange={(e) => handleMetadataChange(key, key, e.target.value)}
                placeholder="Value"
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveMetadata(key)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={styles.addButton} onClick={handleAddMetadata}>
          + Add Metadata
        </button>
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

export default StartNodeForm;
