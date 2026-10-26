import type { Edge } from '@xyflow/react';

/** Typ urzadzenia sieciowego pobierany z backendu (/api/device-types). */
export interface DeviceType {
  id: string;
  name: string;
  category: string;
  icon: string;
}

/** Dane przechowywane w wezle React Flow dla urzadzenia na kanwie. */
export interface DeviceNodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  category: string;
  typeId: string;
  /** Podstawowa konfiguracja urzadzenia (edytowalna w formularzu). */
  hostname?: string;
  ipAddress?: string;
  notes?: string;
}

/** Skrocony opis zapisanej topologii (lista). */
export interface TopologySummary {
  id: string;
  name: string;
  createdAt: string;
}

/** Graf topologii zapisywany/odczytywany z backendu. */
export interface TopologyGraph {
  nodes: SerializedNode[];
  edges: Edge[];
}

/** Wezel w postaci serializowanej (zgodnej z backendem). */
export interface SerializedNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: DeviceNodeData;
}

/** Pelna topologia z backendu (GET /api/topologies/{id}). */
export interface TopologyDetail {
  id: string;
  name: string;
  createdAt: string;
  data: TopologyGraph;
}
