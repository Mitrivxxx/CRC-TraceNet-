import type { DeviceType } from '../types';

interface DevicePaletteProps {
  deviceTypes: DeviceType[];
  loading: boolean;
  error: string | null;
}

/** Identyfikator formatu danych przenoszonych podczas drag&drop. */
export const DND_MIME = 'application/netsim-device';

/**
 * Lewy panel z lista urzadzen. Kazdy element jest przeciagalny (HTML5 DnD);
 * upuszczenie na kanwie tworzy nowy wezel.
 */
export default function DevicePalette({ deviceTypes, loading, error }: DevicePaletteProps) {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, device: DeviceType) => {
    event.dataTransfer.setData(DND_MIME, JSON.stringify(device));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="palette">
      <h2 className="palette__title">Urzadzenia</h2>
      <p className="palette__hint">Przeciagnij urzadzenie na pole robocze</p>

      {loading && <p className="palette__status">Ladowanie...</p>}
      {error && <p className="palette__status palette__status--error">{error}</p>}

      <div className="palette__list">
        {deviceTypes.map((device) => (
          <div
            key={device.id}
            className="palette__item"
            draggable
            onDragStart={(event) => onDragStart(event, device)}
          >
            <span className="palette__item-icon">{device.icon}</span>
            <span className="palette__item-name">{device.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
