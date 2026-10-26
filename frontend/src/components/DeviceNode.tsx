import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { DeviceNodeData } from '../types';

export type DeviceNodeType = Node<DeviceNodeData, 'device'>;

/**
 * Wezel reprezentujacy urzadzenie sieciowe na kanwie.
 * Posiada handle (po lewej i prawej), do ktorych podlaczamy uniwersalny kabel.
 */
export default function DeviceNode({ data, selected }: NodeProps<DeviceNodeType>) {
  return (
    <div className={`device-node${selected ? ' device-node--selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="device-handle" />
      <div className="device-node__icon">{data.icon}</div>
      <div className="device-node__label">{data.label}</div>
      <Handle type="source" position={Position.Right} className="device-handle" />
    </div>
  );
}
