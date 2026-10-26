namespace NetSim.Api.Models;

/// <summary>
/// Typ urzadzenia sieciowego dostepny w palecie frontendu.
/// </summary>
/// <param name="Id">Stabilny identyfikator (np. "pc", "server").</param>
/// <param name="Name">Nazwa wyswietlana (np. "PC").</param>
/// <param name="Category">Kategoria logiczna (endpoint / infrastructure).</param>
/// <param name="Icon">Nazwa ikony / emoji uzywane w palecie.</param>
public record DeviceTypeDto(string Id, string Name, string Category, string Icon);

/// <summary>
/// Statyczny katalog typow urzadzen dostepnych w MVP.
/// </summary>
public static class DeviceCatalog
{
    public static readonly IReadOnlyList<DeviceTypeDto> Items = new List<DeviceTypeDto>
    {
        new("pc", "PC", "endpoint", "PC"),
        new("server", "Server", "endpoint", "SRV"),
        new("switch", "Switch", "infrastructure", "SW"),
        new("router", "Router", "infrastructure", "RT"),
    };
}
