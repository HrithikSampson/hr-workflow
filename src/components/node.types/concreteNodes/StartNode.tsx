import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Image from "next/image";
import styles from "./Node.module.css";
import { StartNodeData } from "@/types/nodeData";

const StartNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as Partial<StartNodeData>;

  return (
    <div className={`${styles.node} ${styles.startNode} ${selected ? styles.selected : ""}`}>
      <div className={styles.nodeHeader}>
        <Image src="/icons/start.svg" alt="Start" width={18} height={18} className={styles.nodeIcon} />
        <span className={styles.nodeTitle}>Start</span>
      </div>
      <div className={styles.nodeContent}>
        <p className={styles.nodeContentTitle}>{nodeData.title || "Workflow entry point"}</p>
        {nodeData.metadata && Object.keys(nodeData.metadata).length > 0 && (
          <div className={styles.metadataPreview}>
            {Object.entries(nodeData.metadata).slice(0, 2).map(([key, value]) => (
              <span key={key} className={styles.metadataItem}>
                {key}: {value}
              </span>
            ))}
            {Object.keys(nodeData.metadata).length > 2 && (
              <span className={styles.metadataMore}>
                +{Object.keys(nodeData.metadata).length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
};

export default StartNode;
