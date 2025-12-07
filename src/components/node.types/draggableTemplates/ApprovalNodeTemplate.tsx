import React from "react";
import Image from "next/image";
import DraggableContainer from "@/components/DraggableContainer";
import styles from "./NodeTemplate.module.css";

const ApprovalNodeTemplate: React.FC = () => {
  return (
    <DraggableContainer nodeType="approvalNode">
      <div className={`${styles.template} ${styles.approvalTemplate}`}>
        <Image src="/icons/approval.svg" alt="Approval" width={20} height={20} className={styles.icon} />
        <span className={styles.label}>Approval Node</span>
      </div>
    </DraggableContainer>
  );
};

export default ApprovalNodeTemplate;
