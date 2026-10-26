import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type NodeTypes,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import DeviceNode, { type DeviceNodeType } from './DeviceNode';
import { DND_MIME } from './DevicePalette';
import ConfigPanel from './ConfigPanel';
import Toolbar from './Toolbar';
import {
  createTopology,
  getTopology,
  listTopologies,
  updateTopology,
} from '../api';
import type {
  DeviceNodeData,
  DeviceType,
  TopologyGraph,
  TopologySummary,
} from '../types';

const nodeTypes: NodeTypes = { device: DeviceNode };

// Jeden uniwersalny typ polaczenia ("kabel").
const CABLE_EDGE: Partial<Edge> = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#2563eb', strokeWidth: 2 },
};

/**
 * Glowne pole robocze (React Flow) wraz z paskiem narzedzi (zapis/odczyt
 * topologii) oraz panelem konfiguracji wybranego urzadzenia.
 */
export default function Canvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ReactFlowInstance<DeviceNodeType, Edge> | null>(null);
  const counterRef = useRef(0);

  const [nodes, setNodes, onNodesChange] = useNodesState<DeviceNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [name, setName] = useState('Nowa topologia');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [topologies, setTopologies] = useState<TopologySummary[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshTopologies = useCallback(async () => {
    try {
      setTopologies(await listTopologies());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Blad listy topologii');
    }
  }, []);

  useEffect(() => {
    void refreshTopologies();
  }, [refreshTopologies]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, ...CABLE_EDGE }, eds));
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData(DND_MIME);
      if (!raw || !instanceRef.current) {
        return;
      }

      const device = JSON.parse(raw) as DeviceType;
      const position = instanceRef.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      counterRef.current += 1;
      const newNode: DeviceNodeType = {
        id: crypto.randomUUID(),
        type: 'device',
        position,
        data: {
          label: `${device.name} ${counterRef.current}`,
          icon: device.icon,
          category: device.category,
          typeId: device.id,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  // --- Selekcja / konfiguracja ---
  const onNodeClick = useCallback((_: React.MouseEvent, node: DeviceNodeType) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

  const updateNodeData = useCallback(
    (id: string, patch: Partial<DeviceNodeData>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
      );
    },
    [setNodes],
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedNodeId((cur) => (cur === id ? null : cur));
    },
    [setNodes, setEdges],
  );

  // --- Zapis / odczyt topologii ---
  const buildGraph = useCallback(
    (): TopologyGraph => ({
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })),
      edges,
    }),
    [nodes, edges],
  );

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      setError('Podaj nazwe topologii.');
      return;
    }

    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const graph = buildGraph();
      if (currentId) {
        await updateTopology(currentId, name.trim(), graph);
        setStatus('Zapisano zmiany.');
      } else {
        const created = await createTopology(name.trim(), graph);
        setCurrentId(created.id);
        setStatus('Zapisano nowa topologie.');
      }
      await refreshTopologies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Blad zapisu');
    } finally {
      setSaving(false);
    }
  }, [name, currentId, buildGraph, refreshTopologies]);

  const handleLoad = useCallback(
    async (id: string) => {
      setError(null);
      setStatus(null);
      try {
        const detail = await getTopology(id);
        const loadedNodes: DeviceNodeType[] = (detail.data.nodes ?? []).map((n) => ({
          id: n.id,
          type: 'device',
          position: n.position,
          data: n.data,
        }));
        setNodes(loadedNodes);
        setEdges(detail.data.edges ?? []);
        setName(detail.name);
        setCurrentId(detail.id);
        setSelectedNodeId(null);
        counterRef.current = loadedNodes.length;
        setStatus(`Wczytano: ${detail.name}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Blad wczytywania');
      }
    },
    [setNodes, setEdges],
  );

  const handleNew = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setCurrentId(null);
    setName('Nowa topologia');
    setStatus('Utworzono nowa, pusta topologie.');
    setError(null);
    counterRef.current = 0;
  }, [setNodes, setEdges]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return (
    <div className="workspace">
      <Toolbar
        name={name}
        onNameChange={setName}
        onSave={handleSave}
        onNew={handleNew}
        onLoad={handleLoad}
        topologies={topologies}
        currentId={currentId}
        saving={saving}
        status={status}
        error={error}
      />
      <div className="workspace__body">
        <div className="canvas" ref={wrapperRef}>
          <ReactFlow<DeviceNodeType, Edge>
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={(instance) => {
              instanceRef.current = instance;
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={CABLE_EDGE}
            deleteKeyCode={['Backspace', 'Delete']}
            fitView
          >
            <Background gap={16} />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>
        <ConfigPanel
          node={selectedNode}
          onUpdate={updateNodeData}
          onDelete={deleteNode}
          onClose={() => setSelectedNodeId(null)}
        />
      </div>
    </div>
  );
}
