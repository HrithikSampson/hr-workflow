"use client";
import styles from "@/components/DraggableContainer.module.css";

interface DraggableContainerProps {
  children: React.ReactNode;
  nodeType?: string;
}

const DraggableContainer = ({ children, nodeType }: DraggableContainerProps) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (nodeType) {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.draggableContainer}
        draggable={!!nodeType}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
      >
        {children}
      </div>
    </div>
  );
};

export default DraggableContainer;