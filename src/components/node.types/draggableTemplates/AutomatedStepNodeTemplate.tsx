import React from "react";
import Image from "next/image";
import DraggableContainer from "@/components/DraggableContainer";
import styles from "./NodeTemplate.module.css";

const AutomatedStepNodeTemplate: React.FC = () => {
  return (
    <DraggableContainer nodeType="automatedStepNode">
      <div className={`${styles.template} ${styles.automatedTemplate}`}>
        <Image src="/icons/automated.svg" alt="Automated" width={20} height={20} className={styles.icon} />
        <span className={styles.label}>Automated Step</span>
      </div>
    </DraggableContainer>
  );
};

export default AutomatedStepNodeTemplate;
