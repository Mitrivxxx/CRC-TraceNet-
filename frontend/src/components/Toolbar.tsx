import type { TopologySummary } from '../types';

interface ToolbarProps {
  name: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onNew: () => void;
  onLoad: (id: string) => void;
  topologies: TopologySummary[];
  currentId: string | null;
  saving: boolean;
  status: string | null;
  error: string | null;
}

/**
 * Pasek narzedzi nad kanwa: nazwa topologii, zapis, wczytanie zapisanej
 * topologii z listy oraz utworzenie nowej (czysta kanwa).
 */
export default function Toolbar({
  name,
  onNameChange,
  onSave,
  onNew,
  onLoad,
  topologies,
  currentId,
  saving,
  status,
  error,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar__group">
        <input
          className="toolbar__name"
          type="text"
          value={name}
          placeholder="Nazwa topologii"
          onChange={(e) => onNameChange(e.target.value)}
        />
        <button type="button" className="btn btn--primary" onClick={onSave} disabled={saving}>
          {saving ? 'Zapisywanie...' : currentId ? 'Zapisz zmiany' : 'Zapisz'}
        </button>
        <button type="button" className="btn" onClick={onNew}>
          Nowa
        </button>
      </div>

      <div className="toolbar__group">
        <label className="toolbar__load">
          <span className="toolbar__load-label">Wczytaj:</span>
          <select
            className="toolbar__select"
            value={currentId ?? ''}
            onChange={(e) => {
              if (e.target.value) {
                onLoad(e.target.value);
              }
            }}
          >
            <option value="" disabled>
              {topologies.length ? 'Wybierz topologie...' : 'Brak zapisanych'}
            </option>
            {topologies.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="toolbar__status">
        {error ? (
          <span className="toolbar__status-text toolbar__status-text--error">{error}</span>
        ) : status ? (
          <span className="toolbar__status-text">{status}</span>
        ) : null}
      </div>
    </div>
  );
}
