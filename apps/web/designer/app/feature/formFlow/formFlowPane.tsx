import { useCallback, useRef, useEffect, useState } from 'react';
import type { Form } from "@/store/formTypes";
import {
  ReactFlow,
  Controls,
  ReactFlowProvider,
  ConnectionLineType,
  useNodesInitialized,
  useReactFlow,
  type NodeOrigin,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useShallow } from 'zustand/react/shallow'
import useFormFlowStore, { type FormFlowState } from '@/store/formFlowStore';
import useFormStore, { type FormState } from '@/store/formStore';
import PageNode from '@/feature/formFlow/pageNode';
import formUtil from '@/util/formUtil';

const nodeTypes = {
    page: PageNode,
}

const selector = (state: FormFlowState) => ({
    isFlowDirty: state.isFlowDirty,
    nodes: state.nodes,
    edges: state.edges,
    isLoaded: state.isLoaded,
    selectedNode: state.selectedNode,
    selectedEdge: state.selectedEdge,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    addNode: state.addNode,
    addEdge: state.addEdge,
    setSelectedNode: state.setSelectedNode,
    setSelectedEdge: state.setSelectedEdge,
    removeEdge: state.removeEdge,
    removeNode: state.removeNode,
    setFlow: state.setFlow,
    setLoaded: state.setLoaded,
});

const formSelector = (state: FormState) => ({
    addPage: state.addPage,
    removePage: state.removePage
});

const nodeOrigin: NodeOrigin = [0.5, 0.5];
const connectionLineStyle = { stroke: '#000', strokeWidth: 1 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'default' };
const options = {
  includeHiddenNodes: false,
};

export function FormFlowPane({ form, onEdit }: { form: Form; onEdit: (formId: string) => void }) {

    const {
        isFlowDirty, 
        nodes, 
        edges, 
        selectedNode, 
        selectedEdge, 
        onNodesChange, 
        onEdgesChange, 
        addNode, 
        addEdge, 
        setSelectedNode, 
        setSelectedEdge, 
        removeEdge, 
        removeNode,
        setFlow} = useFormFlowStore(useShallow(selector));    

    const { addPage, removePage } = useFormStore(useShallow(formSelector));

    const { getNodes, getEdges } = useReactFlow();
    
    const nodesInitialized = useNodesInitialized(options);
    
    const [nodesLayedOut, setNodesLayedOut] = useState(false);

    useEffect(() => {
        if (isFlowDirty) {
            return; // we're editing the flow, we don't want to initialise it..
        }     
        const graph = formUtil.getFormGraph(form);
        if (graph) {
            setFlow(graph.nodes, graph.edges);
            setNodesLayedOut(false);
        }        
    }, [form]);
  
    useEffect(() => {
        if (nodesInitialized && !nodesLayedOut) {
            const layedOut = formUtil.getLayoutedElements(getNodes(), getEdges(), { direction: 'TB' });
            setFlow(layedOut.nodes, layedOut.edges);
            setNodesLayedOut(true);
        }
    }, [nodesInitialized]);

    const editPage = (e: any) => {
        if (selectedNode) {
            onEdit(selectedNode.id);
        }
    };
    
    const deleteLink = (e: any) => {
        if (selectedEdge) {
            setSelectedEdge(null);
            removeEdge(selectedEdge.id);
        }
    };

    const deletePage = (e: any) => {
        if (selectedNode) {
            setSelectedNode(null);
            removeNode(selectedNode.id);
            removePage(selectedNode.data.label);
        }
    };

    const addNewPage = (e: any) => {
        const newNode = addNode();
        addPage(newNode.id);
    };

    const onConnect: OnConnect = useCallback(
        (params) => {
            addEdge(params.source, params.target, params.sourceHandle || "");
        },
        [addEdge]
    );

    const onNodeClick = useCallback((event: any, node: any) => {
        setSelectedNode(node);
    }, [setSelectedNode]);

    const onEdgeClick = useCallback((event: any, edge: any) => {
        setSelectedEdge(edge);
    }, [setSelectedEdge]);
    
    return (
        <div className="w-full h-full">
            <div className="w-full absolute z-10">
                <button id="delete-link" disabled={!selectedEdge} className={selectedEdge ? 
                    "bg-blue-500 text-white mt-4 mr-4 px-2 py-2 rounded cursor-pointer float-right" : 
                    "bg-gray-300 mt-4 mr-4 px-2 py-2 rounded cursor-not-allowed opacity-50 float-right"} 
                    onClick={(e) => deleteLink(e)}>
                    Delete Link
                </button>
                <button id="delete-page" disabled={!selectedNode} className={selectedNode ? 
                    "bg-blue-500 text-white mt-4 mr-4 px-2 py-2 rounded cursor-pointer float-right" : 
                    "bg-gray-300 mt-4 mr-4 px-2 py-2 rounded cursor-not-allowed opacity-50 float-right"} 
                    onClick={(e) => deletePage(e)}>
                    Delete Page
                </button>
                <button id="edit-page" disabled={!selectedNode} className={selectedNode ? 
                    "bg-blue-500 text-white mt-4 mr-4 px-2 py-2 rounded cursor-pointer float-right" : 
                    "bg-gray-300 mt-4 mr-4 px-2 py-2 rounded cursor-not-allowed opacity-50 float-right"} 
                    onClick={(e) => editPage(e)}>
                    Edit Page
                </button>
                <button id="add-page" className="bg-blue-500 text-white mt-4 mr-4 px-2 py-2 rounded cursor-pointer float-right" onClick={(e) => addNewPage(e)}>
                    Add Page
                </button>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeOrigin={nodeOrigin}
                connectionLineStyle={connectionLineStyle}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineType={ConnectionLineType.Straight}
                fitView
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={() => { setSelectedNode(null); setSelectedEdge(null); }}
                nodeTypes={nodeTypes}
            >
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
}

export default function FormPane ({ form, onEdit }: { form: Form; onEdit: (formId: string) => void }) {
  return (
    <ReactFlowProvider>
        <FormFlowPane form={form} onEdit={onEdit} />
    </ReactFlowProvider>
  );
}