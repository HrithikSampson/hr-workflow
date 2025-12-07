"use client";
import React from "react";
import objectOfNodes from "./node.types/objectOfNodes";
import { NodeType } from "./node.types/nodeTypes";
import styles from "./NodeTemplatesSidebar.module.css";

const NodeTemplatesSidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <h3 className={styles.title}>Workflow Nodes</h3>
      <div className={styles.templatesContainer}>
        {Object.entries(objectOfNodes).map(([nodeTypeKey, [_, TemplateComponent]]) => {
          return <TemplateComponent key={nodeTypeKey} />;
        })}
      </div>
    </div>
  );
};

export default NodeTemplatesSidebar;
