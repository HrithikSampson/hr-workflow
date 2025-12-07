import React from "react";
import Image from "next/image";
import DraggableContainer from "@/components/DraggableContainer";
import styles from "./NodeTemplate.module.css";

const TaskNodeTemplate: React.FC = () => {
  return (
    <DraggableContainer nodeType="taskNode">
      <div className={`${styles.template} ${styles.taskTemplate}`}>
        <Image src="/icons/task.svg" alt="Task" width={20} height={20} className={styles.icon} />
        <span className={styles.label}>Task Node</span>
      </div>
    </DraggableContainer>
  );
};

export default TaskNodeTemplate;
