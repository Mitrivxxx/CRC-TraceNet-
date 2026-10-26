import { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import DevicePalette from './components/DevicePalette';
import Canvas from './components/Canvas';
import { fetchDeviceTypes } from './api';
import type { DeviceType } from './types';

export default function App() {
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchDeviceTypes()
      .then((types) => {
        if (!cancelled) {
          setDeviceTypes(types);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Nieznany blad');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ReactFlowProvider>
      <div className="app">
        <header className="app__header">
          <h1 className="app__title">NetSim</h1>
          <span className="app__subtitle">Symulator sieci (MVP)</span>
        </header>
        <div className="app__body">
          <DevicePalette deviceTypes={deviceTypes} loading={loading} error={error} />
          <Canvas />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
