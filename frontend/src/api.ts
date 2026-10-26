import type {
  DeviceType,
  TopologyDetail,
  TopologyGraph,
  TopologySummary,
} from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5080';

/** Pobiera katalog typow urzadzen z backendu. */
export async function fetchDeviceTypes(): Promise<DeviceType[]> {
  const response = await fetch(`${API_URL}/api/device-types`);
  if (!response.ok) {
    throw new Error(`Nie udalo sie pobrac typow urzadzen (HTTP ${response.status})`);
  }
  return (await response.json()) as DeviceType[];
}

/** Lista zapisanych topologii. */
export async function listTopologies(): Promise<TopologySummary[]> {
  const response = await fetch(`${API_URL}/api/topologies`);
  if (!response.ok) {
    throw new Error(`Nie udalo sie pobrac listy topologii (HTTP ${response.status})`);
  }
  return (await response.json()) as TopologySummary[];
}

/** Pobiera pelna topologie (graf) po id. */
export async function getTopology(id: string): Promise<TopologyDetail> {
  const response = await fetch(`${API_URL}/api/topologies/${id}`);
  if (!response.ok) {
    throw new Error(`Nie udalo sie pobrac topologii (HTTP ${response.status})`);
  }
  return (await response.json()) as TopologyDetail;
}

/** Tworzy nowa topologie. Zwraca jej skrocony opis (z id). */
export async function createTopology(
  name: string,
  data: TopologyGraph,
): Promise<TopologySummary> {
  const response = await fetch(`${API_URL}/api/topologies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, data }),
  });
  if (!response.ok) {
    throw new Error(`Nie udalo sie zapisac topologii (HTTP ${response.status})`);
  }
  return (await response.json()) as TopologySummary;
}

/** Aktualizuje istniejaca topologie. */
export async function updateTopology(
  id: string,
  name: string,
  data: TopologyGraph,
): Promise<TopologySummary> {
  const response = await fetch(`${API_URL}/api/topologies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, data }),
  });
  if (!response.ok) {
    throw new Error(`Nie udalo sie zaktualizowac topologii (HTTP ${response.status})`);
  }
  return (await response.json()) as TopologySummary;
}
