import {
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
    type OnNodesChange,
    type OnEdgesChange,
    type XYPosition,
    applyNodeChanges,
    applyEdgeChanges,
  } from '@xyflow/react';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

export type FormFlowState = {
    nodes: Node[];
    edges: Edge[];
    currentId: string;
    selectedNode: any | null;
    selectedEdge: any | null;
    isFlowDirty: boolean;
    isSaving: boolean;
    isLoaded: boolean;
    setLoaded: () => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    addNode: () => Node;
    addEdge: (source: string, target: string, sourceHandle: string) => void;
    removeEdge: (edgeId: string) => void;
    removeNode: (nodeId: string) => void;
    setSelectedNode: (node: Node | null) => void;
    setSelectedEdge: (edge: any | null) => void;
    updateNode: (updatedNode: Node) => void;
    setFlow: (nodes: Node[], edges: Edge[]) => void;
};
   
const useStore = create<FormFlowState>()(devtools((set, get) => ({
    currentId: "",
    nodes: [],
    edges: [],
    selectedNode: null,
    selectedEdge: null,
    isFlowDirty: false,
    isSaving: false,
    isLoaded: false,
    setFlow: (nodes: Node[], edges: Edge[]) => {
        set({
            nodes: nodes,
            edges: edges,
            isFlowDirty: false
        });
    },
    setLoaded: () => {
        set({ isLoaded: true });
    },
    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes)
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges)
      });
    },
    addNode: () => {
      const newId = nanoid(10);
      const newNode = {
        id: newId,
        type: 'page',
        data: { label: newId },
        position: { x: 0, y: 0 } as XYPosition,
        style: {            
          border: '1px solid black',
        }
      };
      set(state => {
          const lastPosition = state.nodes.length > 0 ? state.nodes[state.nodes.length - 1].position : { x: 0, y: 0 };
          newNode.position = { x: lastPosition.x, y: lastPosition.y + 80 };
          return ({ nodes: [...state.nodes, newNode], isFlowDirty: true }); 
      });
      return newNode;
    },
    addEdge: (source: string, target: string, handleId: string) => {
        const newEdge = {
          id: nanoid(),
          source,
          target,
          sourceHandle: handleId
        };
        set({
          edges: [...get().edges, newEdge],
          isFlowDirty: true
        });
    },
    removeEdge: (edgeId: string) => {
        set({
          edges: get().edges.filter(edge => edge.id !== edgeId),
          isFlowDirty: true
        });
    },
    removeNode: (nodeId: string) => {
        set({
            nodes: get().nodes.filter(node => node.id !== nodeId),
            isFlowDirty: true
        });
    },
    setSelectedNode: (node: Node | null) => {
        set({ 
            selectedNode: node,
            nodes: get().nodes.map(n => ({
                ...n,
                style: {
                    ...n.style,
                    border: n.id === node?.id ? '1px solid red' : '1px solid black',
                },
            })),
        });
    },
    setSelectedEdge: (edge: any | null) => {
        set({ 
            selectedEdge: edge,
            edges: get().edges.map(e => ({
                ...e,
                style: {
                    ...e.style,
                    stroke: e.id === edge?.id ? 'red' : '#000',
                },
            })),
        });
    },
    updateNode: (updatedNode: any) => {
        set({
            nodes: get().nodes.map(node => 
                node.id === updatedNode.id
                ? { ...node, ...updatedNode }
                : node
            ),
            isFlowDirty: true
        });
        get().setSelectedNode(updatedNode);
    },
  }), { name: 'formFlowStore' }));
   
  export default useStore;