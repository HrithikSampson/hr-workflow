import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Image from "next/image";
import styles from "./Node.module.css";
import { AutomatedStepNodeData } from "@/types/nodeData";

const AutomatedStepNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as Partial<AutomatedStepNodeData>;

  return (
    <div className={`${styles.node} ${styles.automatedNode} ${selected ? styles.selected : ""}`}>
      <div className={styles.nodeHeader}>
        <Image src="/icons/automated.svg" alt="Automated" width={18} height={18} className={styles.nodeIcon} />
        <span className={styles.nodeTitle}>Automated Step</span>
      </div>
      <div className={styles.nodeContent}>
        <p className={styles.nodeContentTitle}>{nodeData.title || "Automated action"}</p>
        {nodeData.action && (
          <div className={styles.nodeDetails}>
            <span className={styles.detail}>
              <Image src="/icons/robot.svg" alt="Robot" width={12} height={12} /> {nodeData.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
};

export default AutomatedStepNode;
