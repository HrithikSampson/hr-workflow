import React from "react";
import Image from "next/image";
import DraggableContainer from "@/components/DraggableContainer";
import styles from "./NodeTemplate.module.css";

const StartNodeTemplate: React.FC = () => {
  return (
    <DraggableContainer nodeType="startNode">
      <div className={`${styles.template} ${styles.startTemplate}`}>
        <Image src="/icons/start.svg" alt="Start" width={20} height={20} className={styles.icon} />
        <span className={styles.label}>Start Node</span>
      </div>
    </DraggableContainer>
  );
};

export default StartNodeTemplate;
