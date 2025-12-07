"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@/state/workspace/workspaceSlice";
import { EdgeStateType } from "@/state/workspace/workspaceSlice";
import objectOfNodes from "./node.types/objectOfNodes";
import NodeEditManager from "./NodeEditManager";

const Workspace = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [zoom, setZoom] = useState(1);
  const [xcor, setX] = useState(0);
  const [ycor, setY] = useState(0);
  const state = useSelector(
    (state: RootState) => state.workflow.currentWorkspace,
  );
  const dispatch = useDispatch();
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
    setNodes(state.nodes);
    setEdges(state.edges);
  }, [state.nodes, state.edges]);

  const onPaneClick = useCallback(() => {
    dispatch(selectNode(null));
  }, []);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    dispatch(selectNode(node.id));
  }, []);
  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    [],
  );
  const onMove = useCallback(
    (event: MouseEvent | TouchEvent, data: Viewport) => {
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

      const newNode = {
        id: `${nodes.length + 1}`,
        type: nodeType,
        position,
        data: { content: "", text: "", id: `${nodes.length + 1}` },
      };
      dispatch(addNodes(newNode));
    },
    [nodes, xcor, ycor, zoom],
  );

  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
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
    [nodes, onNodesChange],
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
    [edges, setEdges],
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
        onEdgesChange={onEdgesChange}
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
