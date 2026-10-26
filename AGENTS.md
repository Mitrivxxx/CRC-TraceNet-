# NetSim — agenci AI

Krotkie role dla agentow. Po **kazdej** zmianie kodu zaktualizuj odpowiednia sekcje (Status / Pliki / Notatki). Nie rozbudowuj — max ~8 linii na agenta.

---

## sync (obowiazkowy)

- Po edycji kodu: popraw Status/Pliki/Notatki w agentach, ktorych dotyczy zmiana.
- Nowa funkcja / endpoint / komponent → dopisz plik do listy.
- Usuniecie / przeniesienie → usun lub popraw sciezke.
- Zmiana sprintu → zaktualizuj `sprint`.

---

## backend

- **Rola:** API .NET 10 (Minimal API), EF Core, topologie.
- **Status:** MVP gotowe (health, device-types, CRUD topologii).
- **Pliki:** `backend/src/NetSim.Api/Program.cs`, `Models/`, `Data/`, `Migrations/`.
- **Notatki:** Endpointy w jednym `Program.cs`. Migracje przy starcie. Testy: `backend/tests/`.

## frontend

- **Rola:** React + React Flow — kanwa, paleta, zapis topologii.
- **Status:** MVP gotowe (drag&drop, kable, config, toolbar).
- **Pliki:** `frontend/src/App.tsx`, `components/Canvas.tsx`, `DevicePalette.tsx`, `ConfigPanel.tsx`, `Toolbar.tsx`, `api.ts`, `types.ts`.
- **Notatki:** Brak UI transmisji / CRC (Sprint 2).

## crc

- **Rola:** Biblioteka kodowania cyklicznego + podzial na bloki.
- **Status:** nie rozpoczete (Sprint 2).
- **Pliki:** (plan) `backend/src/NetSim.Crc/`.
- **Notatki:** Cel: Compute/Append/Verify + testy xUnit; pozniej uzycie w API transmisji.

## transmission

- **Rola:** Symulacja wysylki pliku PC→Server z weryfikacja CRC.
- **Status:** nie rozpoczete (Sprint 2).
- **Pliki:** (plan) endpoint `POST /api/transmission/simulate` + UI panelu wyniku.
- **Notatki:** Odpowiedz per blok: ok / crc_error. Bez retransmisji i animacji w tym sprincie.

## infra

- **Rola:** Docker Compose, PostgreSQL, uruchomienie stacku.
- **Status:** gotowe.
- **Pliki:** `docker-compose.yml`, Dockerfiles backend/frontend, `.env.example`.
- **Notatki:** `docker compose up -d --build` → web :5173, api :5080.

## docs

- **Rola:** Dokumentacja projektu i sprintow.
- **Status:** aktualne po Sprincie 1 + plan Sprintu 2.
- **Pliki:** `docs/r1.md`, `docs/docs.md`, ten plik `AGENTS.md`.
- **Notatki:** `r1.md` = raport + plan Sprint 2 (CRC → API → UI).

## sprint

- **Aktualny:** Sprint 2 — CRC + pierwsza transmisja (OK/blad).
- **Poza zakresem:** porty, animacja kabla, retransmisja, serwer plikow.
- **Backlog:** porty/walidacja → wizualizacja → tryb bledow UI → file server → panel diagnostyczny.
