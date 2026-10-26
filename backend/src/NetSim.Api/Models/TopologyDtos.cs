using System.Text.Json;

namespace NetSim.Api.Models;

/// <summary>Skrocony opis topologii (do listy).</summary>
public record TopologySummary(Guid Id, string Name, DateTime CreatedAt);

/// <summary>Pelna topologia wraz z grafem (wezly + polaczenia) jako JSON.</summary>
public record TopologyDetail(Guid Id, string Name, DateTime CreatedAt, JsonElement Data);

/// <summary>Zadanie zapisu/aktualizacji topologii.</summary>
public record SaveTopologyRequest(string Name, JsonElement Data);
