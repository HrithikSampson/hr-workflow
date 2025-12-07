import React, { useState } from "react";
import FormPortal from "./FormPortal";
import styles from "./NodeForm.module.css";
import { ApprovalNodeData } from "@/types/nodeData";

interface ApprovalNodeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ApprovalNodeData>) => void;
  initialData?: Partial<ApprovalNodeData>;
}

const ApprovalNodeForm: React.FC<ApprovalNodeFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [approverRole, setApproverRole] = useState(initialData.approverRole || "");
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(
    initialData.autoApproveThreshold || 0
  );

  const handleSave = () => {
    onSave({ title, approverRole, autoApproveThreshold });
    onClose();
  };

  return (
    <FormPortal isOpen={isOpen} onClose={onClose} title="Edit Approval Node">
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter approval title"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Approver Role <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={approverRole}
          onChange={(e) => setApproverRole(e.target.value)}
        >
          <option value="">Select approver role</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
          <option value="C-Level">C-Level</option>
        </select>
        <p className={styles.hint}>
          Choose the role required to approve this step
        </p>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Auto-Approve Threshold</label>
        <input
          type="number"
          className={styles.input}
          value={autoApproveThreshold}
          onChange={(e) => setAutoApproveThreshold(Number(e.target.value))}
          min="0"
          placeholder="0"
        />
        <p className={styles.hint}>
          Auto-approve if value is below this threshold (0 = no auto-approval)
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

export default ApprovalNodeForm;
