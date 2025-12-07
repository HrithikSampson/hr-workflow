import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import Image from "next/image";
import styles from "./Node.module.css";
import { TaskNodeData } from "@/types/nodeData";

const TaskNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as Partial<TaskNodeData>;

  return (
    <div className={`${styles.node} ${styles.taskNode} ${selected ? styles.selected : ""}`}>
      <div className={styles.nodeHeader}>
        <Image src="/icons/task.svg" alt="Task" width={18} height={18} className={styles.nodeIcon} />
        <span className={styles.nodeTitle}>Task</span>
      </div>
      <div className={styles.nodeContent}>
        <p className={styles.nodeContentTitle}>{nodeData.title || "Human task"}</p>
        {nodeData.description && (
          <p className={styles.nodeDescription}>{nodeData.description}</p>
        )}
        {(nodeData.assignee || nodeData.dueDate) && (
          <div className={styles.nodeDetails}>
            {nodeData.assignee && (
              <span className={styles.detail}>
                <Image src="/icons/user.svg" alt="User" width={12} height={12} /> {nodeData.assignee}
              </span>
            )}
            {nodeData.dueDate && (
              <span className={styles.detail}>
                <Image src="/icons/calendar.svg" alt="Calendar" width={12} height={12} /> {nodeData.dueDate}
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

export default TaskNode;
