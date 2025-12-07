import React from "react";
import Image from "next/image";
import DraggableContainer from "@/components/DraggableContainer";
import styles from "./NodeTemplate.module.css";

const EndNodeTemplate: React.FC = () => {
  return (
    <DraggableContainer nodeType="endNode">
      <div className={`${styles.template} ${styles.endTemplate}`}>
        <Image src="/icons/end.svg" alt="End" width={20} height={20} className={styles.icon} />
        <span className={styles.label}>End Node</span>
      </div>
    </DraggableContainer>
  );
};

export default EndNodeTemplate;
