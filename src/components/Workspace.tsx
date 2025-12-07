"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  Background,
  Controls,
  Viewport,
  EdgeTypes,
  NodeChange,
  NodePositionChange,
  MiniMap,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import styles from "./Workspace.module.css";
import CustomEdge from "./CustomEdge";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import {
  addEdges,
  addNodes,
  changeNodesPosition,
  NodeType,
  selectNode,
  setCurrentWorkflowId,
  loadWorkflow,
  removeNodes,
  removeEdges,
} from "@/state/workspace/workspaceSlice";
import { EdgeStateType } from "@/state/workspace/workspaceSlice";
import objectOfNodes from "./node.types/objectOfNodes";
import NodeEditManager from "./NodeEditManager";
import { mockAPI } from "@/lib/mockApi";
import { NodeDataValidator } from "@/types/nodeData";

const Workspace = () => {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("id");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [zoom, setZoom] = useState(1);
  const [xcor, setX] = useState(0);
  const [ycor, setY] = useState(0);
  const state = useSelector(
    (state: RootState) => state.workflow.currentWorkspace,
  );
  const dispatch = useDispatch();

  const onEdgesChangeHandler = useCallback(
    (changes: any[]) => {
      const removedEdgeIds = changes
        .filter((change) => change.type === "remove")
        .map((change) => change.id);

      if (removedEdgeIds.length > 0) {
        dispatch(removeEdges(removedEdgeIds));
      }

      onEdgesChange(changes);
    },
    [onEdgesChange, dispatch],
  );
  const nodeTypes = useMemo(
    () => ({
      startNode: objectOfNodes.startNode[0],
      endNode: objectOfNodes.endNode[0],
      taskNode: objectOfNodes.taskNode[0],
      approvalNode: objectOfNodes.approvalNode[0],
      automatedStepNode: objectOfNodes.automatedStepNode[0],
    }),
    [],
  );

  useEffect(() => {
    const loadWorkflowData = async () => {
      if (workflowId) {
        const workflow = await mockAPI.workflows.getById(workflowId);
        if (workflow) {
          dispatch(setCurrentWorkflowId(workflowId));
          dispatch(loadWorkflow({ nodes: workflow.nodes, edges: workflow.edges }));
        }
      } else {
        const newWorkflow = await mockAPI.workflows.create("Untitled Workflow");
        dispatch(setCurrentWorkflowId(newWorkflow.id));
        dispatch(loadWorkflow({ nodes: [], edges: [] }));
        window.history.replaceState(null, "", `/workspace?id=${newWorkflow.id}`);
      }
    };
    loadWorkflowData();
  }, [workflowId, dispatch]);

  useEffect(() => {
    setNodes(state.nodes);
    setEdges(state.edges);
  }, [state.nodes, state.edges, setNodes, setEdges]);

  const onPaneClick = useCallback(() => {
    dispatch(selectNode(null));
  }, [dispatch]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    dispatch(selectNode(node.id));
  }, [dispatch]);
  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    [],
  );
  const onMove = useCallback(
    (_event: MouseEvent | TouchEvent, data: Viewport) => {
      setZoom(data.zoom);
      setX(data.x);
      setY(data.y);
    },
    [],
  );
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/reactflow");

      if (!nodeType) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: (event.clientX - reactFlowBounds.left - xcor) / zoom,
        y: (event.clientY - reactFlowBounds.top - ycor) / zoom,
      };

      const nodeId = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const dataType = NodeDataValidator.getNodeDataType(nodeType);

      const newNode = {
        id: nodeId,
        type: nodeType,
        position,
        data: {
          id: nodeId,
          content: "",
          type: dataType,
        } as any,
      };
      dispatch(addNodes(newNode));
    },
    [xcor, ycor, zoom, dispatch],
  );

  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      const removedNodeIds = changes
        .filter((change): change is { type: "remove"; id: string } => change.type === "remove")
        .map((change) => change.id);

      if (removedNodeIds.length > 0) {
        dispatch(removeNodes(removedNodeIds));
      }

      let nodesChanged = false;
      const updatedNodes = nodes.map((node) => {
        const change = changes.find(
          (c) => c.type === "position" && c.id === node.id,
        ) as NodePositionChange | undefined;
        if (change && change.position) {
          nodesChanged = true;
          return {
            ...node,
            position: { x: change.position.x, y: change.position.y },
          };
        }
        return node;
      });
      if (nodesChanged) {
        const filteredUpdatedNodes: NodeType[] = updatedNodes.filter(
          (node): node is NodeType => node !== undefined,
        );
        dispatch(changeNodesPosition(filteredUpdatedNodes));
      }
      onNodesChange(changes);
    },
    [nodes, onNodesChange, dispatch],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceEdges = edges.filter((el) => el.source === connection.source);

      if (sourceEdges.length < 1 && connection.source && connection.target) {
        const tempConnection = {
          ...connection,
          source: connection.source as string,
          target: connection.target as string,
        };
        const edge: EdgeStateType = {
          ...tempConnection,
          animated: false,
          type: "custom",
          id: `edge-${edges.length + 1}`,
        };
        dispatch(addEdges(edge));
      }
    },
    [edges, dispatch],
  );

  const getNodeColor = (node: Node) => {
    switch (node.type) {
      case "startNode":
        return "#22c55e";
      case "endNode":
        return "#ef4444";
      case "taskNode":
        return "#3b82f6";
      case "approvalNode":
        return "#f59e0b";
      case "automatedStepNode":
        return "#8b5cf6";
      default:
        return "#94a3b8";
    }
  };

  return (
    <div className={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
        onMove={onMove}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
      >
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={getNodeColor}
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
          zoomable
          pannable
        />
        <Background />
        <Controls />
      </ReactFlow>
      <NodeEditManager />
    </div>
  );
};

export default Workspace;
