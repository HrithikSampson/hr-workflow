import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Image from "next/image";
import styles from "./Node.module.css";
import { ApprovalNodeData } from "@/types/nodeData";

const ApprovalNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as Partial<ApprovalNodeData>;

  return (
    <div className={`${styles.node} ${styles.approvalNode} ${selected ? styles.selected : ""}`}>
      <div className={styles.nodeHeader}>
        <Image src="/icons/approval.svg" alt="Approval" width={18} height={18} className={styles.nodeIcon} />
        <span className={styles.nodeTitle}>Approval</span>
      </div>
      <div className={styles.nodeContent}>
        <p className={styles.nodeContentTitle}>{nodeData.title || "Approval step"}</p>
        {nodeData.approverRole && (
          <div className={styles.nodeDetails}>
            <span className={styles.detail}>
              <Image src="/icons/briefcase.svg" alt="Role" width={12} height={12} /> {nodeData.approverRole}
            </span>
            {nodeData.autoApproveThreshold && nodeData.autoApproveThreshold > 0 && (
              <span className={styles.detail}>
                <Image src="/icons/bolt.svg" alt="Auto" width={12} height={12} /> Auto: &lt;${nodeData.autoApproveThreshold}
              </span>
            )}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
};

export default ApprovalNode;
