import React, { useState } from "react";
import FormPortal from "./FormPortal";
import styles from "./NodeForm.module.css";
import { TaskNodeData } from "@/types/nodeData";

interface TaskNodeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<TaskNodeData>) => void;
  initialData?: Partial<TaskNodeData>;
}

const TaskNodeForm: React.FC<TaskNodeFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [assignee, setAssignee] = useState(initialData.assignee || "");
  const [dueDate, setDueDate] = useState(initialData.dueDate || "");
  const [customFields, setCustomFields] = useState<Record<string, string>>(
    initialData.customFields || {}
  );

  const handleAddCustomField = () => {
    const key = `field_${Object.keys(customFields).length + 1}`;
    setCustomFields({ ...customFields, [key]: "" });
  };

  const handleRemoveCustomField = (key: string) => {
    const newFields = { ...customFields };
    delete newFields[key];
    setCustomFields(newFields);
  };

  const handleCustomFieldChange = (oldKey: string, newKey: string, value: string) => {
    const newFields = { ...customFields };
    if (oldKey !== newKey) {
      delete newFields[oldKey];
    }
    newFields[newKey] = value;
    setCustomFields(newFields);
  };

  const handleSave = () => {
    onSave({ title, description, assignee, dueDate, customFields });
    onClose();
  };

  return (
    <FormPortal isOpen={isOpen} onClose={onClose} title="Edit Task Node">
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Assignee</label>
        <input
          type="text"
          className={styles.input}
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Enter assignee name or email"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Due Date</label>
        <input
          type="date"
          className={styles.input}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Custom Fields (Optional)</label>
        <div className={styles.keyValuePairs}>
          {Object.entries(customFields).map(([key, value]) => (
            <div key={key} className={styles.keyValueRow}>
              <input
                type="text"
                className={styles.input}
                value={key}
                onChange={(e) => handleCustomFieldChange(key, e.target.value, value)}
                placeholder="Field name"
              />
              <input
                type="text"
                className={styles.input}
                value={value}
                onChange={(e) => handleCustomFieldChange(key, key, e.target.value)}
                placeholder="Field value"
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveCustomField(key)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={styles.addButton} onClick={handleAddCustomField}>
          + Add Custom Field
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

export default TaskNodeForm;
