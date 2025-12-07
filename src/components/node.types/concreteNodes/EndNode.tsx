import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Image from "next/image";
import styles from "./Node.module.css";
import { EndNodeData } from "@/types/nodeData";

const EndNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as Partial<EndNodeData>;

  return (
    <div className={`${styles.node} ${styles.endNode} ${selected ? styles.selected : ""}`}>
      <div className={styles.nodeHeader}>
        <Image src="/icons/end.svg" alt="End" width={18} height={18} className={styles.nodeIcon} />
        <span className={styles.nodeTitle}>End</span>
      </div>
      <div className={styles.nodeContent}>
        <p className={styles.nodeContentTitle}>{nodeData.endMessage || "Workflow completion"}</p>
        {nodeData.showSummary && (
          <div className={styles.nodeDetails}>
            <span className={styles.detail}>
              <Image src="/icons/bar-chart.svg" alt="Chart" width={12} height={12} /> Show summary
            </span>
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} className={styles.handle} />
    </div>
  );
};

export default EndNode;
