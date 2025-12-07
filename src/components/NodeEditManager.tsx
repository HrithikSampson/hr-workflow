"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { updateCurrentWorkspace, selectNode } from "@/state/workspace/workspaceSlice";
import {
  StartNodeForm,
  EndNodeForm,
  TaskNodeForm,
  ApprovalNodeForm,
  AutomatedStepNodeForm,
} from "./forms";
import { NodeType } from "./node.types/nodeTypes";

const NodeEditManager: React.FC = () => {
  const dispatch = useDispatch();
  const selectedNodeId = useSelector(
    (state: RootState) => state.workflow.selectedNodeId
  );
  const nodes = useSelector(
    (state: RootState) => state.workflow.currentWorkspace.nodes
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        setSelectedNode(node);
        setIsFormOpen(true);
      }
    } else {
      setIsFormOpen(false);
      setSelectedNode(null);
    }
  }, [selectedNodeId, nodes]);

  const handleClose = () => {
    setIsFormOpen(false);
    dispatch(selectNode(null));
  };

  const handleSave = (data: any) => {
    if (selectedNode) {
      const updatedData = {
        ...selectedNode.data,
        ...data,
      };

      dispatch(
        updateCurrentWorkspace({
          nodeId: selectedNode.id,
          data: updatedData,
        })
      );
    }
  };

  if (!selectedNode) return null;

  switch (selectedNode.type) {
    case "startNode":
    case NodeType.START_NODE:
      return (
        <StartNodeForm
          isOpen={isFormOpen}
          onClose={handleClose}
          onSave={handleSave}
          initialData={selectedNode.data}
        />
      );

    case "endNode":
    case NodeType.END_NODE:
      return (
        <EndNodeForm
          isOpen={isFormOpen}
          onClose={handleClose}
          onSave={handleSave}
          initialData={selectedNode.data}
        />
      );

    case "taskNode":
    case NodeType.TASK_NODE:
      return (
        <TaskNodeForm
          isOpen={isFormOpen}
          onClose={handleClose}
          onSave={handleSave}
          initialData={selectedNode.data}
        />
      );

    case "approvalNode":
    case NodeType.APPROVAL_NODE:
      return (
        <ApprovalNodeForm
          isOpen={isFormOpen}
          onClose={handleClose}
          onSave={handleSave}
          initialData={selectedNode.data}
        />
      );

    case "automatedStepNode":
    case NodeType.AUTOMATED_STEP_NODE:
      return (
        <AutomatedStepNodeForm
          isOpen={isFormOpen}
          onClose={handleClose}
          onSave={handleSave}
          initialData={selectedNode.data}
        />
      );

    default:
      return null;
  }
};

export default NodeEditManager;
