import type { DeviceNodeData } from '../types';
import type { DeviceNodeType } from './DeviceNode';

interface ConfigPanelProps {
  node: DeviceNodeType | null;
  onUpdate: (id: string, data: Partial<DeviceNodeData>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

/**
 * Prawy panel z formularzem konfiguracji wybranego urzadzenia.
 * Pozwala ustawic nazwe (etykiete), hostname, adres IP oraz opis.
 */
export default function ConfigPanel({ node, onUpdate, onDelete, onClose }: ConfigPanelProps) {
  if (!node) {
    return (
      <aside className="config config--empty">
        <p className="config__hint">Zaznacz urzadzenie na kanwie, aby je skonfigurowac.</p>
      </aside>
    );
  }

  const { data } = node;

  return (
    <aside className="config">
      <div className="config__header">
        <h2 className="config__title">Konfiguracja</h2>
        <button type="button" className="config__close" onClick={onClose} aria-label="Zamknij">
          x
        </button>
      </div>

      <div className="config__meta">
        <span className="config__meta-icon">{data.icon}</span>
        <span className="config__meta-type">
          {data.category === 'endpoint' ? 'Urzadzenie koncowe' : 'Infrastruktura'}
        </span>
      </div>

      <form className="config__form" onSubmit={(e) => e.preventDefault()}>
        <label className="config__field">
          <span className="config__label">Nazwa</span>
          <input
            className="config__input"
            type="text"
            value={data.label}
            placeholder="np. PC-Biuro-1"
            onChange={(e) => onUpdate(node.id, { label: e.target.value })}
          />
        </label>

        <label className="config__field">
          <span className="config__label">Hostname</span>
          <input
            className="config__input"
            type="text"
            value={data.hostname ?? ''}
            placeholder="np. pc-biuro-1"
            onChange={(e) => onUpdate(node.id, { hostname: e.target.value })}
          />
        </label>

        <label className="config__field">
          <span className="config__label">Adres IP</span>
          <input
            className="config__input"
            type="text"
            value={data.ipAddress ?? ''}
            placeholder="np. 192.168.0.10"
            onChange={(e) => onUpdate(node.id, { ipAddress: e.target.value })}
          />
        </label>

        <label className="config__field">
          <span className="config__label">Opis</span>
          <textarea
            className="config__input config__textarea"
            rows={3}
            value={data.notes ?? ''}
            placeholder="Dodatkowe informacje..."
            onChange={(e) => onUpdate(node.id, { notes: e.target.value })}
          />
        </label>
      </form>

      <div className="config__actions">
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => onDelete(node.id)}
        >
          Usun urzadzenie
        </button>
      </div>
    </aside>
  );
}
