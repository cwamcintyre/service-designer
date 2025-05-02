import Dagre from '@dagrejs/dagre';
import { type Form } from '@/store/formTypes';
import { nanoid } from 'nanoid';
import {
    type Edge,
    type Node,
} from '@xyflow/react';

const getLayoutedElements = (nodes: Node[], edges: Edge[], options: { direction: string }) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });
 
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 250,
      height: node.measured?.height ?? 30,
    }),
  );
 
  Dagre.layout(g);
 
  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;
 
      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

function getFormGraph(form: Form) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!form.pages || form.pages.length === 0) {
        return { nodes, edges };
    }

    for (const page of form.pages) {
        const id = page.id || nanoid();
        const node: Node = {
            id: id,
            type: 'page',
            data: { label: page.pageId, conditions: page.conditions || [] },
            position: { x: 0, y: 0 },
            style: { border: '1px solid black' },
        };
        page.id = id;
        nodes.push(node);
    }

    // need to loop twice because the node ids are not stored in the form json..
    for (const page of form.pages) {

        // check for conditions first..
        const sourceNode = nodes.find(n => n.data.label === page.pageId);
        if (!sourceNode) continue; // skip if no source node
        if (page.conditions) {
            for (const condition of page.conditions) {
                condition.id = condition.id || nanoid(); // ensure each condition has a unique id
                const targetPage = form.pages.find(p => p.pageId === condition.nextPageId);
                const targetNode = nodes.find(n => n.data.label === condition.nextPageId);
                if (!targetPage || !targetNode) continue; // skip if no target page or target node
                
                const edge: Edge = {
                    id: nanoid(),
                    source: `${sourceNode.id}`, // unique edge id for each condition
                    sourceHandle: `condition-${condition.id}`, // unique handle id for each condition
                    target: targetNode.id,
                };
                edges.push(edge);
            }
        }

        const nextPage = form.pages.find(p => p.pageId === page.nextPageId);
        const targetNode = nodes.find(n => n.data.label === page.nextPageId);
        if (!nextPage || !targetNode) continue; // skip if no next page or target node

        const edge: Edge = {
            id: nanoid(),
            source: sourceNode.id,
            target: targetNode.id,
        };
        edges.push(edge);
    }

    return { nodes, edges };
}

function connectPages(edges: Edge[], form: Form) {
    for (const edge of edges) {
        const sourcePage = form.pages.find(p => p.id === edge.source);
        const targetPage = form.pages.find(p => p.id === edge.target);
        // default connection..
        if (!edge.sourceHandle || edge.sourceHandle?.startsWith('default-')) {
            if (sourcePage && targetPage) {
                sourcePage.nextPageId = targetPage.pageId;
            }
        }
        // conditional connection..
        else if (edge.sourceHandle?.startsWith('condition-')) {
            const conditionId = edge.sourceHandle.replace('condition-', '');
            const sourcePage = form.pages.find(p => p.id === edge.source);
            const targetPage = form.pages.find(p => p.id === edge.target);
            if (sourcePage && targetPage) {
                const condition = sourcePage.conditions?.find(c => c.id === conditionId);
                if (condition) {
                    if (targetPage.pageId) {
                        condition.nextPageId = targetPage.pageId;
                    }
                }
            }
        }
    }
}

const formUtilities = {
    getFormGraph,
    getLayoutedElements,
    connectPages
};

export default formUtilities;